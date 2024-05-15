import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";
import { SCALER } from "../utils/constants";

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
      width: Math.floor(1200 * SCALER),
      height: Math.floor(1200 * SCALER),
    },
    backgroundColor: primaryColor,
    fontTypes: ["graphik"],
    twConfig,
    layers: [
      {
        type: "dynamic",
        src: <div tw="w-full h-full bg-black" />,
        size: { width: Math.floor(820 * SCALER), height: Math.floor(740 * SCALER) },
        position: { left: Math.floor(200 * SCALER), top: Math.floor(188 * SCALER) },
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
        size: { width: Math.floor(735 * SCALER), height: Math.floor(635 * SCALER) },
        position: { left: Math.floor(240 * SCALER), top: Math.floor(260 * SCALER) },
        src: (
          <div
            tw="flex flex-col w-full h-full text-content-primary justify-top items-center "
            style={{ gap: 70 * SCALER, padding: 40 * SCALER }}
          >
            <div tw="text-title font-bold w-full justify-center">LEADERBOARD</div>
            <div tw="flex w-full justify-between text-body">
              <div tw="flex flex-col w-1/4 items-center" style={{ gap: 40 * SCALER }}>
                <span tw="font-bold">RANK</span>
                {topTrainers.map((entry, i) => (
                  <span key={i} tw="items-center" style={{ height: 36 * SCALER }}>
                    {i + 1}
                  </span>
                ))}
              </div>
              <div tw="flex flex-col w-1/2 items-center" style={{ gap: 40 * SCALER }}>
                <span tw="font-bold">USER</span>
                {topTrainers.map((entry, i) => (
                  <span key={i} tw="text-caption items-center" style={{ height: 36 * SCALER }}>
                    {entry.username}
                  </span>
                ))}
              </div>
              <div tw="flex flex-col w-1/4 items-center" style={{ gap: 40 * SCALER }}>
                <span tw="font-bold">LEVEL</span>
                {topTrainers.map((entry, i) => (
                  <span key={i} tw="items-center" style={{ height: 36 * SCALER }}>
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
