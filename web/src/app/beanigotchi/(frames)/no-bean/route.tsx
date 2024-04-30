import { relativeEndpointUrl } from "@/utils/urlHelpers";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { BEANS_WEBSITE_URL } from "@/common/beans/config/constants";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { BEANIGOTCHI_FRAME_BASE_URL } from "@/app/beanigotchi/utils/constants";

async function response(req: Request): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const fid = frameRequest.untrustedData.fid;

  return frameResponseWrapper({
    req,
    browserRedirectUrl: BEANS_WEBSITE_URL,
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: relativeEndpointUrl(req, `/image/${fid}?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Bid on bean", action: "post", target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/beans` },
      { label: "Continue", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/1` },
    ],
  });
}

export const POST = response;
