import { Address, getAddress } from "viem";
import { ConditionsNotMetComponentProps, MintConfig } from "../configs";
import { ValidateFrameActionResponse } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { ReactElement } from "react";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";
import { basePublicClient } from "@/utils/wallet";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { isCastLikedByUser, isChannelFollowedByUser, isUserFollowedByUser } from "../commonChecks/farcaster";
import { mintNftWithSyndicate } from "@/utils/syndicate";
import { FrameRequest, FrameValidationData } from "@coinbase/onchainkit";

const CLIENT = basePublicClient;
const COLLECTION_ADDRESS = getAddress("0x9D2c6e62fcd5C71E5CCa63F2c1aAB5bb9DFcB515");

async function mint(request: FrameRequest, address: Address) {
    console.log("WOULD MINT");
    // return mintNftWithSyndicate(request, process.env.BEANS_THE_ADVENTURE_SYNDICATE_API_KEY!);
}

async function isBeansChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isChannelFollowedByUser("beans", userId);
}

async function isFollowingBodegacatceo(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isUserFollowedByUser(11555, userId);
}

const checkConfigs = [
    { name: "Like this cast", check: isCastLikedByUser },
    { name: "Follow /beans channel", check: isBeansChannelFollowedByUser },
    { name: "Follow @bodegacatceo", check: isFollowingBodegacatceo },
];

async function mintConditionsCheck(
    castHash: string,
    userFid: number,
    userAddress: Address,
    payload: FrameValidationData
): Promise<{ passed: boolean; checkPayload: URLSearchParams }> {
    let checkResults = (
        await Promise.all(checkConfigs.map((config) => config.check(userAddress, userFid, castHash)))
    ).map((res) => (res ? 1 : 0));
    const checkPassCount = checkResults.reduce((acc, res) => acc + res, 0 as number);

    const checkPass = checkConfigs.length == checkPassCount;
    const urlParams = new URLSearchParams([["checkResults", checkResults.toString()]]);

    return { passed: checkPass, checkPayload: urlParams };
}

function ConditionIcon({ met }: { met: boolean }) {
    return (
        <>
            {met ? (
                <img
                    src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/common/met-icon.png`}
                    width="36px"
                    height="36px"
                    tw="mr-[12px]"
                />
            ) : (
                <img
                    src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/common/not-met-icon.png`}
                    width="36px"
                    height="36px"
                    tw="mr-[12px]"
                />
            )}
        </>
    );
}

function MintConditionsNotMetComponent({ checkPayload }: ConditionsNotMetComponentProps): ReactElement {
    const mintConditions = checkPayload
        .get("checkResults")
        ?.split(",")
        .map((entry, i) => {
            return {
                name: checkConfigs[i].name,
                passed: entry == "1" ? true : false,
            };
        });

    if (mintConditions == undefined) {
        return <>Error deserializing</>;
    }

    return (
        <div tw="flex w-full h-full p-[30px] bg-[#609CFF]">
            <div tw="flex flex-col w-full h-full bg-black rounded-[36px] text-white p-[54px] ">
                <div tw="flex text-[48px] w-full justify-center text-center">MISSING CONDITIONS</div>
                <span tw="pl-[416px] pt-[32px] text-[28px] flex flex-col">
                    <ul tw="flex flex-col">
                        {mintConditions.map((condition, i) => {
                            return (
                                <li key={i} tw="pb-[12px] flex flex-row items-center text-center">
                                    <ConditionIcon met={condition.passed} /> <span tw="pb-[4px]">{condition.name}</span>
                                </li>
                            );
                        })}
                    </ul>
                </span>

                <img
                    src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/common/conditions-not-met-icon.png`}
                    style={{ position: "absolute", bottom: 0, left: 0, width: 380 }}
                />
            </div>
        </div>
    );
}

export const beansTheAdventureBeginsConfig: MintConfig<any> = {
    imgSrcs: {
        home: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/home.png`,
        mintedOut: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/sold-out.png`,
        alreadyMinted: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/common/already-minted.png`,
        noAddress: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/common/no-address.png`,
        successfulMint: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/the-adventure-begins/mint-successful.png`,
    },
    conditionsNotMetComponent: MintConditionsNotMetComponent,
    decisionLogic: {
        mintedOutCheck: () => isNftSoldOut(CLIENT, COLLECTION_ADDRESS),
        alreadyMintedCheck: (address) => isNftBalanceAboveThreshold(CLIENT, COLLECTION_ADDRESS, address, 0),
        mintConditionsCheck,
    },
    mint,
    learnMoreButtonConfig: {
        label: "BEANSDAO",
        redirectUrl: "https://beans.wft",
    },
    fonts: ["druk"],
};
