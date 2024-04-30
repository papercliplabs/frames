import { relativeEndpointUrl } from "@/utils/urlHelpers";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { BEANS_WEBSITE_URL } from "@/common/beans/config/constants";
import { BEANIGOTCHI_FRAME_BASE_URL } from "../../utils/constants";

async function response(req: Request): Promise<Response> {
  return frameResponseWrapper({
    req,
    browserRedirectUrl: BEANS_WEBSITE_URL,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Leaderboard", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/leaderboard` },
      { label: "My Bean", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/router` },
    ],
  });
}

export const GET = response;
export const POST = response;
