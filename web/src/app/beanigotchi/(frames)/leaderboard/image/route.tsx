import { getLeaderboard, getUserLeaderboardRank } from "@/app/beanigotchi/data/leaderboard";
import { leaderboardImageResponse } from "@/app/beanigotchi/imageResponses/leaderboard";
import { getBean } from "@/common/beans/data/getBean";
import { getCurrentAuction } from "@/common/beans/data/getCurrentAuction";
import { NextRequest } from "next/server";

// Used for sharing of leaderboard (don't have fid)
export async function GET(req: NextRequest): Promise<Response> {
  const [currentAuction, leaderboard] = await Promise.all([getCurrentAuction(), getLeaderboard()]);
  const auctionBean = await getBean({ beanId: currentAuction.beanId });

  const topTrainers = leaderboard.map((trainer) => ({
    username: trainer.username,
    level: trainer.levelStatus.level,
  }));

  return leaderboardImageResponse({
    primaryColor: auctionBean.colors.classOne,
    secondaryColor: auctionBean.colors.classTwo,
    topTrainers,
  });
}

export const dynamic = "force-dynamic";
