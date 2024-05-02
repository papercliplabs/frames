import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { mainnet } from "viem/chains";
import { SUPERRARE_BRAZZER_ADDRESS, SUPERRARE_NETWORK_FEE_PERCENT } from "@/app/superrare/utils/constants";
import { encodeFunctionData, formatEther, getAddress, parseEther, zeroAddress } from "viem";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse } from "@/utils/frameErrorResponse";
import { getAuctionDataUncached } from "@/app/superrare/data/queries/getAuctionData";
import { formatNumber } from "@/utils/format";
import { brazzerAbi } from "@/abis/superrare/brazzer";

export async function POST(
  req: NextRequest,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = BigInt(params.tokenId);
  const frameRequest: FrameRequest = await req.json();

  const [frameValidationResponse, auctionData] = await Promise.all([
    getFrameMessageWithNeynarApiKey(frameRequest),
    getAuctionDataUncached({ collectionAddress, tokenId }),
  ]);

  const userAddressString = frameValidationResponse?.message?.address;

  if (!frameValidationResponse.isValid || !auctionData || !userAddressString) {
    console.error(
      "auction-bid tx endpoint: invalid frame request - ",
      collectionAddress,
      frameRequest,
      userAddressString,
      auctionData
    );
    return frameErrorResponse("Error: Invalid frame request");
  }

  const nowTime = BigInt(Math.floor(Date.now() / 1000));
  const auctionEnded = nowTime > BigInt(auctionData.endTime);

  if (auctionEnded) {
    return frameErrorResponse("Error: auction ended");
  }

  let bid: bigint;
  try {
    bid = parseEther(frameValidationResponse.message.input.trim());
  } catch (e) {
    return frameErrorResponse(
      `Invalid bid, must be at least ${formatNumber(formatEther(auctionData.nextMinBid), 4)} Ξ`
    );
  }

  const bidWithFee = bid + (bid * SUPERRARE_NETWORK_FEE_PERCENT) / BigInt(100);

  const txResponse = {
    chainId: `eip155:${mainnet.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: brazzerAbi,
      to: SUPERRARE_BRAZZER_ADDRESS,
      data: encodeFunctionData({
        abi: brazzerAbi,
        functionName: "bid",
        args: [collectionAddress, tokenId, auctionData.currency.address, bid],
      }),
      value: bidWithFee.toString(),
    },
  } as FrameTransactionResponse;

  return Response.json(txResponse);
}
