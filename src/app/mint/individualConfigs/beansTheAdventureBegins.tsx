import { basePublicClient, baseSepoliaPublicClient, mainnetPublicClient } from "@/utils/wallet";
import { CollectionConfig, MintConditionsNotMetParams } from "../collectionConfig";
import { isCastLikedByUser, isChannelFollowedByUser, isUserFollowedByUser } from "../commonChecks/farcaster";
import { Address } from "viem";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { ReactElement } from "react";
import { FrameRequest } from "@/utils/farcaster";
import { mintNftWithSyndicate } from "@/utils/syndicate";

async function isBeansChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isChannelFollowedByUser("beans", userId);
}

async function isNounsChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isChannelFollowedByUser("nouns", userId);
}

async function isYellowChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isChannelFollowedByUser("yellow", userId);
}

async function isFollowingBodegacatceo(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isUserFollowedByUser(11555, userId);
}

async function mintCallback(request: FrameRequest): Promise<any> {
    return mintNftWithSyndicate(request, process.env.BEANS_THE_ADVENTURE_SYNDICATE_API_KEY!);
}

export const beansTheAdventureBeginsConfig: CollectionConfig = {
    client: basePublicClient,
    collectionName: "Beans - The Adventure Begins",
    collectionDescription: "by bodegacatceo",
    collectionAddress: "0x9D2c6e62fcd5C71E5CCa63F2c1aAB5bb9DFcB515",
    learnMoreName: "BEANSDAO",
    learnMoreUrl: "beans.wtf",
    mintAndConditions: [
        { name: "Like this cast", description: "test", check: isCastLikedByUser },
        { name: "Follow /beans channel", description: "test", check: isBeansChannelFollowedByUser },
        { name: "Follow @bodegacatceo", description: "test", check: isFollowingBodegacatceo },
    ],
    mintOrConditions: [
        // { name: "Follow /nouns channel", description: "", check: isNounsChannelFollowedByUser },
        // { name: "Follow /yellow channel", description: "", check: isYellowChannelFollowedByUser },
        // { name: "Follow /yellow channel", description: "", check: isYellowChannelFollowedByUser },
    ],
    homePageImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/home.png`,
    noAddressImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/no-address.png`,
    soldOutImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/sold-out.png`,
    alreadyMintedImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/already-minted.png`,
    successfulMintImage: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/mint-successful.png`,
    conditionsNotMetComponent: MintConditionsNotMet,
    mintCallback,
    font: "druk",
};

function ConditionIcon({ met }: { met: boolean }) {
    return (
        <>
            {met ? (
                <img
                    src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/met-icon2.png`}
                    width="36px"
                    height="36px"
                    tw="mr-[12px]"
                />
            ) : (
                <img
                    src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/not-met-icon.png`}
                    width="36px"
                    height="36px"
                    tw="mr-[12px]"
                />
            )}
        </>
    );
}

function MintConditionsNotMet({ andConditions, orConditions }: MintConditionsNotMetParams): ReactElement {
    const orMet = orConditions.reduce((acc, cond) => acc || cond.met, false);
    // const andConditionsWithOr = [...andConditions, { name: "One of:", description: "", met: orMet }];

    return (
        <div tw="flex w-full h-full p-[30px] bg-[#609CFF]">
            <div tw="flex flex-col w-full h-full bg-black rounded-[36px] text-white p-[54px] ">
                <div tw="flex text-[48px] w-full justify-center text-center">MISSING CONDITIONS</div>
                <span tw="pl-[416px] pt-[32px] text-[28px] flex flex-col">
                    <ul tw="flex flex-col">
                        {andConditions.map((condition, i) => {
                            return (
                                <li key={i} tw="pb-[12px] flex flex-row items-center text-center">
                                    <ConditionIcon met={condition.met} /> <span tw="pb-[4px]">{condition.name}</span>
                                </li>
                            );
                        })}
                    </ul>
                    {/* <ul tw="flex flex-col pl-[64px]">
                        {orConditions.map((condition, i) => {
                            return (
                                <li key={i} tw="pb-[12px] flex flex-row items-center text-center">
                                    <ConditionIcon met={condition.met} /> <span tw="pb-[4px]">{condition.name}</span>
                                </li>
                            );
                        })}
                    </ul> */}
                </span>

                <img
                    src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/conditions-not-met-icon.png`}
                    style={{ position: "absolute", bottom: 0, left: 0, width: 380 }}
                />
            </div>
        </div>
    );
}
