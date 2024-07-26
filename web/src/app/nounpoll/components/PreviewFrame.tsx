import { truncateString } from "@/utils/format";
import Image from "next/image";

export const MAX_QUESTION_CHAR_LEN = 90;
export const MAX_OPTION_CHAR_LEN = 15;

interface PreviewFrameProps {
  question: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
}

export function PreviewFrame({ question, option1, option2, option3, option4 }: PreviewFrameProps) {
  const options = [
    option1,
    option2,
    ...(option3 != undefined ? [option3] : []),
    ...(option4 != undefined ? [option4] : []),
  ];

  return (
    <div className="max-w-[600px]">
      <div className="relative flex w-full flex-col overflow-hidden rounded-t-xl" style={{ aspectRatio: 1.91 }}>
        <Image src="/images/nounpoll/question.png" fill alt="" className="-z-1" />
        <div className="z-10 flex h-full w-full flex-col justify-between p-4 pr-[15%] md:p-6 md:pr-[15%]">
          <div />
          <div className="flex text-[18px] font-semibold text-[#222222] md:text-[24px] ">
            {truncateString(question, MAX_QUESTION_CHAR_LEN)}
          </div>
          <div className="text-[10px] font-normal text-[#898989] md:text-[12px]">
            Votes in this anonymous poll are weighted by the number of delegated Nouns to the verified addresses on your
            Farcaster account.
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 overflow-hidden rounded-b-xl bg-[#292532] p-3">
        {options.map((option, i) => (
          <div
            key={i}
            className="flex h-[36px] grow basis-1/3 items-center justify-center overflow-hidden text-ellipsis text-nowrap rounded-[6px] bg-[#3F3B47] text-white md:h-[46px] md:basis-1/5 md:rounded-[10px]"
          >
            {truncateString(option, MAX_OPTION_CHAR_LEN)}
          </div>
        ))}
      </div>
    </div>
  );
}
