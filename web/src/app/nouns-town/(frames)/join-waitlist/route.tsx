import { frameResponse } from "@/common/utils/frameResponse";
import { localImageUrl, relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { addUserToWaitlist } from "../../data/waitlist";

const NOUNS_TOWN_USER_ID = 749097;
const NOUNS_TOWN_CHANNEL_ID = "nounstown";

const SHARE_LINK_PARAMS: string = new URLSearchParams([
  ["text", "I joined the Nouns Town waitlist, don't miss out!"],
  ["embeds[]", `${process.env.NEXT_PUBLIC_URL}/nouns-town`],
]).toString();

export async function POST(req: Request): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const userFid = frameRequest.untrustedData.fid;

  // Don't do the follow checks, tradeoff for better UX
  // const alreadyOnWaitlist = await isUserOnWaitlist(userFid);
  // if (!alreadyOnWaitlist) {
  //   // const isFollowingUser = await isUserFollowingUser(userFid, NOUNS_TOWN_USER_ID);
  //   // const isFollowingChannel = isFollowingUser && (await isUserFollowingChannel(userFid, NOUNS_TOWN_CHANNEL_ID));
  //   // if (!isFollowingUser || !isFollowingChannel) {
  //   //   return frameErrorResponse("Must follow @nounstown.eth + /nounstown to RSVP. Retry 2min after following.");
  //   // }

  //   await addUserToWaitlist(userFid);
  // }
  addUserToWaitlist(userFid);

  return frameResponse({
    req,
    browserRedirectUrl: "https://warpcast.com/~/channel/nounstown", // TODO: replace with actual once launched
    ogTitle: "Nouns Town",
    appName: "nouns-town",
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: localImageUrl("/nouns-town/on-waitlist.png"),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Back to schedule", target: `${process.env.NEXT_PUBLIC_URL}/nouns-town/1` },
      {
        label: "Share",
        action: "link",
        target: `https://warpcast.com/~/compose?${SHARE_LINK_PARAMS}`,
      },
      { label: "Follow @nounstown", action: "link", target: "https://warpcast.com/nounstown.eth" },
      { label: "Follow /nounstown", action: "link", target: "https://warpcast.com/~/channel/nounstown" },
    ],
  });
}

export const dynamic = "force-dynamic";
