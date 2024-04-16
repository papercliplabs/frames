import { NextRequest } from "next/server";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { SUPERRARE_BASE_URL } from "@/app/superrare/constants";

async function response(req: NextRequest, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  const externalLink = `${SUPERRARE_BASE_URL}/releases/${params.collectionAddress.toLowerCase()}`;
  return frameResponseWrapper({
    req,
    browserRedirectUrl: externalLink,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [{ label: "Mint", action: "post", target: externalLink }],
  });
}

export const GET = response;
export const POST = response;
