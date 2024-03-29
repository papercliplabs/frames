import { ImageResponseOptions } from "next/server";

export type Optional<T> = T | undefined | null;

export interface FrameImageData {
  image: string | JSX.Element;
  imageAspectRatio: "1:1" | "1.91:1";
  imageOptions?: ImageResponseOptions;
}
