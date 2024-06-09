import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { base } from "viem/chains";
import { encodeFunctionData, formatEther, getAddress, parseEther } from "viem";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse } from "@/common/utils/frameResponse";
import { formatNumber } from "@/utils/format";
import { getCurrentAuctionData } from "../../data/getCurrentAuctionData";
import { vrbsAuctionHouseContract } from "../../contracts/vrbsAuctionHouse";
import { PAPERCLIP_LABS_REFERRAL_ADDRESS } from "../../utils/client";
import "@/common/utils/bigIntPolyfill";

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();

  const [frameValidationResponse, auctionData] = await Promise.all([
    getFrameMessageWithNeynarApiKey(frameRequest),
    getCurrentAuctionData(),
  ]);

  const userAddressString = frameValidationResponse?.message?.address;

  if (!frameValidationResponse.isValid || !auctionData || !userAddressString) {
    console.error(
      "vrbs auction bid tx endpoint: invalid frame request - ",
      frameRequest,
      userAddressString,
      auctionData
    );
    return frameErrorResponse("Error: Invalid frame request");
  }

  const userAddress = getAddress(userAddressString);

  const nowTime = BigInt(Math.floor(Date.now() / 1000));
  const auctionEnded = nowTime > BigInt(auctionData.endTime);
  if (auctionEnded) {
    return frameErrorResponse("Error: auction ended");
  }

  let bid: bigint;
  try {
    bid = parseEther(frameValidationResponse.message.input.trim());
    if (bid < BigInt(auctionData.nextMinBid)) {
      throw Error("Bid too low");
    }
  } catch (e) {
    return frameErrorResponse(
      `Invalid bid, must be at least ${formatNumber(formatEther(auctionData.nextMinBid), 4)} Ξ`
    );
  }

  const txResponse = {
    chainId: `eip155:${base.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: vrbsAuctionHouseContract.abi,
      to: vrbsAuctionHouseContract.address,
      data: encodeFunctionData({
        abi: vrbsAuctionHouseContract.abi,
        functionName: "createBid",
        args: [auctionData.tokenId, userAddress, PAPERCLIP_LABS_REFERRAL_ADDRESS],
      }),
      value: bid.toString(),
    },
  } as FrameTransactionResponse;

  return Response.json(txResponse);
}
