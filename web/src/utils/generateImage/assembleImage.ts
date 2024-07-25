import sharp, { Color } from "sharp";
import { Size } from "./types";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

interface AssembleImageParams {
  frameSize: Size;
  backgroundColor: Color;
  layerImageBufferStrings: string[];
  gifOverrideDelay?: number;
}

async function assembleImageUncached({
  frameSize,
  backgroundColor,
  layerImageBufferStrings,
  gifOverrideDelay,
}: AssembleImageParams) {
  const buffers = layerImageBufferStrings.map((bufferStr) => Buffer.from(bufferStr, "base64"));
  const layerImageMetadata = await Promise.all(buffers.map((buffer) => sharp(buffer).metadata()));
  const maxGifPages = layerImageMetadata.reduce((prevMax, metadata) => Math.max(metadata.pages ?? 1, prevMax), 1);

  const base = sharp({
    create: {
      width: frameSize.width,
      height: frameSize.height * maxGifPages, // Gifs are represented as vertical "toilet roll", the base needs to extend to accommodate this
      channels: 4,
      background: backgroundColor,
    },
  });

  const combined = base
    .gif({ force: true, delay: gifOverrideDelay ? Array(maxGifPages).fill(gifOverrideDelay) : undefined, effort: 1 })
    .composite(
      buffers.map((buffer, i) => ({
        input: buffer,
        animated: true,
        tile: true,
        top: 0,
        left: 0,
      }))
    );

  const combinedBuffer = await combined.toBuffer();

  const imageBase64 = `data:image/gif;base64,${combinedBuffer.toString("base64")}`;
  return imageBase64;
}

export const assembleImage = customUnstableCache(assembleImageUncached, ["assemble-image"]);
