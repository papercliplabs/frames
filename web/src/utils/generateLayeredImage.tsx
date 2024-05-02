import sharp, { Color, ResizeOptions } from "sharp";
import satori from "satori";
import { ReactNode } from "react";
import { getFontOptionsFromFontTypes, FontType } from "./imageOptions";
import { unstable_cache } from "next/cache";
import { getImageProps } from "next/image";
import { SatoriOptions } from "satori";

interface Size {
  width: number;
  height: number;
}

interface BaseImageLayer {
  size: Size;
  position?: { left: number; top: number };
  extrude?: { left: number; right: number };
  borderRadius?: number;
}

type ImageLayer =
  | ({
      type: "static";
      src: string; // For local images, must use same path as <Image>.src (i.e relative to public folder, ex: "/images/nouns-auction-house.png")
      fit?: ResizeOptions["fit"];
      animated?: boolean;
    } & BaseImageLayer)
  | ({
      type: "dynamic";
      src: ReactNode;
      fontTypes?: FontType[];
    } & BaseImageLayer);

interface GenerateLayeredImageParams {
  frameSize: Size;
  backgroundColor: Color;
  layers: ImageLayer[];
  fontTypes?: FontType[];
  twConfig?: SatoriOptions["tailwindConfig"];
}

async function getImageBufferForLayer(
  layer: ImageLayer,
  frameSize: Size,
  fontTypes?: FontType[],
  twConfig?: SatoriOptions["tailwindConfig"]
): Promise<Buffer> {
  let sharpImage;

  if (layer.type == "dynamic") {
    const svg = await satori(layer.src, {
      width: layer.size.width,
      height: layer.size.height,
      fonts: (await getFontOptionsFromFontTypes(fontTypes && fontTypes.length > 0 ? fontTypes : ["inter"])) ?? [],
      tailwindConfig: twConfig,
    });
    sharpImage = await sharp(Buffer.from(svg)).png();
  } else {
    if (new RegExp("^https://").test(layer.src)) {
      const resp = await fetch(layer.src, { cache: "no-cache" }); // Disable cache here, since some images may be > 2MB (we cache the generated output)
      const buffer = Buffer.from(await resp.arrayBuffer());
      sharpImage = await sharp(buffer, { animated: layer.animated });
    } else if (new RegExp(";base64").test(layer.src)) {
      // Base 64
      const base64Encoded = layer.src.split(";base64").pop();
      sharpImage = await sharp(Buffer.from(base64Encoded!, "base64")).png();
    } else {
      // Local image
      const imageProps = getImageProps({ src: layer.src, width: layer.size.width, height: layer.size.height, alt: "" });
      const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}${imageProps.props.src}`); // Fully cache this (if over 2MB, throws error)
      const buffer = Buffer.from(await resp.arrayBuffer());
      sharpImage = await sharp(buffer, { animated: layer.animated });
    }

    if (!layer.animated) {
      sharpImage = sharpImage.png();
    }
  }

  if (layer.extrude) {
    const extrudedImage = sharpImage.extend({
      left: layer.extrude.left,
      right: layer.extrude.right,
      extendWith: "copy",
    });
    sharpImage = await sharp(await extrudedImage.toBuffer());
  }

  const positionLeft = Math.min(layer.position?.left ?? 0, frameSize.width - layer.size.width);
  const positionTop = Math.min(layer.position?.top ?? 0, frameSize.height - layer.size.height);
  const extendRight = frameSize.width - positionLeft - layer.size.width;
  const extendBottom = frameSize.height - positionTop - layer.size.height;

  const extendInput = {
    left: positionLeft,
    top: positionTop,
    right: extendRight,
    bottom: extendBottom,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  };

  sharpImage.resize(layer.size.width, layer.size.height, { fit: layer.type == "static" ? layer.fit : "cover" });
  sharpImage.extend(extendInput);

  if (layer.borderRadius) {
    const roundedCorners = sharp(
      Buffer.from(
        `<svg width="${layer.size.width}" height="${layer.size.height}"><rect x="0" y="0" width="${layer.size.width}" height="${layer.size.height}" rx="${layer.borderRadius}" ry="${layer.borderRadius}" /></svg>`
      )
    )
      .resize(layer.size.width, layer.size.height)
      .extend(extendInput);

    sharpImage.composite([{ input: await roundedCorners.toBuffer(), tile: true, blend: "dest-in" }]);
  }

  return await sharpImage.toBuffer();
}

const getImageBufferForLayerCached = unstable_cache(getImageBufferForLayer, ["get-image-buffer-for-layer"]);

export async function generateLayeredImage({
  frameSize,
  backgroundColor,
  layers,
  fontTypes,
  twConfig,
}: GenerateLayeredImageParams) {
  const layerImageBuffers = await Promise.all(
    layers.map((layer) => getImageBufferForLayerCached(layer, frameSize, fontTypes, twConfig))
  );
  const layerImageMetadata = await Promise.all(layerImageBuffers.map((buffer) => sharp(buffer).metadata()));
  const maxGifPages = layerImageMetadata.reduce((prevMax, metadata) => Math.max(metadata.pages ?? 1, prevMax), 1);

  const base = sharp({
    create: {
      width: frameSize.width,
      height: frameSize.width * maxGifPages, // Gifs are represented as vertical "toilet roll", the base needs to extend to accommodate this
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

  const imageBase64 = `data:image/gif;base64,${combined.toString("base64")}`;
  return imageBase64;
}

export const generateLayeredImageCached = unstable_cache(generateLayeredImage, ["generate-layered-image"]);

export async function generateLayeredImageResponse(params: GenerateLayeredImageParams) {
  const resp = await generateLayeredImageCached(params);
  return new Response(Buffer.from(resp.replace("data:image/gif;base64,", ""), "base64"), {
    headers: { "content-type": "image/gif" },
  });
}
