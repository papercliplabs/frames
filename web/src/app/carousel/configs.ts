import { FrameButtonMetadata, FrameImageMetadata } from "@coinbase/onchainkit/frame";
import { beansDungeonConfig } from "./slugConfigs/beansDungeon";
import { beansDungeonNoMintConfig } from "./slugConfigs/beansDungeonNoMint";
import { paperclipAuctionFramesConfig } from "./slugConfigs/paperclipAuctionFrames";
import { nounsDenverCarrouselConfig } from "./slugConfigs/nounsDenver";
import { beansBaseGrantConfig } from "./slugConfigs/beansBaseGrant";

type Action = "link" | "mint" | "compose";

export interface CarouselNavButtonConfig {
  disablePrevNavigation?: boolean; // Disabled backward navigation in the carousel
  prevButtonLabel?: string; // Label used for the previous button (if !disablePrevNavigation), "<-" is used if this is not specified
  nextButtonLabel?: string; // Label used for the next button, "->" is used if this is not specified
}

export interface CarouselItemConfig {
  image: FrameImageMetadata;
  navButtonConfigOverrides?: CarouselNavButtonConfig; // Overrides, these will take priority over the global config
  buttonThreeConfig?: { label: string; target: string; action: Action };
  buttonFourConfig?: { label: string; target: string; action: Action };
}

export interface CarouselConfig {
  navButtonConfig?: CarouselNavButtonConfig;
  itemConfigs: [CarouselItemConfig, CarouselItemConfig, ...CarouselItemConfig[]]; // Min length of 2
  allowedCasterFids?: number[]; // Restricts who is allowed to cast this frame, no restrictions if undefined
}

export type SupportedCarouselSlugs =
  | "beans-dungeon"
  | "beans-dungeon-no-mint"
  | "paperclip-auction-frames"
  | "nouns-denver"
  | "beans-base-grant";

export const carouselConfigs: Record<SupportedCarouselSlugs, CarouselConfig> = {
  "beans-dungeon": beansDungeonConfig,
  "beans-dungeon-no-mint": beansDungeonNoMintConfig,
  "paperclip-auction-frames": paperclipAuctionFramesConfig,
  "nouns-denver": nounsDenverCarrouselConfig,
  "beans-base-grant": beansBaseGrantConfig,
};
