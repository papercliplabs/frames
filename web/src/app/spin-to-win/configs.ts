import { FrameContext } from "frog";
import { degenPricesSlugConfig } from "./slugConfigs/degenPrices";
import { FrameImageMetadata, FrameValidationData } from "@coinbase/onchainkit";

export interface SpinToWinConfig {
  isSoldOut: () => Promise<boolean>;
  didAlreadySpin: (fid: number) => Promise<boolean>;
  runSpin: (frameData: FrameValidationData) => Promise<FrameImageMetadata>; // Returns the spin gif
  images: {
    home: FrameImageMetadata;
    soldOut: FrameImageMetadata;
    alreadySpun: FrameImageMetadata;
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
