import { Color } from "sharp";
import { Size } from "./types";
import { ImageLayer } from "../generateLayeredImage";

import { SatoriOptions } from "satori";
import { generateLayerImageBuffer } from "./generateLayerImageBuffer";
import { FontType, getFontOptionsFromFontTypes } from "../imageOptions";
import { assembleImage } from "./assembleImage";

interface GenerateLayeredImageParams {
  frameSize: Size;
  backgroundColor: Color;
  layers: ImageLayer[];
  fontTypes?: FontType[];
  twConfig?: SatoriOptions["tailwindConfig"];
}

export async function generateImage({
  frameSize,
  backgroundColor,
  layers,
  fontTypes,
  twConfig,
}: GenerateLayeredImageParams) {
  const layerImageBufferStrings = await Promise.all(
    layers.map((layer) => generateLayerImageBuffer({ layer, frameSize, fontTypes: fontTypes ?? ["inter"], twConfig }))
  );
  const generateImage = await assembleImage({ frameSize, backgroundColor, layerImageBufferStrings });

  return generateImage;
}

export async function generateImageResponse(params: GenerateLayeredImageParams) {
  const image = await generateImage(params);

  return new Response(Buffer.from(image.replace("data:image/gif;base64,", ""), "base64"), {
    headers: {
      "content-type": "image/gif",
      "cache-control": "max-age=0, must-revalidate",
    },
  });
}
