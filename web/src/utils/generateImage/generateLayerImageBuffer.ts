import sharp, { Color, ResizeOptions, Sharp } from "sharp";
import satori from "satori";
import { getFontOptionsFromFontTypes, FontType } from "../imageOptions";
import { unstable_cache } from "next/cache";
import { getImageProps } from "next/image";
import { SatoriOptions } from "satori";
import { ImageLayer, Size } from "./types";

interface GenerateLayerImageBufferParams {
  layer: ImageLayer;
  frameSize: Size;
  fontTypes?: FontType[];
  twConfig: SatoriOptions["tailwindConfig"];
}

async function generateLayerImageBufferUncached({
  layer,
  frameSize,
  fontTypes,
  twConfig,
}: GenerateLayerImageBufferParams): Promise<string> {
  if (layer.type == "sharp") {
    // If its already a sharp image, just return it
    const buffer = await layer.src.toBuffer();
    return buffer.toString("base64");
  }

  let sharpImage;

  if (layer.type == "dynamic") {
    const svg = await satori(layer.src, {
      width: layer.size.width,
      height: layer.size.height,
      fonts: (await getFontOptionsFromFontTypes(fontTypes && fontTypes.length > 0 ? fontTypes : ["inter"])) ?? [],
      tailwindConfig: twConfig,
      // embedFont: true,
      // debug: true,
    });

    sharpImage = await sharp(Buffer.from(svg)).png({ force: true, quality: 100 });
  } else {
    const layerSrcNormalized = layer.src.replace("ipfs://", "https://ipfs.io/ipfs/");
    if (new RegExp("^https://").test(layerSrcNormalized)) {
      const resp = await fetch(layerSrcNormalized, { cache: "no-store" }); // Disable cache here, since some images may be > 2MB (we cache the generated output)
      const buffer = Buffer.from(await resp.arrayBuffer());
      sharpImage = await sharp(buffer, { animated: layer.animated });

      if (!layer.animated) {
        sharpImage = sharpImage.png({ force: true, quality: 65 });
      }
    } else if (new RegExp(";base64").test(layerSrcNormalized)) {
      // Base 64
      const base64Encoded = layerSrcNormalized.split(";base64").pop();
      sharpImage = await sharp(Buffer.from(base64Encoded!, "base64")).png();
    } else {
      // Local image
      const imageProps = getImageProps({
        src: layerSrcNormalized,
        width: layer.size.width,
        height: layer.size.height,
        alt: "",
      });
      const resp = await fetch(`${process.env.NEXT_PUBLIC_URL}${imageProps.props.src}`); // Fully cache this (if over 2MB, throws error)
      const buffer = Buffer.from(await resp.arrayBuffer());
      sharpImage = await sharp(buffer, { animated: layer.animated });
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

  // Need to return base64 string instead of buffers due to unstable_cache not serializing buffers correctly
  const buffer = await sharpImage.toBuffer();
  return buffer.toString("base64");
}

export const generateLayerImageBuffer = unstable_cache(generateLayerImageBufferUncached, [
  "generate-layer-image-buffer",
]);