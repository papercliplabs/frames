import { Address } from "viem";
import { CollectionConfig } from "../collectionConfig";
import { basePublicClient, baseSepoliaPublicClient, mainnetPublicClient, optimismClient } from "@/utils/wallet";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { isCastLikedByUser, isChannelFollowedByUser } from "../commonChecks/farcaster";

async function isYellowChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isChannelFollowedByUser("yellow", userId);
}

async function isYellowCollectiveHolder(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isNftBalanceAboveThreshold(basePublicClient, "0x220e41499CF4d93a3629a5509410CBf9E6E0B109", userAddress, 0);
}

async function isNounHolder(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isNftBalanceAboveThreshold(
        mainnetPublicClient,
        "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
        userAddress,
        0
    );
}

async function isPurpleDaoHolder(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isNftBalanceAboveThreshold(
        mainnetPublicClient,
        "0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60",
        userAddress,
        0
    );
}

async function isFrameNftHolder(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isNftBalanceAboveThreshold(basePublicClient, "0xf359B98ff4d36722f0c34E87809Be965b0ce3a70", userAddress, 0);
}

async function isFrameVrHolder(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isNftBalanceAboveThreshold(basePublicClient, "0x73d8048044B24e6FbA5833849c3e5c26c6523719", userAddress, 0);
}

async function isNomoNounHolder(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isNftBalanceAboveThreshold(optimismClient, "0x1464eBBf9ecd642d42Db8e8827919fdd4A786987", userAddress, 0);
}

export const basedAndYellowFrameEditionOneCollectionConfig: CollectionConfig = {
    client: basePublicClient,
    collectionName: "Based and Yellow Frame Edition",
    collectionDescription: "First one!",
    collectionAddress: "0xc75A328b9544eDD315011024c31d988Fc14f5972",
    learnMoreName: "The Yellow Collective 🟡",
    learnMoreUrl: "yellowcollective.xyz",
    mintAndConditions: [
        { name: "Like this cast", description: "test", check: isCastLikedByUser },
        { name: "Follow /yellow channel", description: "test", check: isYellowChannelFollowedByUser },
    ],
    mintOrConditions: [
        { name: "Noun DAO member", description: "", check: isNounHolder },
        { name: "Yellow Collective member", description: "", check: isYellowCollectiveHolder },
        { name: "Purple DAO member", description: "", check: isPurpleDaoHolder },
        { name: "Nomo Noun member", description: "", check: isNomoNounHolder },
        { name: "Frame NFT holder", description: "", check: isFrameNftHolder },
        { name: "Frame VR holder", description: "", check: isFrameVrHolder },
    ],
    oneMintPerAddress: true,
    homePageImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/home.png`,
    noAddressImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/no-address.png`,
    soldOutImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/sold-out.png`,
    alreadyMintedImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/already-minted.png`,
    successfulMintImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/mint-successful.png`,
    conditionsNotMetIcon: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/conditions-not-met-icon.png`,
    style: {
        backgroundColor: "#FBCB07",
        fontColor: "black",
        font: "pally",
    },
};
