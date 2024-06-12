import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { frameResponse } from "@/common/utils/frameResponse";
import { BEANS_WEBSITE_URL } from "@/common/beans/config/constants";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { Action, takeAction } from "@/app/beanigotchi/data/actions";
import { BEANIGOTCHI_FRAME_BASE_URL } from "@/app/beanigotchi/utils/constants";

async function response(req: Request, { params }: { params: { action: string } }): Promise<Response> {
  const action = params.action as Action;
  if (action != "feed" && action != "water" && action != "train") {
    console.error("Beanigotchi - invalid action", action);
    return Response.error();
  }

  const frameRequest: FrameRequest = await req.json();
  const fid = frameRequest.untrustedData.fid;
  const actionResult = await takeAction({ fid, action });

  return frameResponse({
    req,
    browserRedirectUrl: BEANS_WEBSITE_URL,
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: relativeEndpointUrl(
        req,
        `/image/${fid}?success=${actionResult.success}&xpGained=${actionResult.xpGained ?? 0}&t=${Date.now()}`
      ),
      aspectRatio: "1:1",
    },
    buttons: [{ label: "Continue", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/1` }],
  });
}

export const POST = response;
