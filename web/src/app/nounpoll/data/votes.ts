import { supabase } from "@/supabase/supabase";

export async function didUserAlreadyVote(pollId: number, userFid: number): Promise<boolean> {
  const { count, error } = await supabase
    .from("nounpoll-votes")
    .select("*", { count: "exact", head: true })
    .eq("pollId", pollId)
    .eq("userFid", userFid);

  if (error || count == null) {
    throw Error(`nounpoll didUserAlreadyVote - ${count} - error ${JSON.stringify(error)}`);
  }

  return count > 0;
}

export async function castVote(pollId: number, userFid: number, voteOption: number, voteWeight: number): Promise<void> {
  const { error } = await supabase.from("nounpoll-votes").insert([{ pollId, userFid, voteOption, voteWeight }]);

  if (error) {
    throw Error(`nounpoll createVote - error ${JSON.stringify(error)}`);
  }
}
