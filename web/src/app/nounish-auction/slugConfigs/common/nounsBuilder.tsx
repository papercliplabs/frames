import { auctionAbi } from "@/abis/nounsBuilder/auction";
import { ColorConfig, GetNounishAuctionDataParams, NounishAuctionData } from "./types";
import { tokenAbi } from "@/abis/nounsBuilder/token";
import { parseBase64String } from "./utils";
import { multicall, readContract } from "viem/actions";
import { formatNumber, formatTimeLeft } from "@/utils/format";
import { Address, encodeFunctionData, formatEther } from "viem";
import { getWalletName } from "@/utils/wallet";
import { metadataAbi } from "@/abis/nounsBuilder/metadata";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { bigIntMax } from "@/utils/bigInt";
import { paperclipIcon } from "@/utils/paperclip";
import { getImageProps } from "next/image";

export type NounsBuilderAuctionData = NounishAuctionData & {
  namePrefix: string;
  colors: ColorConfig;
};

export async function getNounBuilderAuctionData({
  client,
  auctionAddress,
  tokenAddress,
  metadataAddress,
}: GetNounishAuctionDataParams & { metadataAddress: Address }): Promise<NounishAuctionData> {
  const [nounId, currentBid, currentBidder, startTime, endTime, settled] = await readContract(client, {
    address: auctionAddress,
    abi: auctionAbi,
    functionName: "auction",
  });

  const [tokenUri, metadata, minBidIncrement, reservePrice] = await multicall(client, {
    contracts: [
      {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "tokenURI",
        args: [nounId],
      },
      {
        address: metadataAddress,
        abi: metadataAbi,
        functionName: "getAttributes",
        args: [nounId],
      },
      {
        address: auctionAddress,
        abi: auctionAbi,
        functionName: "minBidIncrement",
      },
      {
        address: auctionAddress,
        abi: auctionAbi,
        functionName: "reservePrice",
      },
    ],
    allowFailure: false,
  });

  const metadataObject = JSON.parse(metadata[0]);

  const imgSrc = parseBase64String(tokenUri).image;

  const now = Date.now() / 1000;
  const timeRemainingSec = settled ? 0 : Math.max(Number(endTime.toString()) - now, 0);
  const timeRemainingFormatted = formatTimeLeft(timeRemainingSec);
  const currentBidFormatted = formatNumber(formatEther(currentBid), 4);

  // Force rounding up so we guarantee at least the min bid
  const nextBidMin = formatNumber(
    Math.ceil(
      Number(formatEther(bigIntMax(currentBid + (currentBid * minBidIncrement) / BigInt(100), reservePrice))) * 1e5
    ) / 1e5,
    5
  );
  const requiresSettlement = !settled && timeRemainingSec == 0;

  const bidder = await getWalletName({ address: currentBidder });

  return {
    nounId: Number(nounId.toString()),
    nounImgSrc: imgSrc,
    attributes: metadataObject,
    timeRemaining: timeRemainingFormatted,
    bid: currentBidFormatted,
    bidder,
    nextBidMin,
    requiresSettlement,
  };
}

export function getNounsBuilderBidTransactionData({
  client,
  auctionAddress,
  nounId,
  bidAmount,
}: GetNounishAuctionDataParams & { nounId: bigint; bidAmount: bigint }): FrameTransactionResponse {
  return {
    chainId: `eip155:${client.chain?.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: auctionAbi,
      to: auctionAddress,
      data: encodeFunctionData({
        abi: auctionAbi,
        functionName: "createBid",
        args: [nounId],
      }),
      value: bidAmount.toString(),
    },
  };
}

export function getNounsBuilderSettleTransactionData({
  client,
  auctionAddress,
}: GetNounishAuctionDataParams): FrameTransactionResponse {
  return {
    chainId: `eip155:${client.chain?.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: auctionAbi,
      to: auctionAddress,
      data: encodeFunctionData({
        abi: auctionAbi,
        functionName: "settleCurrentAndCreateNewAuction",
      }),
      value: "0",
    },
  };
}

export function NounBuilderAuctionStatus({
  nounId,
  nounImgSrc,
  timeRemaining,
  bid,
  bidder,
  namePrefix,
  colors,
}: NounsBuilderAuctionData) {
  const rowEntries: { name: string; value: string }[] = [
    { name: "Current bid", value: bid + " ETH" },
    { name: "Time left", value: timeRemaining },
    { name: "Highest bid", value: bidder },
  ];

  // webp from nouns builder api, this solves
  const imgSrc = getImageProps({ src: nounImgSrc, alt: "", width: 600, height: 600 }).props.src;

  return (
    <div
      tw="flex flex-col w-full h-full justify-center items-center w-[1200px] h-[1200px] relative"
      style={{ color: colors.text.primary }}
    >
      <span
        tw="w-full h-[54%] shrink-0 flex justify-center items-end"
        style={{ backgroundColor: colors.background.primary }}
      >
        <img src={`${process.env.NEXT_PUBLIC_URL}/${imgSrc}`} width={600} height={600} alt={`#${nounId}`} />
      </span>
      <span
        tw="w-full h-[46%] p-[80px] py-[70px] flex flex-col"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <span tw="text-[100px] pb-[24px] font-bold">
          {namePrefix}
          {nounId.toString()}
        </span>
        <span tw="text-[52px] flex flex-col font-bold">
          {rowEntries.map((entry, i) => (
            <span tw="flex flex-row justify-between pt-[24px]" key={i}>
              <span tw="font-medium" style={{ color: colors.text.secondary }}>
                {entry.name}
              </span>
              <span tw="font-bold">{entry.value}</span>
            </span>
          ))}
        </span>
      </span>
      {paperclipIcon}
    </div>
  );
}

export function NounBuilderReviewBid({
  nounId,
  nounImgSrc,
  timeRemaining,
  bid,
  bidder,
  namePrefix,
  colors,
  newBidAmount,
}: NounsBuilderAuctionData & { newBidAmount: string }) {
  return (
    <div
      tw="flex flex-col w-full h-full justify-center items-center w-[1200px] h-[1200px] p-[80px]"
      style={{ color: colors.text.primary, backgroundColor: colors.background.secondary }}
    >
      <div tw="text-[80px] font-bold">Review your bid</div>
      <div
        tw="w-full h-[634px] border-[8px] rounded-[40px] my-[80px] flex justify-center items-center text-[100px] font-bold"
        style={{ borderColor: colors.text.secondary }}
      >
        {newBidAmount} ETH
      </div>
      <div tw="flex flex-row justify-between w-full text-[52px]">
        <span tw="font-medium" style={{ color: colors.text.secondary }}>
          Current bid
        </span>
        <span tw="font-bold">{bid} ETH</span>
      </div>
      {paperclipIcon}
    </div>
  );
}
