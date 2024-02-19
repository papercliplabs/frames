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
const COLLECTION_ADDRESS = getAddress("0x2E5d5CDbE5b434D616b9b8597109f100A33dbebE");

async function mint(request: FrameRequest, address: Address) {
    console.log("WOULD MINT");
    // return mintNftWithSyndicate(request, process.env.BEANS_ENTERING_THE_UNKNOWN_SYNDICATE_API_KEY!);
}

async function isBeansChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return true; //isChannelFollowedByUser("beans", userId);
}

async function isFollowingJack(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isUserFollowedByUser(3362, userId);
}

async function isFollowingPaperclipLabs(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    return isUserFollowedByUser(318911, userId);
}

const checkConfigs = [
    { name: "Like this cast", check: isCastLikedByUser },
    { name: "Follow /beans channel", check: isBeansChannelFollowedByUser },
    { name: "Follow @maschka", check: isFollowingJack },
    { name: "Follow @papercliplabs", check: isFollowingPaperclipLabs },
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
        <div tw="flex w-full h-full relative">
            <img
                src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/common/conditions-not-met.png`}
                style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630 }}
            />
            <ul tw="flex flex-col absolute top-[180px] left-[500px] w-[670px] text-white text-[42px]">
                {mintConditions.map((condition, i) => {
                    const boldName = condition.name.substring(0, condition.name.indexOf(" ")); // "72"
                    const normalName = condition.name.substring(condition.name.indexOf(" ") + 1);
                    return (
                        <li key={i} tw="pb-[12px] flex flex-row items-center text-center">
                            <b>
                                <ConditionIcon met={condition.passed} />{" "}
                                <span tw="flex items-center text-center flex-row">
                                    <span tw="pr-2" style={{ fontFamily: "graphikBold" }}>
                                        {boldName}
                                    </span>
                                    <span>{normalName}</span>
                                </span>
                            </b>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export const beansEnteringTheUnknownConfig: MintConfig<any> = {
    images: {
        home: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/entering-the-unknown/home.png`,
            aspectRatio: "1.91:1",
        },
        mintedOut: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/entering-the-unknown/sold-out.gif`,
            aspectRatio: "1.91:1",
        },
        alreadyMinted: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/common/already-minted.png`,
            aspectRatio: "1.91:1",
        },
        noAddress: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/common/no-address.png`,
            aspectRatio: "1.91:1",
        },
        successfulMint: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/entering-the-unknown/mint-successful.gif`,
            aspectRatio: "1.91:1",
        },
    },
    conditionsNotMetComponent: MintConditionsNotMetComponent,
    conditionsNotMetAspectRatio: "1.91:1",
    decisionLogic: {
        mintedOutCheck: () => isNftSoldOut(CLIENT, COLLECTION_ADDRESS),
        alreadyMintedCheck: (address) => isNftBalanceAboveThreshold(CLIENT, COLLECTION_ADDRESS, address, 0),
        mintConditionsCheck,
    },
    mint,
    learnMoreButtonConfig: {
        label: "BEANSDAO",
        redirectUrl: "https://beans.wtf",
    },
    fonts: ["graphik", "graphikBold"],
    allowedCasterFids: [3362, 18655, 318911],
};
