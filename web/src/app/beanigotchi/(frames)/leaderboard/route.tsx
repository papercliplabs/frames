import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { frameResponse } from "@/common/utils/frameResponse";
import { BEANS_WEBSITE_URL } from "@/common/beans/config/constants";
import { FrameButtonMetadata, FrameRequest } from "@coinbase/onchainkit/frame";
import { BEANIGOTCHI_FRAME_BASE_URL } from "@/app/beanigotchi/utils/constants";
import { getUserLeaderboardRank } from "../../data/leaderboard";
import { getTrainer } from "../../data/trainer";

async function response(req: Request): Promise<Response> {
  // Support a GET request here for sharing leaderboard, where we won't show any user rank
  let fid: number | undefined = undefined;
  let shareLinkParams: URLSearchParams = new URLSearchParams();
  if (req.method == "POST") {
    const frameRequest: FrameRequest = await req.json();
    fid = frameRequest.untrustedData.fid;
    const [userRank, trainer] = await Promise.all([getUserLeaderboardRank({ fid }), getTrainer({ fid })]);
    shareLinkParams.append(
      "text",
      `I made it to trainer level ${trainer.levelStatus.level} and rank ${userRank} on the Beanigotchi leaderboard!`
    );
    shareLinkParams.append("embeds[]", `${BEANIGOTCHI_FRAME_BASE_URL}/leaderboard?t=${Date.now()}`);
  }

  return frameResponse({
    req,
    browserRedirectUrl: BEANS_WEBSITE_URL,
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: relativeEndpointUrl(req, fid != undefined ? `/image/${fid}?t=${Date.now()}` : `/image/?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "My Bean", action: "post", target: `${BEANIGOTCHI_FRAME_BASE_URL}/bean/1` },
      // Only show share if hit from a post
      ...(fid != undefined
        ? [
            {
              label: "Share",
              action: "link",
              target: `https://warpcast.com/~/compose?${shareLinkParams.toString()}`,
            } as FrameButtonMetadata,
          ]
        : []),
    ],
  });
}

export const GET = response;
export const POST = response;
