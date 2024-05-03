import { SUPERRARE_BASE_URL } from "@/app/superrare/utils/constants";
import { getAuctionData } from "@/app/superrare/data/queries/getAuctionData";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { getAddress } from "viem";

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
  const href = `${SUPERRARE_BASE_URL}/${params.collectionAddress.toLowerCase()}/${params.tokenId}`;
  return frameResponseWrapper({
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

export const maxDuration = 300; // Allow up to 5min for first fetch
