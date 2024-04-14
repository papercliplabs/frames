import sharp, { Color, ResizeOptions } from "sharp";
import satori from "satori";
import { ReactNode } from "react";
import { getFontOptionsFromFontTypes, FontType } from "./imageOptions";

interface Size {
  width: number;
  height: number;
}

interface BaseImageLayer {
  size: Size;
  position?: { left: number; top: number };
}

type ImageLayer =
  | ({
      type: "static";
      src: string;
      fit?: ResizeOptions["fit"];
      animated?: boolean;
    } & BaseImageLayer)
  | ({
      type: "dynamic";
      src: ReactNode;
      fontTypes: FontType[];
    } & BaseImageLayer);

interface GenerateLayeredImageParams {
  frameSize: Size;
  backgroundColor: Color;
  layers: ImageLayer[];
}

async function getImageBufferForLayer(layer: ImageLayer, frameSize: Size): Promise<Buffer> {
  let sharpImage;

  if (layer.type == "dynamic") {
    const svg = await satori(layer.src, {
      width: layer.size.width,
      height: layer.size.height,
      fonts: (await getFontOptionsFromFontTypes(layer.fontTypes)) ?? [],
    });

    sharpImage = await sharp(Buffer.from(svg)).png();
  } else {
    if (new RegExp("^https://").test(layer.src)) {
      const resp = await fetch(layer.src); // Fully cache this
      sharpImage = await sharp(Buffer.from(await resp.arrayBuffer()), { animated: layer.animated });
    } else {
      sharpImage = await sharp(layer.src, { animated: layer.animated });
    }
  }

  const positionLeft = Math.min(layer.position?.left ?? 0, frameSize.width - layer.size.width);
  const positionTop = Math.min(layer.position?.top ?? 0, frameSize.height - layer.size.height);
  const extendRight = frameSize.width - positionLeft - layer.size.width;
  const extendBottom = frameSize.height - positionTop - layer.size.height;

  sharpImage.resize(layer.size.width, layer.size.height, { fit: layer.type == "static" ? layer.fit : "cover" }).extend({
    left: positionLeft,
    top: positionTop,
    right: extendRight,
    bottom: extendBottom,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  return await sharpImage.toBuffer();
}

// TODO(spennyp): wrap with unstable cache when done
export default async function generateLayeredImage({ frameSize, backgroundColor, layers }: GenerateLayeredImageParams) {
  const layerImageBuffers = await Promise.all(layers.map((layer) => getImageBufferForLayer(layer, frameSize)));
  const layerImageMetadata = await Promise.all(layerImageBuffers.map((buffer) => sharp(buffer).metadata()));
  const maxGifPages = layerImageMetadata.reduce((prevMax, metadata) => Math.max(metadata.pages ?? 1, prevMax), 1);

  const base = sharp({
    create: {
      width: frameSize.width,
      height: frameSize.height * maxGifPages, // Gifs are represented as vertical "toilet roll", the base needs to extend to accommodate this
      channels: 4,
      background: backgroundColor,
    },
  });

  const combined = await base
    .gif({ force: true })
    .composite(
      layers.map((layer, i) => ({
        input: layerImageBuffers[i],
        animated: layer.type == "static" ? layer.animated : false,
        tile: true,
        top: 0,
        left: 0,
      }))
    )
    .toBuffer();

  return `data:image/png;base64,${combined.toString("base64")}`;
}
