import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { SCALER } from "../utils/constants";

interface NoBeanImageResponseParams {
  primaryColor: string;
  secondaryColor: string;
}

export async function noBeanImageResponse({
  primaryColor,
  secondaryColor,
}: NoBeanImageResponseParams): Promise<Response> {
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
            <div tw="flex text-[37px] tracking-[4.18px] font-bold w-full">YOU DON{"'"}T OWN A BEAN!</div>
            <div tw="flex text-[21.6px] tracking-[1.73px]">
              Don{"'"}t worry, you can still take care of the daily bean to level up your trainer level!
            </div>
            <div tw="flex text-[21.6px] tracking-[1.73px]">Make the bean your own by winning the auction!</div>
          </div>
        ),
      },
    ],
  });
}
