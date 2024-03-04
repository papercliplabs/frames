/** @jsxImportSource frog/jsx */
import { FrameContext } from "frog";
import { degenPricesSlugConfig } from "./slugConfigs/degenPrices";
import { FrameImageData } from "@/utils/types";

export interface SpinToWinConfig {
    isSoldOut: () => Promise<boolean>;
    didAlreadySpin: (fid: number) => Promise<boolean>;
    runSpin: (frameData: Exclude<FrameContext["frameData"], undefined>) => Promise<FrameImageData>; // Returns the spin gif
    images: {
        home: FrameImageData;
        soldOut: FrameImageData;
        alreadySpun: FrameImageData;
    };
    externalLinkConfig: {
        title: string;
        href: string;
    };
}

export type SupportedSpinToWinSlug = "degen-prices";

export const spinToWinConfigs: Record<SupportedSpinToWinSlug, SpinToWinConfig> = {
    "degen-prices": degenPricesSlugConfig,
};
