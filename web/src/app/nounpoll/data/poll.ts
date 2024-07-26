"use server";
import { supabase } from "@/supabase/supabase";
import { getBlock } from "viem/actions";
import { mainnetPublicClient } from "@/common/utils/walletClients";

export async function getPoll(id: number) {
  const { error, data } = await supabase.from("nounpoll-questions").select("*").eq("id", id);

  if (error) {
    console.error(`getQuestion: question does not exist : ${id} - ${error}`);
  }

  return data ? data[0] : undefined;
}

export async function createPoll({
  question,
  option1,
  option2,
  option3,
  option4,
}: {
  question: string;
  option1: string;
  option2: string;
  option3?: string;
  option4?: string;
}): Promise<number> {
  const block = await getBlock(mainnetPublicClient);
  const { error, data } = await supabase
    .from("nounpoll-questions")
    .insert({
      question,
      option1,
      option2,
      option3,
      option4,
      creationBlockNumber: Number(block.number),
    })
    .select();

  if (error || data == null || data.length == 0) {
    throw Error(`createPoll: error ${error}`);
  }

  return data[0].id;
}
