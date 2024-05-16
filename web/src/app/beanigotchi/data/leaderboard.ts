import { supabase } from "@/supabase/supabase";
import { Trainer, getTrainer } from "./trainer";
import { getPersistentData } from "./internal/persistentData";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

async function getLeaderboardFidsUncached(n: number): Promise<number[]> {
  const { data, error } = await supabase.from("beanigotchi").select("fid").order("xp", { ascending: false }).limit(n);

  if (error || data.length == 0) {
    throw Error(`beanigotchi getLeaderboardFids - error ${JSON.stringify(error)}`);
  }

  return data.map((entry) => entry.fid);
}

const getLeaderboardFids = customUnstableCache(getLeaderboardFidsUncached, ["beanigotchi-get-leaderboard-fids"], {
  revalidate: 30,
});

export async function getLeaderboard(): Promise<Trainer[]> {
  const leaderboardFids = await getLeaderboardFids(5);
  const trainers = await Promise.all(leaderboardFids.map((fid) => getTrainer({ fid })));

  return trainers;
}

async function getUserLeaderboardRankUncached({ fid }: { fid: number }): Promise<number> {
  const persistentData = await getPersistentData({ fid });
  const { count, error } = await supabase
    .from("beanigotchi")
    .select("*", { count: "exact", head: true })
    .gte("xp", persistentData.data.xp);

  if (error || !count) {
    throw Error(`beanigotchi getUserLeaderboardRank - ${count} - error ${JSON.stringify(error)}`);
  }

  return count;
}

export const getUserLeaderboardRank = customUnstableCache(
  getUserLeaderboardRankUncached,
  ["beanigotchi-get-user-leaderboard-rank"],
  {
    revalidate: 30,
  }
);
