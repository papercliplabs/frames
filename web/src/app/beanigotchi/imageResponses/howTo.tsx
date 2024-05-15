import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";
import { SCALER } from "../utils/constants";

interface HowToImageResponseParams {
  primaryColor: string;
  secondaryColor: string;
}

export async function howToImageResponse({
  primaryColor,
  secondaryColor,
}: HowToImageResponseParams): Promise<Response> {
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
        title: "HOW TO",
        waterBoostActive: false,
        foodBoostActive: false,
      })),
      {
        type: "dynamic",
        size: { width: Math.floor(735 * SCALER), height: Math.floor(635 * SCALER) },
        position: { left: Math.floor(240 * SCALER), top: Math.floor(260 * SCALER) },
        src: (
          <div
            tw="flex flex-col w-full h-full text-content-primary justify-center"
            style={{ gap: 70 * SCALER, padding: 40 * SCALER }}
          >
            <div tw="text-title font-bold w-full flex items-center justify-center text-center">HOW IT WORKS</div>
            <div tw="text-body">
              Feed and water your pet for daily XP boosts and train your pet to increase your trainer level!
            </div>
            <div tw="text-body">The higher your trainer level, the higher you get on the Beanigotchi leaderboard!</div>
          </div>
        ),
      },
    ],
  });
}
