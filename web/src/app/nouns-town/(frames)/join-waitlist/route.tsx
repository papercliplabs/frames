import { frameErrorResponse, frameResponse } from "@/common/utils/frameResponse";
import { getUserInfo } from "@/utils/farcaster";
import { localImageUrl, relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { addUserToWaitlist, isUserOnWaitlist } from "../../data/waitlist";

const NOUN_TOWN_USER_ID = 533619;
const SHARE_LINK_PARAMS: string = new URLSearchParams([
  ["text", "I joined the Nouns Town waitlist, don't miss out!"],
  ["embeds[]", `${process.env.NEXT_PUBLIC_URL}/nouns-town`],
]).toString();

export async function POST(req: Request): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const userFid = frameRequest.untrustedData.fid;

  const alreadyOnWaitlist = await isUserOnWaitlist(userFid);
  console.log("ON WAITLIST", alreadyOnWaitlist);
  if (!alreadyOnWaitlist) {
    const userWithViewerContext = await getUserInfo(userFid, NOUN_TOWN_USER_ID);
    const isFollowing = userWithViewerContext.viewer_context?.followed_by; // If the viewer (nouns town) is followed by the user
    console.log("FOLLOWING", isFollowing);
    if (!isFollowing) {
      return frameErrorResponse("Must following @nounstown to join the waitlist.");
    }

    await addUserToWaitlist(userFid);
  }

  return frameResponse({
    req,
    browserRedirectUrl: "https://nounswap.xyz", // TODO: replace with actual
    ogTitle: "Nouns Town",
    appName: "nouns-town",
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: localImageUrl("/nouns-town/home.png"), // TODO: actual image
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Back to schedule", target: `${process.env.NEXT_PUBLIC_URL}/nouns-town/1` },
      {
        label: "Share",
        action: "link",
        target: `https://warpcast.com/~/compose?${SHARE_LINK_PARAMS}`,
      },
    ],
  });
}

export const dynamic = "force-dynamic";
