import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";

interface LeaderboardImageResponseParams {
  primaryColor: string;
  secondaryColor: string;

  userRank?: number;
  topTrainers: { username: string; level: number }[];
}

export async function leaderboardImageResponse({
  primaryColor,
  secondaryColor,
  userRank,
  topTrainers,
}: LeaderboardImageResponseParams): Promise<Response> {
  return generateImageResponse({
    imageCacheMaxAgeS: SECONDS_PER_DAY,
    frameSize: {
      width: 1200,
      height: 1200,
    },
    backgroundColor: primaryColor,
    fontTypes: ["graphik"],
    twConfig,
    layers: [
      {
        type: "dynamic",
        src: <div tw="w-full h-full bg-black" />,
        size: { width: 820, height: 740 },
        position: { left: 200, top: 188 },
      },
      ...(await beanedexFrameLayers({
        primaryColor,
        secondaryColor,
        title: userRank != undefined ? `RANK ${userRank == 1000 ? ">1000" : userRank}` : "", // Potential limit of 1k for db select for count
        waterBoostActive: false,
        foodBoostActive: false,
      })),
      {
        type: "dynamic",
        size: { width: 735, height: 635 },
        position: { left: 240, top: 260 },
        src: (
          <div
            tw="flex flex-col w-full h-full text-content-primary justify-top items-center p-[40px]"
            style={{ gap: "70px" }}
          >
            <div tw="text-title font-bold w-full justify-center">LEADERBOARD</div>
            <div tw="flex w-full justify-between text-body">
              <div tw="flex flex-col w-1/4 items-center" style={{ gap: "40px" }}>
                <span tw="font-bold">RANK</span>
                {topTrainers.map((entry, i) => (
                  <span key={i} tw="h-[36px] items-center">
                    {i + 1}
                  </span>
                ))}
              </div>
              <div tw="flex flex-col w-1/2 items-center" style={{ gap: "40px" }}>
                <span tw="font-bold">USER</span>
                {topTrainers.map((entry, i) => (
                  <span key={i} tw="text-caption items-center h-[36px]">
                    {entry.username}
                  </span>
                ))}
              </div>
              <div tw="flex flex-col w-1/4 items-center" style={{ gap: "40px" }}>
                <span tw="font-bold">LEVEL</span>
                {topTrainers.map((entry, i) => (
                  <span key={i} tw="h-[36px] items-center">
                    {entry.level}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ),
      },
    ],
  });
}
