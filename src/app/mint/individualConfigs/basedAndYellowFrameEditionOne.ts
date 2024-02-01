import { Address, PublicClient, WalletClient } from "viem";
import { CollectionConfig } from "../collectionConfig";
import { basePublicClient, mainnetPublicClient } from "@/utils/wallet";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";

async function firstCheck(user: Address, castId: number): Promise<boolean> {
    return false;
}

async function isNounHolder(user: Address, castId: number): Promise<boolean> {
    return isNftBalanceAboveThreshold(mainnetPublicClient, "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03", user, 0);
}

async function isYellowCollectiveHolder(user: Address, castId: number): Promise<boolean> {
    return isNftBalanceAboveThreshold(basePublicClient, "0x220e41499CF4d93a3629a5509410CBf9E6E0B109", user, 0);
}

async function isPurpleDaoHolder(user: Address, castId: number): Promise<boolean> {
    return isNftBalanceAboveThreshold(mainnetPublicClient, "0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60", user, 0);
}

async function isFrameNftHolder(user: Address, castId: number): Promise<boolean> {
    return isNftBalanceAboveThreshold(basePublicClient, "0xf359B98ff4d36722f0c34E87809Be965b0ce3a70", user, 0);
}

async function isFrameVrHolder(user: Address, castId: number): Promise<boolean> {
    return isNftBalanceAboveThreshold(basePublicClient, "0x73d8048044B24e6FbA5833849c3e5c26c6523719", user, 0);
}

export const basedAndYellowFrameEditionOneCollectionConfig: CollectionConfig = {
    client: basePublicClient,
    collectionName: "Based and Yellow Frame Edition",
    collectionDescription: "First one!",
    collectionAddress: "0x00",
    learnMoreName: "Yellow 🟡",
    learnMoreUrl: "yellowcollective.xyz",
    mintAndConditions: [{ name: "and cond 1", description: "test", check: firstCheck }], // TODO
    mintOrConditions: [
        { name: "Noun Holder", description: "", check: isNounHolder },
        { name: "Yellow Collective Holder", description: "", check: isYellowCollectiveHolder },
        { name: "Purple DAO Holder", description: "", check: isPurpleDaoHolder },
        { name: "Frame NFT Holder", description: "", check: isFrameNftHolder },
        { name: "Frame VR Holder", description: "", check: isFrameVrHolder },
    ],
    oneMintPerAddress: true,
    homePageImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/home.png`,
    alreadyMintedImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/already-minted.png`,
    successfulMintImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/mint-successful.png`,
    style: {
        backgroundColor: "black",
        fontColor: "white",
        font: "pally",
    },
};
