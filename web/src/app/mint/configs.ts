import { Address } from "viem";
import { basedAndYellowFrameEditionOneConfig } from "./collectionConfigs/basedAndYellowFrameEditionOne";
import { FontType } from "@/utils/baseImg";
import { beansTheAdventureBeginsConfig } from "./collectionConfigs/beansTheAdventureBegins";
import { beansEnteringTheUnknownConfig } from "./collectionConfigs/beansEnteringTheUnknown";
import { FrameImageMetadata, FrameRequest, FrameValidationData } from "@coinbase/onchainkit";
import { mainCharactersGenslerCoinConfig } from "./collectionConfigs/mainCharactersGenslerCoin";
import { beansBeanBoogieConfig } from "./collectionConfigs/beansBeanBoogie";
import { nounsDenverConfig } from "./collectionConfigs/nounsDenver";
import { paltryLikesConfig } from "./collectionConfigs/paltryLikes";

export interface ConditionsNotMetComponentProps {
    checkPayload: URLSearchParams;
}

export interface MintConfig<T> {
    images: {
        home: FrameImageMetadata;
        mintedOut: FrameImageMetadata;
        alreadyMinted: FrameImageMetadata;
        noAddress: FrameImageMetadata;
        successfulMint: FrameImageMetadata;
    };
    conditionsNotMetComponent: React.ComponentType<ConditionsNotMetComponentProps>;
    conditionsNotMetAspectRatio: "1.91:1" | "1:1";
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
    composeToGetRequest?: boolean;
}

export type SupportedMintCollection =
    | "based-and-yellow-frame-edition-one"
    | "beans-the-adventure-begins"
    | "beans-entering-the-unknown"
    | "maincharacters-gensler-coin"
    | "beans-bean-boogie"
    | "nouns-denver"
    | "paltry-likes";

export const mintConfigs: Record<SupportedMintCollection, MintConfig<any>> = {
    "based-and-yellow-frame-edition-one": basedAndYellowFrameEditionOneConfig,
    "beans-the-adventure-begins": beansTheAdventureBeginsConfig,
    "beans-entering-the-unknown": beansEnteringTheUnknownConfig,
    "maincharacters-gensler-coin": mainCharactersGenslerCoinConfig,
    "beans-bean-boogie": beansBeanBoogieConfig,
    "nouns-denver": nounsDenverConfig,
    "paltry-likes": paltryLikesConfig,
};
