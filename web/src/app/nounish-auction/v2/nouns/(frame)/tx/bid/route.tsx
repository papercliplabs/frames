import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { base, mainnet } from "viem/chains";
import { encodeFunctionData, formatEther, getAddress, parseEther } from "viem";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse } from "@/utils/frameErrorResponse";
import { formatNumber } from "@/utils/format";
import "@/common/utils/bigIntPolyfill";
import { getCurrentAuction } from "@/common/nouns/data/getCurrentAuction";
import { nounsAuctionHouseContract } from "@/common/nouns/contracts/auctionHouse";

const NOUNSWAP_REFERRAL_CLIENT_ID = 5;

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();

  const [frameValidationResponse, auction] = await Promise.all([
    getFrameMessageWithNeynarApiKey(frameRequest),
    getCurrentAuction(),
  ]);

  const userAddressString = frameValidationResponse?.message?.address;

  if (!frameValidationResponse.isValid || !auction || !userAddressString) {
    console.error("nouns auction bid tx endpoint: invalid frame request - ", frameRequest, userAddressString, auction);
    return frameErrorResponse("Error: Invalid frame request");
  }

  const nowTime = BigInt(Math.floor(Date.now() / 1000));
  const auctionEnded = nowTime > BigInt(auction.endTime);
  if (auctionEnded) {
    return frameErrorResponse("Error: auction ended");
  }

  let bid: bigint;
  try {
    bid = parseEther(frameValidationResponse.message.input.trim());
    if (bid < BigInt(auction.nextMinBid)) {
      throw Error("Bid too low");
    }
  } catch (e) {
    return frameErrorResponse(`Invalid bid, must be at least ${formatNumber(formatEther(auction.nextMinBid), 4)} Ξ`);
  }

  const txResponse = {
    chainId: `eip155:${mainnet.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: nounsAuctionHouseContract.abi,
      to: nounsAuctionHouseContract.address,
      data: encodeFunctionData({
        abi: nounsAuctionHouseContract.abi,
        functionName: "createBid",
        args: [auction.nounId, NOUNSWAP_REFERRAL_CLIENT_ID],
      }),
      value: bid.toString(),
    },
  } as FrameTransactionResponse;

  return Response.json(txResponse);
}
