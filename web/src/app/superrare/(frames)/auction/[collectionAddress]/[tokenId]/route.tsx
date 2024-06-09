import { getAuctionData } from "@/app/superrare/data/queries/getAuctionData";
import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { getAddress } from "viem";
import { SUPERRARE_CHAIN_CONFIG } from "@/app/superrare/config";

async function response(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = BigInt(params.tokenId);

  let auctionData = await getAuctionData({
    collectionAddress: collectionAddress,
    tokenId: tokenId,
  });

  if (!auctionData) {
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_URL}/superrare/fallback/${collectionAddress}/${tokenId.toString()}`,
      302
    );
  }

  const transactionFlowSearchParams = new URLSearchParams({ successMessage: "Your bid was submitted." });
  const href = `${SUPERRARE_CHAIN_CONFIG.superrareBaseUrl}/${params.collectionAddress.toLowerCase()}/${params.tokenId}`;
  return frameResponse({
    req,
    // browserRedirectUrl: href,
    postUrl: `${process.env.NEXT_PUBLIC_URL}/superrare/auction/${collectionAddress}/${tokenId}`,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    input: auctionData.isValidForFrameTxn ? { text: "Enter ETH bid amount" } : undefined,
    buttons: [
      {
        label: "Refresh",
        action: "post",
      },
      { label: "View", action: "link", target: href },
      ...(auctionData.isValidForFrameTxn
        ? [
            {
              label: "Bid",
              action: "tx",
              target: relativeEndpointUrl(req, "/tx"),
              postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/superrare?${transactionFlowSearchParams.toString()}`,
            } as FrameButtonMetadata,
          ]
        : []),
    ],
    state: {
      txSuccessTarget: req.url,
      txFailedTarget: req.url,
    },
  });
}

export const GET = response;
export const POST = response;
