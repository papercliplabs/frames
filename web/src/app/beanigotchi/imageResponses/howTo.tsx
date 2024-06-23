import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { SCALER } from "../utils/constants";

interface HowToImageResponseParams {
  primaryColor: string;
  secondaryColor: string;

  page: 1 | 2 | 3;
}

const pageContent: Record<1 | 2 | 3, { body1: string; body2: string }> = {
  1: {
    body1: "Feed and water your pet for daily XP boosts and train your pet to increase your trainer level!",
    body2: "The higher your trainer level, the higher you get on the Beanigotchi leaderboard!",
  },
  2: {
    body1: "If you own a Bean you get 100% XP boost to your training XP.",
    body2: "If you own multiple Beans, you can choose which Bean to train and take care of by inputting the Bean ID!",
  },
  3: {
    body1: "If you do not own a Bean, fear not! You can still train and take care of the Bean of the day.",
    body2: "If you'd like, you can make the Bean your own by placing a bid through the Beanidex!",
  },
};

export async function howToImageResponse({
  primaryColor,
  secondaryColor,

  page,
}: HowToImageResponseParams): Promise<Response> {
  const content = pageContent[page];
  return generateImageResponse({
    imageCacheMaxAgeS: SECONDS_PER_DAY,
    frameSize: {
      width: Math.floor(1200 * SCALER),
      height: Math.floor(1200 * SCALER),
    },
    backgroundColor: primaryColor,
    fontTypes: ["graphik"],
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
            tw="flex flex-col w-full h-full text-[#FFFFFF] justify-center"
            style={{ gap: 70 * SCALER, padding: 40 * SCALER }}
          >
            <div tw="text-[37px] tracking-[4.18px] font-bold w-full flex items-center justify-center text-center">
              HOW IT WORKS
            </div>
            <div tw="text-[21.6px] tracking-[1.73px]">{content.body1}</div>
            <div tw="text-[21.6px] tracking-[1.73px]">{content.body2}</div>
          </div>
        ),
      },
    ],
  });
}
