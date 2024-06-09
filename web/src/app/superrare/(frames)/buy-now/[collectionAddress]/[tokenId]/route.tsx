import { getBuyNowData } from "@/app/superrare/data/queries/getBuyNowData";
import { SUPERRARE_BASE_URL } from "@/app/superrare/utils/constants";
import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { NextRequest } from "next/server";
import { getAddress } from "viem";

async function response(
  req: NextRequest,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = BigInt(params.tokenId);

  const buyNowData = await getBuyNowData({
    collectionAddress: collectionAddress,
    tokenId: tokenId,
  });

  if (!buyNowData) {
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_URL}/superrare/fallback/${collectionAddress}/${tokenId.toString()}`,
      302
    );
  }

  const transactionFlowSearchParams = new URLSearchParams({ successMessage: "You bought the artwork." });
  const href = `${SUPERRARE_BASE_URL}/${params.collectionAddress.toLowerCase()}/${params.tokenId}`;
  return frameResponse({
    req,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "View", action: "link", target: href },
      ...(buyNowData.isValidForFrameTxn
        ? [
            {
              label: "Buy now",
              action: "tx",
              target: relativeEndpointUrl(req, "/tx"),
              postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/superrare?${transactionFlowSearchParams.toString()}`,
            } as FrameButtonMetadata,
          ]
        : []),
    ],
  });
}

export const GET = response;
export const POST = response;
