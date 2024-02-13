import { beansDungeonConfig } from "./slugConfigs/beansDungeon";
import { beansDungeonNoMintConfig } from "./slugConfigs/beansDungeonNoMint";
import { paperclipAuctionFramesConfig } from "./slugConfigs/paperclipAuctionFrames";

export interface CarouselNavButtonConfig {
    disablePrevNavigation?: boolean; // Disabled backward navigation in the carousel
    prevButtonLabel?: string; // Label used for the previous button (if !disablePrevNavigation), "<-" is used if this is not specified
    nextButtonLabel?: string; // Label used for the next button, "->" is used if this is not specified
}

export interface CarouselItemConfig {
    imgSrc: string; // Image source for this item
    navButtonConfigOverrides?: CarouselNavButtonConfig; // Overrides, these will take priority over the global config
    redirectButtonConfig?: {
        // If specified, adds a redirection button to an external link to the item page
        label: string; // Label for the button
        url: string; // Url to redirect to
    };
    composeButtonConfig?: {
        // If specified, adds a button to compose frames by navigating to a new frame
        label: string; // Label for this button
        postUrl: string; // New frames url
    };
}

export interface CarouselConfig {
    navButtonConfig?: CarouselNavButtonConfig;
    itemConfigs: [CarouselItemConfig, CarouselItemConfig, ...CarouselItemConfig[]]; // Min length of 2
    allowedCasterFids?: number[]; // Restricts who is allowed to cast this frame, no restrictions if undefined
}

export type SupportedCarouselSlugs = "beans-dungeon" | "beans-dungeon-no-mint" | "paperclip-auction-frames";

export const carouselConfigs: Record<SupportedCarouselSlugs, CarouselConfig> = {
    "beans-dungeon": beansDungeonConfig,
    "beans-dungeon-no-mint": beansDungeonNoMintConfig,
    "paperclip-auction-frames": paperclipAuctionFramesConfig,
};
