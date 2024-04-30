import { SECONDS_PER_DAY } from "@/utils/constants";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";
import { ENABLE_ANIMATIONS } from "../utils/constants";

interface HomeImageResponseParams {
  primaryColor: string;
  secondaryColor: string;
}

export async function homeImageResponse({ primaryColor, secondaryColor }: HomeImageResponseParams): Promise<Response> {
  return generateImageResponse({
    imageCacheMaxAgeS: SECONDS_PER_DAY / 2,
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
        title: "WELCOME",
        waterBoostActive: false,
        foodBoostActive: false,
      })),
      {
        type: "static",
        src: "/images/beanigotchi/animated/title.gif",
        size: { width: 700, height: 400 },
        position: { left: 255, top: 380 },
        animated: ENABLE_ANIMATIONS,
      },
    ],
  });
}
