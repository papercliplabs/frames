import { FontType } from "@/utils/baseImg";
import { Address, PublicClient } from "viem";
import { basedAndYellowFrameEditionOneCollectionConfig } from "./individualConfigs/basedAndYellowFrameEditionOne";

export type SupportedMintCollection = "based-and-yellow-frame-edition-one";

export interface CollectionMintCondition {
    name: string;
    description: string;
    check: (userAddress: Address, userId: number, castHash: string) => Promise<boolean>;
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
    oneMintPerAddress: boolean;
    homePageImage: string;
    noAddressImage: string;
    soldOutImage: string;
    alreadyMintedImage: string;
    successfulMintImage: string;
    conditionsNotMetIcon: string;
    style: {
        backgroundColor: string;
        fontColor: string;
        font: FontType;
    };
}

export const collectionConfigs: Record<SupportedMintCollection, CollectionConfig> = {
    "based-and-yellow-frame-edition-one": basedAndYellowFrameEditionOneCollectionConfig,
};
