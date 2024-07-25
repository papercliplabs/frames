import { supabase } from "@/supabase/supabase";

export async function getQuestion(id: number) {
  const { error, data } = await supabase.from("nounpoll-questions").select("*").eq("id", id);

  if (error) {
    console.error(`getQuestion: question does not exist : ${id} - ${error}`);
  }

  return data ? data[0] : undefined;
}
