import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";
import { Action } from "../data/actions";
import { FEED_BOOST_TIME_S, SCALER, TRAIN_COOLDOWN_TIME_S } from "../utils/constants";

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
        title: success ? "CONGRATS!" : "WHOOPS!",
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
