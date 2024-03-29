import { openai } from "@/utils/openai";
import { RiddleAndAnswer, RiddleConfig, RiddleContentProps } from "../configs";
import { supabase } from "@/supabase/supabase";

async function generateRiddle(): Promise<RiddleAndAnswer> {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    seed: Math.floor(Math.random() * 10000),
    messages: [
      {
        role: "system",
        content: `You are a riddler that grew up on an alien plant lush with jungle. Generates a 20 or less word riddle with a 1 word answer in JSON format with the keys "riddle" and "answer". Make the riddle hard, playful, and creative. Make certain the answer is ONLY 1 word.`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 1.2,
    max_tokens: 150,
    frequency_penalty: 1.5,
    presence_penalty: 2,
  });

  const data = JSON.parse(completion.choices[0].message.content ?? "") as RiddleAndAnswer;

  return data;
}

async function getRiddle(id?: number): Promise<(RiddleAndAnswer & { id: number }) | undefined> {
  if (id) {
    // Already generated riddle, get from database
    const { data } = await supabase.from("beans-riddles").select("*").eq("id", id);

    if (!data) {
      console.error(`No data for riddle id - id=${id}`);
      return undefined;
    }

    const riddleAndAnswer = data[0] as RiddleAndAnswer;
    return { ...riddleAndAnswer, id };
  } else {
    // Need to generate new riddle
    const riddleAndAnswer = await generateRiddle();

    // Store for next time
    const { data, error } = await supabase.from("beans-riddles").insert([riddleAndAnswer]).select();

    if (!data) {
      console.error(`Error adding riddle - data=${data}`);
      return undefined;
    }

    const riddleId = data[0].id;

    return { ...riddleAndAnswer, id: riddleId };
  }
}

function riddleContent({ riddle }: RiddleContentProps) {
  return (
    <div
      tw="absolute flex text-center justify-center text-[56px] text-black leading-[70px]"
      style={{
        top: "834px",
        left: "109px",
        width: "982px",
        height: "276px",
      }}
    >
      {riddle}
    </div>
  );
}

export const beansRiddleConfig: RiddleConfig = {
  images: {
    home: { src: `${process.env.NEXT_PUBLIC_URL}/images/riddle/beans/home.gif`, aspectRatio: "1:1" },
    riddle: { src: `${process.env.NEXT_PUBLIC_URL}/images/riddle/beans/riddle.png`, aspectRatio: "1:1" },
    correct: { src: `${process.env.NEXT_PUBLIC_URL}/images/riddle/beans/correct.gif`, aspectRatio: "1:1" },
  },
  riddleContent,
  getRiddle,
  redirectInfo: {
    label: "BEANSDAO",
    target: "https://beans.wtf",
  },
  fonts: ["graphik"],
  allowedCasterFids: [3362, 11555, 18655, 318911],
};
