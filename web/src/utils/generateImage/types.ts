import { ResizeOptions, Sharp } from "sharp";
import { ReactNode } from "react";
import { FontType } from "../imageOptions";

export interface Size {
  width: number;
  height: number;
}

interface BaseImageLayer {
  size: Size;
  position?: { left: number; top: number };
  extrude?: { left?: number; right?: number; top?: number; bottom?: number };
  borderRadius?: number;
}

export type ImageLayer =
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
    } & BaseImageLayer)
  | { type: "sharp"; src: Sharp };
