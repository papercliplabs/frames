import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { frameResponse } from "@/common/utils/frameResponse";
import { BEANS_WEBSITE_URL } from "@/common/beans/config/constants";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { BEANIGOTCHI_FRAME_BASE_URL } from "../../../utils/constants";

async function response(req: Request): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const fid = frameRequest.untrustedData.fid;

  return frameResponse({
    req,
    browserRedirectUrl: BEANS_WEBSITE_URL,
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/image/${fid}?t=${Date.now()}`,
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Feed", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/action/feed` },
      { label: "Water", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/action/water` },
      { label: "Train", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/action/train` },
      { label: "->", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/2` },
    ],
  });
}

export const POST = response;
