import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { encodeFunctionData, formatEther, getAddress, parseEther } from "viem";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse } from "@/utils/frameErrorResponse";
import { formatNumber } from "@/utils/format";
import { SupportedNounsBuilderDao, nounsBuilderAuctionConfigs } from "../../../../configs";
import { nounsBuilderAuctionAbi } from "@/common/nounsBuilder/abis/auction";
import { getCurrentAuction } from "@/common/nounsBuilder/data/getCurrentAuction";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
  const config = nounsBuilderAuctionConfigs[params.slug as SupportedNounsBuilderDao];

  if (!config) {
    console.error("No auction config found - ", params.slug);
    return Response.error();
  }

  const frameRequest: FrameRequest = await req.json();

  const [frameValidationResponse, auctionData] = await Promise.all([
    getFrameMessageWithNeynarApiKey(frameRequest),
    getCurrentAuction({ client: config.client, collectionAddress: config.collectionAddress }),
  ]);

  const userAddressString = frameValidationResponse?.message?.address;

  if (!frameValidationResponse.isValid || !auctionData || !userAddressString) {
    console.error(
      "nouns builder auction bid tx endpoint: invalid frame request - ",
      params.slug,
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
    if (bid < BigInt(auctionData.nextMinBid)) {
      throw Error("Bid too low");
    }
  } catch (e) {
    return frameErrorResponse(
      `Invalid bid, must be at least ${formatNumber(Math.ceil(Number(formatEther(auctionData.nextMinBid)) * 1e4) / 1e4, 4)} Ξ`
    );
  }

  const txResponse = {
    chainId: `eip155:${config.client.chain!.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: nounsBuilderAuctionAbi,
      to: auctionData.auctionAddress,
      data: encodeFunctionData({
        abi: nounsBuilderAuctionAbi,
        functionName: "createBidWithReferral",
        args: [auctionData.tokenId, getAddress("0x65599970Af18EeA5f4ec0B82f23B018fd15EBd11")],
      }),
      value: bid.toString(),
    },
  } as FrameTransactionResponse;

  return Response.json(txResponse);
}
