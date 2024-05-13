import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";

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
        title: "HOW TO",
        waterBoostActive: false,
        foodBoostActive: false,
      })),
      {
        type: "dynamic",
        size: { width: 735, height: 635 },
        position: { left: 240, top: 260 },
        src: (
          <div tw="flex flex-col w-full h-full text-content-primary justify-center p-[40px]" style={{ gap: "70px" }}>
            <div tw="flex text-title font-bold w-full">YOU DON{"'"}T OWN A BEAN!</div>
            <div tw="flex text-body">
              Don{"'"}t worry, you can still take care of the daily bean to level up your trainer level!
            </div>
            <div tw="flex text-body">Make the bean your own by winning the auction!</div>
          </div>
        ),
      },
    ],
  });
}
