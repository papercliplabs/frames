import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { ENABLE_ANIMATIONS, SCALER } from "../utils/constants";

interface HomeImageResponseParams {
  primaryColor: string;
  secondaryColor: string;
}

export async function homeImageResponse({ primaryColor, secondaryColor }: HomeImageResponseParams): Promise<Response> {
  return generateImageResponse({
    imageCacheMaxAgeS: SECONDS_PER_DAY / 2,
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
        title: "WELCOME",
        waterBoostActive: false,
        foodBoostActive: false,
      })),
      {
        type: "static",
        src: "/images/beanigotchi/animated/title.gif",
        size: { width: Math.floor(700 * SCALER), height: Math.floor(400 * SCALER) },
        position: { left: Math.floor(255 * SCALER), top: Math.floor(380 * SCALER) },
        animated: ENABLE_ANIMATIONS,
      },
    ],
  });
}
