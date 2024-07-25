import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { NextRequest } from "next/server";

async function response(req: NextRequest, { params }: { params: { id: string } }): Promise<Response> {
  const alreadyVoted = req.nextUrl.searchParams.get("already-voted");
  const voteWeight = req.nextUrl.searchParams.get("vote-weight");
  return frameResponse({
    req,
    browserRedirectUrl: `${process.env.NEXT_PUBLIC_URL}/nounpoll/create`,
    ogTitle: "NounPoll",
    appName: "nounpoll",
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: relativeEndpointUrl(
        req,
        `/image?already-voted=${alreadyVoted ?? 0}&vote-weight=${voteWeight ?? 0}&t=${Date.now()}`
      ),
      aspectRatio: "1.91:1",
    },
    buttons: [
      { label: "Create your own NounPoll", action: "link", target: `${process.env.NEXT_PUBLIC_URL}/nounpoll/create` },
    ],
  });
}

export const GET = response;
export const POST = response;

export const revalidate = 0;
