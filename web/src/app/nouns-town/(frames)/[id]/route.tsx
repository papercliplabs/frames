import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { FRAME_CONFIGS } from "./config";

async function response(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const config = FRAME_CONFIGS[parseInt(params.id)];
  if (!config) {
    console.error("Invalid id", params.id);
    return Response.error();
  }

  return frameResponse({
    req,
    browserRedirectUrl: "https://nounswap.xyz", // TODO: replace with actual
    ogTitle: "Nouns Town",
    appName: "nouns-town",
    postUrl: relativeEndpointUrl(req, ""),
    image: config.image,
    buttons: config.buttons,
  });
}

export const GET = response;
export const POST = response;
