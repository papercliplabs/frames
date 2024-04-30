import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";

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
        title: "UH OH!",
        waterBoostActive: false,
        foodBoostActive: false,
      })),
      {
        type: "dynamic",
        size: { width: 735, height: 635 },
        position: { left: 240, top: 260 },
        src: (
          <div tw="flex flex-col w-full h-full text-content-primary justify-center p-[40px]" style={{ gap: "70px" }}>
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
