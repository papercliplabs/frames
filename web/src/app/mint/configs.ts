import { Address } from "viem";
import { basedAndYellowFrameEditionOneConfig } from "./collectionConfigs/basedAndYellowFrameEditionOne";
import { FontType } from "@/utils/baseImg";
import { beansTheAdventureBeginsConfig } from "./collectionConfigs/beansTheAdventureBegins";
import { beansEnteringTheUnknownConfig } from "./collectionConfigs/beansEnteringTheUnknown";
import { FrameRequest, FrameValidationData } from "@coinbase/onchainkit";

export interface ConditionsNotMetComponentProps {
    checkPayload: URLSearchParams;
}

export interface MintConfig<T> {
    imgSrcs: {
        home: string;
        mintedOut: string;
        alreadyMinted: string;
        noAddress: string;
        successfulMint: string;
    };
    conditionsNotMetComponent: React.ComponentType<ConditionsNotMetComponentProps>;
    decisionLogic: {
        mintedOutCheck: () => Promise<boolean>;
        alreadyMintedCheck: (address: Address) => Promise<boolean>;
        mintConditionsCheck: (
            castHash: string,
            userFid: number,
            userAddress: Address,
            payload: FrameValidationData
        ) => Promise<{ passed: boolean; checkPayload: URLSearchParams }>;
    };
    mint: (request: FrameRequest, address: Address) => Promise<void>;
    learnMoreButtonConfig: {
        label: string;
        redirectUrl: string;
    };
    fonts: FontType[];
    allowedCasterFids?: number[];
}

export type SupportedMintCollection =
    | "based-and-yellow-frame-edition-one"
    | "beans-the-adventure-begins"
    | "beans-entering-the-unknown";

export const mintConfigs: Record<SupportedMintCollection, MintConfig<any>> = {
    "based-and-yellow-frame-edition-one": basedAndYellowFrameEditionOneConfig,
    "beans-the-adventure-begins": beansTheAdventureBeginsConfig,
    "beans-entering-the-unknown": beansEnteringTheUnknownConfig,
};
