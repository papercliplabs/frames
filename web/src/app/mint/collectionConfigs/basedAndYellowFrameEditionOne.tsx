import { Address, getAddress } from "viem";
import { ConditionsNotMetComponentProps, MintConfig } from "../configs";
import { ValidateFrameActionResponse } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { ReactElement } from "react";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";
import { basePublicClient, mainnetPublicClient, optimismClient } from "@/utils/wallet";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { isCastLikedByUser, isChannelFollowedByUser } from "../commonChecks/farcaster";
import { mintNftWithSyndicate } from "@/utils/syndicate";
import { FrameRequest, FrameValidationData } from "@coinbase/onchainkit";

const CLIENT = basePublicClient;
const COLLECTION_ADDRESS = getAddress("0xc75A328b9544eDD315011024c31d988Fc14f5972");

async function mint(request: FrameRequest, address: Address) {
    console.log("WOULD MINT");
    // return mintNftWithSyndicate(request, process.env.YELLOW_COLLECTIVE_EDITION_ONE_SYNDICATE_API_KEY!);
}

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

const andCheckConfigs = [
    { name: "Like this cast", check: isCastLikedByUser },
    { name: "Follow /yellow channel", check: isYellowChannelFollowedByUser },
];

const orCheckConfigs = [
    { name: "Noun DAO member", check: isNounHolder },
    { name: "Yellow Collective member", check: isYellowCollectiveHolder },
    { name: "Purple DAO member", check: isPurpleDaoHolder },
    { name: "Nomo Noun member", check: isNomoNounHolder },
    { name: "Frame NFT holder", check: isFrameNftHolder },
    { name: "Frame VR holder", check: isFrameVrHolder },
];

async function mintConditionsCheck(
    castHash: string,
    userFid: number,
    userAddress: Address,
    payload: FrameValidationData
): Promise<{ passed: boolean; checkPayload: URLSearchParams }> {
    let checkResults = await Promise.all([
        ...andCheckConfigs.map((config) => config.check(userAddress, userFid, castHash)),
        ...orCheckConfigs.map((config) => config.check(userAddress, userFid, castHash)),
    ]);

    const andCheckResults: (0 | 1)[] = [];
    const orCheckResults: (0 | 1)[] = [];
    checkResults.forEach((res, i) => {
        const val = res ? 1 : 0;
        if (i < andCheckConfigs.length) {
            andCheckResults.push(val);
        } else {
            orCheckResults.push(val);
        }
    });

    const andCheckPassCount = andCheckResults.reduce((acc, res) => acc + res, 0 as number);
    const orCheckPassCount = orCheckResults.reduce((acc, res) => acc + res, 0 as number);

    const andCheckPass = andCheckConfigs.length == andCheckPassCount;
    const orCheckPass = orCheckPassCount > 0 || orCheckConfigs.length == 0;

    const urlParams = new URLSearchParams([
        ["andCheckResults", andCheckResults.toString()],
        ["orCheckResults", orCheckResults.toString()],
    ]);

    return { passed: andCheckPass && orCheckPass, checkPayload: urlParams };
}

function MintConditionsNotMetComponent({ checkPayload }: ConditionsNotMetComponentProps): ReactElement {
    const mintAndConditions = checkPayload
        .get("andCheckResults")
        ?.split(",")
        .map((entry, i) => {
            return {
                name: andCheckConfigs[i].name,
                passed: entry == "1" ? true : false,
            };
        });

    const mintOrConditions = checkPayload
        .get("orCheckResults")
        ?.split(",")
        .map((entry, i) => {
            return { name: orCheckConfigs[i].name, passed: entry == "1" ? true : false };
        });

    if (mintAndConditions == undefined || mintOrConditions == undefined) {
        return <>Error deserializing</>;
    }

    const orMet = mintAndConditions.reduce((acc, cond) => acc || cond.passed, false);
    const andConditionsWithOr = [...mintAndConditions, { name: "One of:", passed: orMet }];

    return (
        <div
            tw="flex flex-row w-full h-full text-[52px] p-[64px]"
            style={{ backgroundColor: "#FBCB07", color: "black" }}
        >
            <span tw="text-[68px] w-[300px] mr-[64px]">Missing Conditions...</span>
            <span tw="flex flex-col w-[708px] pl-[64px]">
                <ul tw="flex flex-col">
                    {andConditionsWithOr.map((check, i) => {
                        return (
                            <li key={i}>
                                {check.passed ? "🟢 " : "⚪️ "} {check.name}
                            </li>
                        );
                    })}
                </ul>
                <ul tw="flex flex-col pl-[64px] text-[40px]">
                    {mintOrConditions.map((check, i) => {
                        return (
                            <li key={i}>
                                {check.passed ? "🟢 " : "⚪️ "} {check.name}
                            </li>
                        );
                    })}
                </ul>
            </span>
            <img
                src={`${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/conditions-not-met-icon.png`}
                style={{ position: "absolute", bottom: 0, left: 64, width: 300 }}
            />
        </div>
    );
}

export const basedAndYellowFrameEditionOneConfig: MintConfig<any> = {
    images: {
        home: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/home.png`,
            aspectRatio: "1.91:1",
        },
        mintedOut: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/sold-out.png`,
            aspectRatio: "1.91:1",
        },
        alreadyMinted: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/already-minted.png`,
            aspectRatio: "1.91:1",
        },
        noAddress: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/no-address.png`,
            aspectRatio: "1.91:1",
        },
        successfulMint: {
            src: `${process.env.NEXT_PUBLIC_URL}/images/mint/based-and-yellow-frame-edition-one/mint-successful.png`,
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
        label: "Yellow Collective 🌕",
        redirectUrl: "https://yellowcollective.xyz",
    },
    fonts: ["pally"],
};
