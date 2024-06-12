import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { frameResponse } from "@/common/utils/frameResponse";
import { BEANS_WEBSITE_URL } from "@/common/beans/config/constants";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { BEANIGOTCHI_FRAME_BASE_URL } from "../../../utils/constants";
import { frameErrorResponse } from "@/common/utils/frameResponse";
import { setPreferredBeanId } from "@/app/beanigotchi/data/trainer";

async function response(req: Request): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const fid = frameRequest.untrustedData.fid;

  if (frameRequest.untrustedData.buttonIndex == 2) {
    // Trigger change - error if invalid, redirect if success
    const input = frameRequest.untrustedData.inputText.trim();
    const inputNum = input == "" ? -1 : Number(input);

    if (isNaN(inputNum)) {
      // Error
      return frameErrorResponse("Error: Not a number");
    } else {
      const success = await setPreferredBeanId({ fid, preferredBeanId: BigInt(inputNum) });
      if (!success) {
        return frameErrorResponse(`Error: You don't own bean ${inputNum}`);
      } else {
        return Response.redirect(`${BEANIGOTCHI_FRAME_BASE_URL}/bean/1`, 302);
      }
    }
  }

  return frameResponse({
    req,
    browserRedirectUrl: BEANS_WEBSITE_URL,
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/image/${fid}?t=${Date.now()}`,
      aspectRatio: "1:1",
    },
    input: { text: "BeanId (or blank for daily bean)" },
    buttons: [
      { label: "Back", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/3` },
      { label: "Change", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/change` },
    ],
  });
}

export const POST = response;
