import { FontType } from "@/utils/baseImg";
import { Address, PublicClient } from "viem";
import { basedAndYellowFrameEditionOneCollectionConfig } from "./individualConfigs/basedAndYellowFrameEditionOne";
import { beansTheAdventureBeginsConfig } from "./individualConfigs/beansTheAdventureBegins";
import { FrameRequest } from "@/utils/farcaster";

export type SupportedMintCollection = "based-and-yellow-frame-edition-one" | "beans-the-adventure-begins";

export interface CollectionMintCondition {
    name: string;
    description: string;
    check: (userAddress: Address, userId: number, castHash: string) => Promise<boolean>;
}

export interface MintConditionsNotMetParams {
    andConditions: {
        name: string;
        description: string;
        met: boolean;
    }[];
    orConditions: {
        name: string;
        description: string;
        met: boolean;
    }[];
}

export interface CollectionConfig {
    client: PublicClient;
    collectionName: string;
    collectionDescription: string;
    collectionAddress: Address;
    learnMoreName: string;
    learnMoreUrl: string;
    mintAndConditions: CollectionMintCondition[];
    mintOrConditions: CollectionMintCondition[];
    homePageImage: string;
    noAddressImage: string;
    soldOutImage: string;
    alreadyMintedImage: string;
    successfulMintImage: string;
    conditionsNotMetComponent: React.ComponentType<MintConditionsNotMetParams>;
    mintCallback: (request: FrameRequest) => Promise<any>;
    font: FontType;
}

export interface CheckConfig {
    name: string;
    check: (userAddress: Address, userFid: number, cashHash: string) => Promise<boolean>;
}

export const collectionConfigs: Record<SupportedMintCollection, CollectionConfig> = {
    "based-and-yellow-frame-edition-one": basedAndYellowFrameEditionOneCollectionConfig,
    "beans-the-adventure-begins": beansTheAdventureBeginsConfig,
};
