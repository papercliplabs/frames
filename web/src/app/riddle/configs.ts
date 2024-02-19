import { FrameImageMetadata } from "@coinbase/onchainkit";
import { beansRiddleConfig } from "./slugConfigs/beans";
import { FontType } from "@/utils/baseImg";

export interface RiddleAndAnswer {
    riddle: string;
    answer: string;
}

export interface RiddleContentProps {
    riddle: string;
}

export interface RiddleConfig {
    images: {
        home: FrameImageMetadata;
        riddle: FrameImageMetadata;
        correct: FrameImageMetadata;
    };
    riddleContent: React.ComponentType<RiddleContentProps>;
    getRiddle: (id?: number) => Promise<(RiddleAndAnswer & { id: number }) | undefined>; // Move logic here
    redirectInfo: {
        label: string;
        target: string;
    };
    fonts: FontType[];
    allowedCasterFids?: number[];
}

export type SupportedRiddleSlug = "beans";

export const riddleConfigs: Record<SupportedRiddleSlug, RiddleConfig> = {
    beans: beansRiddleConfig,
};
