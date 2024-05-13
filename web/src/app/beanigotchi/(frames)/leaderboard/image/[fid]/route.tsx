import { getLeaderboard, getUserLeaderboardRank } from "@/app/beanigotchi/data/leaderboard";
import { getTrainer } from "@/app/beanigotchi/data/trainer";
import { leaderboardImageResponse } from "@/app/beanigotchi/imageResponses/leaderboard";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { fid: string } }): Promise<Response> {
  const fid = Number(params.fid);
  const [trainer, leaderboard, userRank] = await Promise.all([
    getTrainer({ fid }),
    getLeaderboard(),
    getUserLeaderboardRank({ fid }),
  ]);

  const topTrainers = leaderboard.map((trainer) => ({
    username: trainer.username,
    level: trainer.levelStatus.level,
  }));

  return leaderboardImageResponse({
    primaryColor: trainer.bean.colors.classOne,
    secondaryColor: trainer.bean.colors.classTwo,

    userRank,
    topTrainers,
  });
}

export const maxDuration = 150; // Allow up to 2.5 min for first fetch
