import { getQuestion } from "@/app/nounpoll/data/question";
import { castVote, didUserAlreadyVote } from "@/app/nounpoll/data/votes";
import { getVoteWeightForFid } from "@/app/nounpoll/data/voteWeightForFid";
import { frameErrorResponse, frameResponse } from "@/common/utils/frameResponse";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { localImageUrl } from "@/utils/urlHelpers";
import { FrameRequest } from "@coinbase/onchainkit/frame";

export async function POST(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const pollId = parseInt(params.id);

  const frameRequest: FrameRequest = await req.json();

  const [frameValidationResponse, question] = await Promise.all([
    getFrameMessageWithNeynarApiKey(frameRequest),
    getQuestion(pollId),
  ]);

  if (!frameValidationResponse || !frameValidationResponse.message || !question) {
    console.error("nounpoll validation: invalid frame request - ", frameRequest);
    return frameErrorResponse("Invalid frame request");
  }

  const userFid = frameValidationResponse.message.interactor.fid;

  const [alreadyVoted, voteWeight] = await Promise.all([
    didUserAlreadyVote(pollId, userFid),
    getVoteWeightForFid(userFid, BigInt(question.creationBlockNumber)),
  ]);

  if (alreadyVoted) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/nounpoll/${params.id}/results?already-voted=1`, 302);
  } else if (voteWeight == 0) {
    return frameResponse({
      req,
      ogTitle: "NounPoll",
      appName: "nounpoll",
      image: { src: localImageUrl("/nounpoll/no-votes.png"), aspectRatio: "1.91:1" },
      buttons: [{ label: "View Results", target: `${process.env.NEXT_PUBLIC_URL}/nounpoll/${params.id}/results` }],
    });
  } else {
    await castVote(pollId, userFid, frameValidationResponse.message.button, voteWeight);
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_URL}/nounpoll/${params.id}/results?vote-weight=${voteWeight}`,
      302
    );
  }
}
