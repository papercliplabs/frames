import { Color } from "sharp";
import { ImageLayer, Size } from "./types";

import { SatoriOptions } from "satori";
import { generateLayerImageBuffer } from "./generateLayerImageBuffer";
import { FontType } from "../imageOptions";
import { assembleImage } from "./assembleImage";

interface GenerateLayeredImageParams {
  frameSize: Size;
  backgroundColor: Color;
  layers: ImageLayer[];
  fontTypes?: FontType[];
  twConfig?: SatoriOptions["tailwindConfig"];
  gifOverrideDelay?: number;
}

export async function generateImage({
  frameSize,
  backgroundColor,
  layers,
  fontTypes,
  twConfig,
  gifOverrideDelay,
}: GenerateLayeredImageParams) {
  const layerImageBufferStrings = await Promise.all(
    layers.map((layer) => generateLayerImageBuffer({ layer, frameSize, fontTypes: fontTypes ?? ["inter"], twConfig }))
  );
  const generateImage = await assembleImage({ frameSize, backgroundColor, layerImageBufferStrings, gifOverrideDelay });

  return generateImage;
}

export async function generateImageResponse({
  imageCacheMaxAgeS,
  ...params
}: GenerateLayeredImageParams & { imageCacheMaxAgeS?: number }) {
  const image = await generateImage(params);

  return new Response(Buffer.from(image.replace("data:image/gif;base64,", ""), "base64"), {
    headers: {
      "content-type": "image/gif",
      "cache-control": `max-age=${imageCacheMaxAgeS ? Math.ceil(imageCacheMaxAgeS) : 0}, must-revalidate`,
    },
  });
}
