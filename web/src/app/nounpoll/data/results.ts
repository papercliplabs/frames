import { supabase } from "@/supabase/supabase";

interface Result {
  votes: number;
  percentage: number;
}

interface PollResults {
  option1: Result;
  option2: Result;
  option3: Result;
  option4: Result;
}

export async function getPollResults(pollId: number): Promise<PollResults> {
  const { error, data } = await supabase.from("nounpoll-votes").select("*").eq("pollId", pollId);

  if (error || !data) {
    throw Error(`nounpoll getPollResults - error ${JSON.stringify(error)}`);
  }

  const results: PollResults = {
    option1: { votes: 0, percentage: 0 },
    option2: { votes: 0, percentage: 0 },
    option3: { votes: 0, percentage: 0 },
    option4: { votes: 0, percentage: 0 },
  };

  let totalVotes = 0;
  for (let entry of data) {
    const weight = entry.voteWeight;
    totalVotes += weight;

    switch (entry.voteOption) {
      case 1:
        results.option1.votes += weight;
        break;
      case 2:
        results.option2.votes += weight;
        break;
      case 3:
        results.option3.votes += weight;
        break;
      case 4:
        results.option4.votes += weight;
        break;
    }
  }

  if (totalVotes > 0) {
    results.option1.percentage = results.option1.votes / totalVotes;
    results.option2.percentage = results.option2.votes / totalVotes;
    results.option3.percentage = results.option3.votes / totalVotes;
    results.option4.percentage = results.option4.votes / totalVotes;
  }

  return results;
}
