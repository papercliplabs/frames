import { relativeEndpointUrl } from "@/utils/urlHelpers";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { BEANS_WEBSITE_URL } from "@/common/beans/config/constants";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { BEANIGOTCHI_FRAME_BASE_URL } from "../../../utils/constants";

async function response(req: Request): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const fid = frameRequest.untrustedData.fid;

  return frameResponseWrapper({
    req,
    browserRedirectUrl: BEANS_WEBSITE_URL,
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/image/${fid}?t=${Date.now()}`,
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "<-", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/1` },
      { label: "How to Play", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/how-to/1` },
      { label: "Leaderboard", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/leaderboard` },
      { label: "->", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/3` },
    ],
  });
}

export const POST = response;
