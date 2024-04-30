import { FrameRequest } from "@coinbase/onchainkit/frame";
import { BEANIGOTCHI_FRAME_BASE_URL } from "../../utils/constants";
import { getTrainer } from "../../data/trainer";
import { revalidateTag } from "next/cache";

async function response(req: Request): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const fid = frameRequest.untrustedData.fid;

  const trainer = await getTrainer({ fid });

  if (trainer.firstTime) {
    revalidateTag(`beanigotchi-get-persistent-data-${fid}`); // Force revalidation so won't show next time
    return Response.redirect(`${BEANIGOTCHI_FRAME_BASE_URL}/how-to`, 302);
  } else if (!trainer.ownsBean) {
    return Response.redirect(`${BEANIGOTCHI_FRAME_BASE_URL}/no-bean`, 302);
  } else {
    return Response.redirect(`${BEANIGOTCHI_FRAME_BASE_URL}/bean/1`, 302);
  }
}

export const POST = response;
