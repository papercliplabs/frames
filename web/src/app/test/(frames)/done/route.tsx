import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";

async function response(req: Request): Promise<Response> {
  return frameResponseWrapper({
    req,
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/lil-nouns-auction-house.png`,
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: "DONE!",
        action: "post",
      },
    ],
  });
}

export const GET = response;
export const POST = response;
