import { getPoll } from "@/app/nounpoll/data/poll";
import { frameResponse } from "@/common/utils/frameResponse";
import { localImageUrl, relativeEndpointUrl } from "@/utils/urlHelpers";

async function response(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const poll = await getPoll(parseInt(params.id));

  if (!poll) {
    return frameResponse({
      req,
      ogTitle: "NounPoll",
      appName: "nounpoll",
      image: { src: localImageUrl("/nounpoll/no-poll.png"), aspectRatio: "1.91:1" },
      buttons: [
        { label: "Create your own NounPoll", action: "link", target: `${process.env.NEXT_PUBLIC_URL}/nounpoll/create` },
      ],
    });
  }

  return frameResponse({
    req,
    browserRedirectUrl: `${process.env.NEXT_PUBLIC_URL}/nounpoll/create`,
    ogTitle: "NounPoll",
    appName: "nounpoll",
    postUrl: relativeEndpointUrl(req, "/cast-vote"),
    image: { src: relativeEndpointUrl(req, `/image?t=${Date.now()}`), aspectRatio: "1.91:1" },
    buttons: [
      { label: poll.option1 },
      { label: poll.option2 },
      ...(poll.option3 ? [{ label: poll.option3 }] : []),
      ...(poll?.option4 ? [{ label: poll.option4 }] : []),
    ],
  });
}

export const GET = response;
export const POST = response;
