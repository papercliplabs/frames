import { getQuestion } from "@/app/nounpoll/data/question";
import { getPollResults } from "@/app/nounpoll/data/results";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { formatNumber } from "@/utils/format";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<Response> {
  const pollId = parseInt(params.id);
  const alreadyVoted = req.nextUrl.searchParams.get("already-voted");
  const voteWeight = req.nextUrl.searchParams.get("vote-weight");

  const [question, results] = await Promise.all([getQuestion(pollId), getPollResults(pollId)]);

  const labelAndResults = [
    { label: question?.option1, result: results.option1 },
    { label: question?.option2, result: results.option2 },
    ...(question?.option3 ? [{ label: question.option3, result: results.option3 }] : []),
    ...(question?.option4 ? [{ label: question.option4, result: results.option4 }] : []),
  ];

  return generateImageResponse({
    imageCacheMaxAgeS: SECONDS_PER_DAY,
    frameSize: { width: 1200, height: 630 },
    backgroundColor: "white",
    fontTypes: ["inter"],
    layers: [
      {
        type: "static",
        src: "/images/nounpoll/results.png",
        size: { width: 1200, height: 630 },
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full p-[64px] flex flex-col justify-between">
            <div tw="text-[40px] font-semibold flex text-[#222222]">{question?.question}</div>
            <div tw="flex flex-col w-full" style={{ gap: 12 }}>
              {labelAndResults.map((entry, i) => (
                <div key={i} tw="flex w-full h-[68px] justify-between items-center ">
                  <div tw="flex relative items-center pl-5 grow">
                    <div
                      tw="flex h-full absolute bg-white rounded-xl"
                      style={{ width: `${Math.max(entry.result.percentage * 100, 1)}%` }}
                    />
                    <span tw="text-[30px] font-semibold">{entry.label}</span>
                  </div>
                  <div tw="flex pr-5 w-[230px] justify-end" style={{ gap: 4 }}>
                    <span tw="flex items-center text-[24px]">
                      {entry.result.votes} vote{entry.result.votes == 1 ? "" : "s"}
                    </span>
                    <span tw="text-[30px] w-[90px] font-semibold flex justify-end ">
                      {formatNumber(entry.result.percentage * 100, 0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div tw="flex text-[28px] font-normal text-[#898989]">
              {alreadyVoted == "1" ? "Already voted!" : ""}
              {voteWeight && voteWeight != "0" ? `Voted with ${voteWeight} votes!` : ""}
            </div>
          </div>
        ),
        size: { width: 1200, height: 630 },
      },
    ],
  });
}
