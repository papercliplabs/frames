import sharp, { Color } from "sharp";
import { Size } from "./types";
import { unstable_cache } from "next/cache";

interface AssembleImageParams {
  frameSize: Size;
  backgroundColor: Color;
  layerImageBufferStrings: string[];
}

async function assembleImageUncached({ frameSize, backgroundColor, layerImageBufferStrings }: AssembleImageParams) {
  const buffers = layerImageBufferStrings.map((bufferStr) => Buffer.from(bufferStr, "base64"));
  const layerImageMetadata = await Promise.all(buffers.map((buffer) => sharp(buffer).metadata()));
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
      buffers.map((buffer, i) => ({
        input: buffer,
        animated: true,
        tile: true,
        top: 0,
        left: 0,
      }))
    )
    .toBuffer();

  const imageBase64 = `data:image/gif;base64,${combined.toString("base64")}`;
  return imageBase64;
}

export const assembleImage = unstable_cache(assembleImageUncached, ["assemble-image"]);
