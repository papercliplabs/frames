import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { Action } from "../data/actions";
import { FEED_BOOST_TIME_S, SCALER, TRAIN_COOLDOWN_TIME_S, WATER_BOOST_TIME_S } from "../utils/constants";
import { ReactNode } from "react";
import { ImageLayer } from "@/utils/generateImage/types";

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
  const screenContent = getScreenContent(action, success, xpGained, primaryColor, secondaryColor);
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
      ...(action == "train" && success
        ? [
            {
              type: "static",
              src: "/images/beanigotchi/animated/trainSuccess.gif",
              size: { width: Math.floor(700 * SCALER), height: Math.floor(206 * SCALER) },
              position: { left: Math.floor(240 * SCALER), top: Math.floor(385 * SCALER) },
              animated: true,
            } as ImageLayer,
          ]
        : []),
      {
        type: "dynamic",
        size: { width: Math.floor(815 * SCALER), height: Math.floor(635 * SCALER) },
        position: { left: Math.floor(200 * SCALER), top: Math.floor(260 * SCALER) },
        src: (
          <div
            tw="flex flex-col w-full h-full text-[#FFFFFF] justify-center"
            style={{ gap: 70 * SCALER, padding: `${40 * SCALER}px ${80 * SCALER}px` }}
          >
            <div tw="text-[37px] tracking-[4.18px] font-bold">{screenContent.title}</div>
            <div tw="text-[21.6px] tracking-[1.73px]" style={{ whiteSpace: "pre-wrap" }}>
              {screenContent.body}
            </div>
            {screenContent.svg}
          </div>
        ),
      },
      ...(await beanedexFrameLayers({
        primaryColor,
        secondaryColor,
        title: success ? "CONGRATS!" : "WHOOPS!",
        waterBoostActive: false,
        foodBoostActive: false,
      })),
    ],
  });
}

function getScreenContent(
  action: Action,
  success: boolean,
  xpGained: number,
  primaryColor: string,
  secondaryColor: string
): { title: string; body: string; svg?: ReactNode } {
  let svg = undefined;

  switch (action) {
    case "train":
      return success
        ? {
            title: " ", // Shows gif instead
            body: `   Congratulations, you have gained +${xpGained} XP to your trainer level!`,
          }
        : {
            title: "YOU'RE TRAINING TOO FAST!",
            body: `You can only train once every ${Math.ceil(TRAIN_COOLDOWN_TIME_S / 60)} minutes!`,
          };

    case "feed":
      svg = (
        <svg
          width={230 * SCALER}
          height={268 * SCALER}
          viewBox={`0 0 54 63`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", left: 630 * SCALER, top: 40 * SCALER }}
        >
          <path
            d="M27.07 56.01C38.0052 56.01 46.87 47.1453 46.87 36.21C46.87 25.2748 38.0052 16.41 27.07 16.41C16.1348 16.41 7.27 25.2748 7.27 36.21C7.27 47.1453 16.1348 56.01 27.07 56.01Z"
            stroke={primaryColor}
            stroke-width="12.68"
            stroke-miterlimit="10"
          />
          <path
            d="M15.41 8.57001H38.72"
            stroke={primaryColor}
            stroke-width="15.85"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      );
      return success
        ? {
            title: `FOOD BOOST APPLIED!`,
            body: `Congratulations, this boost gives you +50% XP for the next ${FEED_BOOST_TIME_S / 60 / 60} hours!`,
            svg,
          }
        : {
            title: `FOOD BOOST ALREADY APPLIED!`,
            body: `It gives you +50% XP for ${FEED_BOOST_TIME_S / 60 / 60} hours, and can only be reapplied once it wears off!`,
            svg,
          };

    case "water":
      svg = (
        <svg
          width={225 * SCALER}
          height={327 * SCALER}
          viewBox={`0 0 48 70`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", left: 630 * SCALER, top: 40 * SCALER }}
        >
          <path
            d="M41.5 45.4C41.5 55.03 33.7 62.83 24.07 62.83C14.44 62.83 6.64 55.03 6.64 45.4C6.64 38.25 16.26 18.11 21.21 8.22995C22.39 5.85995 25.75 5.85995 26.94 8.22995C31.89 18.11 41.51 38.25 41.51 45.4H41.5Z"
            stroke={secondaryColor}
            stroke-width="12.68"
            stroke-miterlimit="10"
          />
        </svg>
      );
      return success
        ? {
            title: `WATER BOOST APPLIED!`,
            body: `Congratulations, this boost gives you +50% XP for the next ${WATER_BOOST_TIME_S / 60 / 60} hours!`,
            svg,
          }
        : {
            title: `WATER BOOST ALREADY APPLIED!`,
            body: `It gives you +50% XP for ${WATER_BOOST_TIME_S / 60 / 60} hours, and can only be reapplied once it wears off!`,
            svg,
          };
  }
}
