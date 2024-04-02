import { encodeFunctionData, formatEther } from "viem";
import { multicall, readContract } from "viem/actions";
import { ImageData, getNounData } from "@nouns/assets";
import { getWalletName } from "@/utils/wallet";
import { formatNumber, formatTimeLeft } from "@/utils/format";
import { GetNounishAuctionDataParams, NounishAuctionData } from "./types";
import { auctionAbi } from "@/abis/ogNouns/auction";
import { tokenAbi } from "@/abis/ogNouns/token";
import { paperclipIcon } from "@/utils/paperclip";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { parseBase64String } from "./utils";
import { bigIntMax } from "@/utils/bigInt";

export type Colors = {
  background: string;
  primary: string;
  secondary: string;
};

export type OgNounsAuctionData = NounishAuctionData & {
  namePrefix: string;
  colors: Colors;
};

const { palette } = ImageData; // Used with `buildSVG``

export async function getOgNounsAuctionData({
  client,
  auctionAddress,
  tokenAddress,
}: GetNounishAuctionDataParams): Promise<NounishAuctionData> {
  const [nounId, currentBid, startTime, endTime, currentBidder, settled] = await readContract(client, {
    address: auctionAddress,
    abi: auctionAbi,
    functionName: "auction",
  });

  const [[background, body, accessory, head, glasses], uri, minBidIncrementPercentage, reservePrice] = await multicall(
    client,
    {
      contracts: [
        {
          address: tokenAddress,
          abi: tokenAbi,
          functionName: "seeds",
          args: [nounId],
        },
        {
          address: tokenAddress,
          abi: tokenAbi,
          functionName: "tokenURI",
          args: [nounId],
        },
        {
          address: auctionAddress,
          abi: auctionAbi,
          functionName: "minBidIncrementPercentage",
          args: [],
        },
        {
          address: auctionAddress,
          abi: auctionAbi,
          functionName: "reservePrice",
          args: [],
        },
      ],
      allowFailure: false,
    }
  );

  const now = Date.now() / 1000;
  const timeRemainingSec = settled ? 0 : Math.max(Number(endTime.toString()) - now, 0);
  const timeRemainingFormatted = formatTimeLeft(timeRemainingSec);
  const currentBidFormatted = formatNumber(formatEther(currentBid), 4);

  // Force rounding up so we guarantee at least the min bid
  const nextBidMin = formatNumber(
    Math.ceil(
      Number(
        formatEther(
          bigIntMax(currentBid + (currentBid * BigInt(minBidIncrementPercentage)) / BigInt(100), reservePrice)
        )
      ) * 1e5
    ) / 1e5,
    5
  );
  const requiresSettlement = !settled && timeRemainingSec == 0;

  const bidder = await getWalletName({ address: currentBidder });

  return {
    nounId: Number(nounId.toString()),
    nounImgSrc: parseBase64String(uri).image,
    attributes: {
      background: background.toString(),
      body: body.toString(),
      accessory: accessory.toString(),
      head: head.toString(),
      glasses: glasses.toString(),
    },
    timeRemaining: timeRemainingFormatted,
    bid: currentBidFormatted,
    bidder,
    nextBidMin,
    requiresSettlement,
  };
}

export function getNounsBidTransactionData({
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

export function NounAuctionStatus({
  nounId,
  nounImgSrc,
  timeRemaining,
  bid,
  bidder,
  namePrefix,
  colors,
}: OgNounsAuctionData) {
  const rowEntries: { name: string; value: string }[] = [
    { name: "Current bid", value: bid + " ETH"},
    { name: "Time left", value: timeRemaining },
    { name: "Highest bid", value: bidder },
  ];

  return (
    <div
      tw="flex flex-col w-full h-full justify-center items-center w-[1200px] h-[1200px]"
      style={{ color: colors.primary }}
    >
      <span tw="w-full h-[54%] shrink-0 flex justify-center items-end" style={{ backgroundColor: colors.background }}>
        <img src={nounImgSrc} width={600} height={600} alt={`#${nounId}`} />
      </span>
      <span tw="bg-white w-full h-[46%] p-[80px] py-[70px] flex flex-col">
        <span tw="text-[120px] pb-[24px]">
          {namePrefix} {nounId}
        </span>
        <span tw="text-[52px] flex flex-col font-bold" style={{ fontFamily: "pt-root-ui" }}>
          {rowEntries.map((entry, i) => (
            <span tw="flex flex-row justify-between pt-[24px]" key={i}>
              <span tw="font-medium" style={{ color: colors.secondary }}>
                {entry.name}
              </span>
              <span>{entry.value}</span>
            </span>
          ))}
        </span>
      </span>
      {paperclipIcon}
    </div>
  );
}

export function NounReviewBid({
  nounId,
  nounImgSrc,
  timeRemaining,
  bid,
  bidder,
  namePrefix,
  colors,
  newBidAmount,
}: OgNounsAuctionData & { newBidAmount: string }) {
  return (
    <div
      tw="flex flex-col w-full h-full justify-center items-center w-[1200px] h-[1200px] p-[80px]"
      style={{ color: colors.primary, backgroundColor: colors.background }}
    >
      <div tw="text-[80px] font-bold">Review your bid</div>
      <div
        tw="w-full h-[634px] border-[8px] rounded-[40px] my-[80px] flex justify-center items-center text-[100px] font-bold"
        style={{ borderColor: colors.secondary }}
      >
        {newBidAmount} ETH
      </div>
      <div tw="flex flex-row justify-between w-full text-[52px]" style={{fontFamily: "pt-root-ui"}}>
        <span tw="font-medium" style={{ color: colors.secondary }}>
          Current bid
        </span>
        <span tw="font-bold">{bid} ETH</span>
      </div>
      {paperclipIcon}
    </div>
  );
}
