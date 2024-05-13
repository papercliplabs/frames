import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";
import { Action } from "../data/actions";
import { FEED_BOOST_TIME_S, TRAIN_COOLDOWN_TIME_S } from "../utils/constants";

interface ActionImageResponseParams {
  primaryColor: string;
  secondaryColor: string;

  action: Action;
  success: boolean;
  xpGained: number;
}

export async function actionImageResponse({
  primaryColor,
  secondaryColor,

  action,
  success,
  xpGained,
}: ActionImageResponseParams): Promise<Response> {
  const screenContent = getScreenContent(action, success, xpGained);
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
        title: success ? "CONGRATS!" : "WHOOPS!",
        waterBoostActive: false,
        foodBoostActive: false,
      })),
      {
        type: "dynamic",
        size: { width: 735, height: 635 },
        position: { left: 240, top: 260 },
        src: (
          <div tw="flex flex-col w-full h-full text-content-primary justify-center p-[40px]" style={{ gap: "70px" }}>
            <div tw="text-title font-bold">{screenContent.title}</div>
            <div tw="text-body">{screenContent.body}</div>
          </div>
        ),
      },
    ],
  });
}

function getScreenContent(action: Action, success: boolean, xpGained: number): { title: string; body: string } {
  switch (action) {
    case "train":
      return success
        ? {
            title: "TRAIN SUCCESS!",
            body: `Congratulations, you have gained +${xpGained} XP to your trainer level!`,
          }
        : {
            title: "YOU'RE TRAINING TOO FAST!",
            body: `You can only train once every ${Math.ceil(TRAIN_COOLDOWN_TIME_S / 60)} minutes!`,
          };

    case "feed":
    case "water":
      const boostType = action == "feed" ? "FOOD" : "WATER";
      const boostTimeHours = FEED_BOOST_TIME_S / 60 / 60;
      return success
        ? {
            title: `${boostType} BOOST APPLIED!`,
            body: `Congratulations, this boost gives you +50% XP for the next ${boostTimeHours} hours!`,
          }
        : {
            title: `${boostType} BOOST ALREADY APPLIED!`,
            body: `It gives you +50% XP for ${boostTimeHours} hours, and can only be reapplied once it wears off!`,
          };
  }
}
