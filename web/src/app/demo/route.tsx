import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";

async function response(req: Request): Promise<Response> {
  return frameResponseWrapper({
    req,
    browserRedirectUrl: "https://google.com",
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [{ label: "Refresh", action: "post" }],
  });
}

export const GET = response;
export const POST = response;
