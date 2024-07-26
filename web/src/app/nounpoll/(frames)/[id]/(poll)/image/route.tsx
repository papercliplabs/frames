import { getPoll } from "@/app/nounpoll/data/poll";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";

export async function GET(req: Request, { params }: { params: { id: string } }): Promise<Response> {
  const poll = await getPoll(parseInt(params.id));

  return generateImageResponse({
    imageCacheMaxAgeS: SECONDS_PER_DAY,
    frameSize: { width: 1200, height: 630 },
    backgroundColor: "white",
    fontTypes: ["inter"],
    layers: [
      {
        type: "static",
        src: "/images/nounpoll/question.png",
        size: { width: 1200, height: 630 },
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full p-[64px] pr-[280px] flex flex-col justify-between">
            <div />
            <div tw="text-[62px] font-semibold flex text-[#222222]">{poll?.question}</div>
            <div tw="text-[28px] font-normal text-[#898989]">
              Votes in this anonymous poll are weighted by delegated Nouns to voters Farcaster account verified
              addresses.
            </div>
          </div>
        ),
        size: { width: 1200, height: 630 },
      },
      {
        type: "static",
        src: "/images/paperclip-icon.png",
        size: { width: 60, height: 60 },
        position: { left: 1100, top: 530 },
      },
    ],
  });
}
