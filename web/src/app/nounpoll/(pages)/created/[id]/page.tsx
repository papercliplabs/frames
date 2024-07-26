import { getPoll } from "@/app/nounpoll/data/poll";
import { PreviewFrame } from "../../../components/PreviewFrame";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CopyToClipboardButton from "@/app/nounpoll/components/CopyToClipboardButton";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreatedPage({ params }: { params: { id: string } }) {
  const frameLink = `${process.env.NEXT_PUBLIC_URL}/nounpoll/${params.id}?t=${Date.now()}`;

  const shareLinkParams = new URLSearchParams([
    ["text", "I created a NounPoll to poll the Nouns community based on Noun voting weight!"],
    ["embeds[]", frameLink],
  ]);

  return (
    <div className="flex h-screen w-screen flex-col items-center gap-9 bg-[#120D17] p-4 pt-[10vh] text-white md:pt-[15vh]">
      <Suspense fallback={<Skeleton className="w-full max-w-[600px] rounded-xl" style={{ aspectRatio: 1.56 }} />}>
        <PreviewWrapper pollId={parseInt(params.id)} />
      </Suspense>
      <div className="justify-centers flex flex-col items-center text-center">
        <h1 className="text-[24px] font-semibold">Your poll has been created!</h1>
        <div className="text-[#898989]">
          You can share directly to warpcast, or copy the frame link can and cast it manually.
        </div>
      </div>
      <div className="flex w-full flex-col justify-center gap-3 md:flex-row">
        <Button className="rounded-xl bg-white px-4 py-3 text-[16px] font-medium text-black hover:bg-white/80" asChild>
          <Link href={`https://warpcast.com/~/compose?${shareLinkParams.toString()}`} target="_blank">
            Share on Warpcast
          </Link>
        </Button>
        <CopyToClipboardButton
          className="rounded-xl bg-white px-4 py-3 text-[16px] font-medium text-black hover:bg-white/80"
          copyText={frameLink}
        >
          Copy to clipboard
        </CopyToClipboardButton>
      </div>
    </div>
  );
}

async function PreviewWrapper({ pollId }: { pollId: number }) {
  const poll = await getPoll(pollId);

  if (!poll) {
    throw Error(`No poll was found for this ID ${pollId}`);
  }

  return (
    <PreviewFrame
      question={poll.question}
      option1={poll.option1}
      option2={poll.option2}
      option3={poll.option3 ?? undefined}
      option4={poll.option4 ?? undefined}
    />
  );
}
