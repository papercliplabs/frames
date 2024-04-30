import { BeansAuctionStatus } from "@/app/nounish-auction/(v1)/slugConfigs/beans";
import { truncateString } from "@/utils/format";
import { generateImage } from "@/utils/generateImage/generateImage";
import { ImageLayer } from "@/utils/generateImage/types";
import sharp, { Sharp } from "sharp";
import { ENABLE_ANIMATIONS } from "../../utils/constants";

interface BeanedexFrameLayersProps {
  primaryColor: string;
  secondaryColor: string;

  title: string;

  waterBoostActive: boolean;
  foodBoostActive: boolean;

  level?: number;
  xpPct?: number; // in [0, 1)
}

export async function beanedexFrameLayers({
  primaryColor,
  secondaryColor,
  title,
  waterBoostActive,
  foodBoostActive,
  level,
  xpPct,
}: BeanedexFrameLayersProps): Promise<ImageLayer[]> {
  const numBoosts = (waterBoostActive ? 1 : 0) + (foodBoostActive ? 1 : 0);
  return [
    {
      type: "static",
      src: "/images/beanigotchi/static-overlay.png",
      size: { width: 1200, height: 1200 },
      animated: false,
    },
    {
      type: "dynamic",
      src: (
        <div tw="flex w-full h-full relative">
          <div
            tw="rounded-full w-[45px] h-[45px] absolute left-[286.25px] top-[112.63px]"
            style={{ backgroundColor: primaryColor }}
          />
          <div
            tw="rounded-full w-[45px] h-[45px] absolute left-[365.51px] top-[112.63px]"
            style={{ backgroundColor: secondaryColor }}
          />
          <div tw="w-[355px] h-[75px] left-[429px] top-[968px] text-content-primary justify-center items-center text-body font-bold px-5 text-center absolute">
            {truncateString(title, 15)}
          </div>
          {waterBoostActive && (
            <svg
              width="48"
              height="70"
              viewBox="0 0 48 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", left: 97, top: 563 }}
            >
              <path
                d="M41.5 45.4C41.5 55.03 33.7 62.83 24.07 62.83C14.44 62.83 6.64 55.03 6.64 45.4C6.64 38.25 16.26 18.11 21.21 8.22995C22.39 5.85995 25.75 5.85995 26.94 8.22995C31.89 18.11 41.51 38.25 41.51 45.4H41.5Z"
                stroke={secondaryColor}
                stroke-width="12.68"
                stroke-miterlimit="10"
              />
            </svg>
          )}
          {foodBoostActive && (
            <svg
              width="54"
              height="63"
              viewBox="0 0 54 63"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", left: 95, top: 671 }}
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
          )}
          {xpPct != undefined && (
            <div
              tw="flex absolute left-[545px] top-[130px] rounded-[8px] min-w-[16px] bg-black h-[18px]"
              style={{ width: 305 * xpPct }}
            />
          )}
          {level != undefined && (
            <div tw="flex absolute left-[260px] top-[284px] h-[122px] w-[122px] text-center items-center justify-center text-body font-bold text-content-primary ">
              {level}
            </div>
          )}
        </div>
      ),
      size: { width: 1200, height: 1200 },
    },
    {
      type: "static",
      src: "/images/beanigotchi/animated/site.gif",
      size: { width: 1200, height: 1200 },
      animated: ENABLE_ANIMATIONS,
    },
    ...(level != undefined
      ? [
          {
            type: "static",
            src: "/images/beanigotchi/animated/spinny.gif",
            size: { width: 1200, height: 1200 },
            animated: ENABLE_ANIMATIONS,
          } as ImageLayer,
        ]
      : []),
    ...(numBoosts > 0
      ? [
          {
            type: "static",
            src: "/images/beanigotchi/animated/boost.gif",
            size: { width: 1200, height: 1200 },
            animated: ENABLE_ANIMATIONS,
          } as ImageLayer,
        ]
      : []),
    ...(numBoosts > 1
      ? [
          {
            type: "static",
            src: "/images/beanigotchi/animated/particles.gif",
            size: { width: 1200, height: 1200 },
            animated: ENABLE_ANIMATIONS,
          } as ImageLayer,
        ]
      : []),
  ];
}
