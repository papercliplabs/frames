import { relativeEndpointUrl } from "@/utils/urlHelpers";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { BEANS_WEBSITE_URL } from "@/common/beans/config/constants";
import { FrameButtonMetadata, FrameRequest } from "@coinbase/onchainkit/frame";
import { BEANIGOTCHI_FRAME_BASE_URL } from "@/app/beanigotchi/utils/constants";

async function response(req: Request, { params }: { params: { page: string } }): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const fid = frameRequest.untrustedData.fid;
  const page = Number(params.page) as 1 | 2 | 3;

  let buttons: FrameButtonMetadata[] = [];
  switch (page) {
    case 1:
      buttons = [
        {
          label: "->",
          action: "post",
          target: `${BEANIGOTCHI_FRAME_BASE_URL}/how-to/2`,
        },
      ];
      break;
    case 2:
      buttons = [
        {
          label: "<-",
          action: "post",
          target: `${BEANIGOTCHI_FRAME_BASE_URL}/how-to/1`,
        },
        {
          label: "->",
          action: "post",
          target: `${BEANIGOTCHI_FRAME_BASE_URL}/how-to/3`,
        },
      ];
      break;
    case 3:
      buttons = [
        {
          label: "<-",
          action: "post",
          target: `${BEANIGOTCHI_FRAME_BASE_URL}/how-to/2`,
        },
        { label: "Bid", action: "post", target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/beans` },
        { label: "Let's do this!", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/router` },
      ];
      break;
  }

  return frameResponseWrapper({
    req,
    browserRedirectUrl: BEANS_WEBSITE_URL,
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: relativeEndpointUrl(req, `/image/${fid}?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: buttons as [FrameButtonMetadata, ...FrameButtonMetadata[]],
  });
}

export const POST = response;
