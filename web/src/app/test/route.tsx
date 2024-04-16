import { NextRequest } from "next/server";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";

async function response(req: NextRequest): Promise<Response> {
  return frameResponseWrapper({
    req,
    browserRedirectUrl: "https://paperclip.xyz",
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [{ label: "Refresh", action: "post" }],
  });
}

export const GET = response;
export const POST = response;
