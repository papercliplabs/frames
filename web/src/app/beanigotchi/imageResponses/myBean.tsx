import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { beanedexFrameLayers } from "./partial/beanidexFrameLayers";
import { ENABLE_ANIMATIONS, SCALER } from "../utils/constants";

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
  return generateImageResponse({
    frameSize: {
      width: Math.floor(1200 * SCALER),
      height: Math.floor(1200 * SCALER),
    },
    backgroundColor: primaryColor,
    fontTypes: ["graphik"],
    gifOverrideDelay: 120,
    layers: [
      {
        type: "static",
        src: beanImgSrc,
        size: { width: Math.floor(820 * SCALER), height: Math.floor(740 * SCALER) },
        position: { left: Math.floor(200 * SCALER), top: Math.floor(188 * SCALER) },
        extrude: { left: Math.floor(40 * SCALER), right: Math.floor(40 * SCALER) },
        animated: false,
      },
      {
        type: "static",
        src: `/images/beanigotchi/eyes/${secondaryColor.toUpperCase().slice(1)}/left.gif`,
        size: { width: Math.floor(176 * SCALER), height: Math.floor(108 * SCALER) },
        position: { left: Math.floor(408 * SCALER), top: Math.floor(480 * SCALER) },
        animated: ENABLE_ANIMATIONS,
      },
      {
        type: "static",
        src: `/images/beanigotchi/eyes/${secondaryColor.toUpperCase().slice(1)}/right.gif`,
        size: { width: Math.floor(176 * SCALER), height: Math.floor(108 * SCALER) },
        position: { left: Math.floor(636 * SCALER), top: Math.floor(480 * SCALER) },
        animated: ENABLE_ANIMATIONS,
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
