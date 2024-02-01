import { FontType } from "@/utils/baseImg";
import { Address, PublicClient, WalletClient } from "viem";
import { basedAndYellowFrameEditionOneCollectionConfig } from "./individualConfigs/basedAndYellowFrameEditionOne";

export type SupportedMintCollection = "based-and-yellow-frame-edition-one";

export interface CollectionMintCondition {
    name: string;
    description: string;
    check: (user: Address, castId: number) => Promise<boolean>;
}

export interface CollectionConfig {
    client: PublicClient; // TODO: make to wallet client (?)
    collectionName: string;
    collectionDescription: string;
    collectionAddress: Address;
    learnMoreName: string;
    learnMoreUrl: string;
    mintAndConditions: CollectionMintCondition[];
    mintOrConditions: CollectionMintCondition[];
    oneMintPerAddress: boolean;
    homePageImage: string;
    alreadyMintedImage: string;
    successfulMintImage: string;
    style: {
        backgroundColor: string;
        fontColor: string;
        font: FontType;
    };
}

export const collectionConfigs: Record<SupportedMintCollection, CollectionConfig> = {
    "based-and-yellow-frame-edition-one": basedAndYellowFrameEditionOneCollectionConfig,
};
