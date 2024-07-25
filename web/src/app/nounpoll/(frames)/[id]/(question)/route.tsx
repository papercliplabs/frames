import { getQuestion } from "@/app/nounpoll/data/question";
import { frameResponse } from "@/common/utils/frameResponse";
import { localImageUrl, relativeEndpointUrl } from "@/utils/urlHelpers";

async function response(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const question = await getQuestion(parseInt(params.id));

  if (!question) {
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
      { label: question.option1 },
      { label: question.option2 },
      ...(question.option3 ? [{ label: question.option3 }] : []),
      ...(question?.option4 ? [{ label: question.option4 }] : []),
    ],
  });
}

export const GET = response;
export const POST = response;
