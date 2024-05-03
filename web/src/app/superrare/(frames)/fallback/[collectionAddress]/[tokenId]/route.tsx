import { SUPERRARE_BASE_URL } from "@/app/superrare/utils/constants";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { NextRequest } from "next/server";

async function response(
  req: NextRequest,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const href = `${SUPERRARE_BASE_URL}/${params.collectionAddress.toLowerCase()}/${params.tokenId}`;
  return frameResponseWrapper({
    req,
    // browserRedirectUrl: href,
    // Push fallback requests back through the router
    postUrl: `${process.env.NEXT_PUBLIC_URL}/superrare/router/${params.collectionAddress}/${params.tokenId}`,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: "Refresh",
        action: "post",
      },
      { label: "View", action: "link", target: href },
    ],
  });
}

export const GET = response;
export const POST = response;

export const maxDuration = 300; // Allow up to 5min for first fetch
