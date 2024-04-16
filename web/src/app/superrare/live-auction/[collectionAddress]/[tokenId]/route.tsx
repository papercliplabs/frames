import { NextRequest } from "next/server";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { SUPERRARE_BASE_URL } from "@/app/superrare/constants";

async function response(
  req: NextRequest,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const externalLink = `${SUPERRARE_BASE_URL}/${params.collectionAddress}/${params.tokenId}`.toLowerCase();
  return frameResponseWrapper({
    req,
    browserRedirectUrl: externalLink,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Refresh", action: "post" },
      { label: "Bid", action: "post", target: externalLink },
    ],
  });
}

export const GET = response;
export const POST = response;
