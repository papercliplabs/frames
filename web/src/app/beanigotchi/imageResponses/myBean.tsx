import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { twConfig } from "./partial/twConfig";

interface MyBeanImageResponseParams {
  primaryColor: string;
  secondaryColor: string;

  level: number;
  xpPct: number;

  waterBoostActive: boolean;
  foodBoostActive: boolean;

  beanId: string;
  beanImgSrc: string;
}

export async function myBeanImageResponse({
  primaryColor,
  secondaryColor,
  level,
  xpPct,
  waterBoostActive,
  foodBoostActive,
  beanId,
  beanImgSrc,
}: MyBeanImageResponseParams): Promise<Response> {
  console.log(secondaryColor.toUpperCase());

  return generateImageResponse({
    frameSize: {
      width: 1200,
      height: 1200,
    },
    backgroundColor: primaryColor,
    fontTypes: ["graphik"],
    twConfig,
    gifOverrideDelay: 120,
    layers: [
      {
        type: "static",
        src: beanImgSrc,
        size: { width: 820, height: 740 },
        position: { left: 200, top: 188 },
        extrude: { left: 240, right: 240 },
        animated: false,
      },
      {
        type: "static",
        src: `/images/beanigotchi/eyes/${secondaryColor.toUpperCase().slice(1)}/left.gif`,
        size: { width: 176, height: 108 },
        position: { left: 408, top: 480 },
        animated: true,
      },
      {
        type: "static",
        src: `/images/beanigotchi/eyes/${secondaryColor.toUpperCase().slice(1)}/right.gif`,
        size: { width: 176, height: 108 },
        position: { left: 636, top: 480 },
        animated: true,
      },
      ...(await beanedexFrameLayers({
        primaryColor,
        secondaryColor,
        title: "BEAN " + beanId,
        waterBoostActive,
        foodBoostActive,
        level,
        xpPct,
      })),
    ],
  });
}
