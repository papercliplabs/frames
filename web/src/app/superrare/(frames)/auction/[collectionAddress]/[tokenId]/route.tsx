import { SUPERRARE_BASE_URL } from "@/app/superrare/utils/constants";
import { getAuctionData } from "@/app/superrare/data/queries/getAuctionData";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameButtonMetadata } from "@coinbase/onchainkit";
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

  const href = `${SUPERRARE_BASE_URL}/${params.collectionAddress.toLowerCase()}/${params.tokenId}`;
  return frameResponseWrapper({
    req,
    browserRedirectUrl: href,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    // TODO(spennyp): make txn endpoint
    buttons: [
      { label: "Refresh", action: "post" },
      { label: "View", action: "link", target: href },
      ...(auctionData.isValidForFrameTxn
        ? [{ label: "Bid", action: "post", target: href } as FrameButtonMetadata]
        : []),
    ],
  });
}

export const GET = response;
export const POST = response;
