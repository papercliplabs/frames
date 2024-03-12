import { NounishAuctionConfig } from "../configs";
import { basePublicClient, getWalletName } from "@/utils/wallet";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { NounishAuctionData } from "./common/types";
import { multicall, readContract } from "viem/actions";
import { auctionAbi } from "@/abis/beans/auction";
import { tokenAbi } from "@/abis/beans/token";
import { descriptorAbi } from "@/abis/beans/descriptor";
import { parseBase64String } from "./common/utils";
import { formatNumber, formatTimeLeft } from "@/utils/format";
import { encodeFunctionData, formatEther } from "viem";
import { paperclipIcon } from "@/utils/paperclip";
import { bigIntMax } from "@/utils/bigInt";

const AUCTION_ADDRESS = "0xE56a5C5761467888ad95E43a5B172A631C15E376";
const TOKEN_ADDRESS = "0x65EB64E86b71f8Be76b2aedacE781209Db25879D";
const CLIENT = basePublicClient;

export type BeansAuctionData = NounishAuctionData & {
    dynamicColors: {
        primary: string;
        secondary: string;
    };
};

export async function getAuctionData(): Promise<BeansAuctionData> {
    const [beanId, currentBid, startTime, endTime, currentBidder, settled] = await readContract(CLIENT, {
        address: AUCTION_ADDRESS,
        abi: auctionAbi,
        functionName: "auction",
    });

    const [tokenUri, seeds, descriptorAddress, minBidIncrement, reservePrice] = await multicall(CLIENT, {
        contracts: [
            {
                address: TOKEN_ADDRESS,
                abi: tokenAbi,
                functionName: "tokenURI",
                args: [beanId],
            },
            {
                address: TOKEN_ADDRESS,
                abi: tokenAbi,
                functionName: "seeds",
                args: [beanId],
            },
            {
                address: TOKEN_ADDRESS,
                abi: tokenAbi,
                functionName: "descriptor",
                args: [],
            },
            {
                address: AUCTION_ADDRESS,
                abi: auctionAbi,
                functionName: "minBidIncrementPercentage",
                args: [],
            },
            {
                address: AUCTION_ADDRESS,
                abi: auctionAbi,
                functionName: "reservePrice",
                args: [],
            },
        ],
        allowFailure: false,
    });

    const [classOneValue, classTwoValue] = await multicall(CLIENT, {
        contracts: [
            {
                address: descriptorAddress,
                abi: descriptorAbi,
                functionName: "classOne",
                args: [seeds[0]],
            },
            {
                address: descriptorAddress,
                abi: descriptorAbi,
                functionName: "classTwo",
                args: [seeds[1]],
            },
        ],
        allowFailure: false,
    });

    const imgSrc = parseBase64String(tokenUri).image;

    const now = Date.now() / 1000;
    const timeRemainingSec = settled ? 0 : Math.max(Number(endTime.toString()) - now, 0);
    const timeRemainingFormatted = formatTimeLeft(timeRemainingSec);
    const currentBidFormatted = formatNumber(formatEther(currentBid), 4);

    const bidder = await getWalletName({ address: currentBidder });

    // Force rounding up so we guarantee at least the min bid
    const nextBidMin = formatNumber(
        Math.ceil(
            Number(
                formatEther(bigIntMax(currentBid + (currentBid * BigInt(minBidIncrement)) / BigInt(100), reservePrice))
            ) * 1e5
        ) / 1e5,
        5
    );
    const requiresSettlement = !settled && timeRemainingSec == 0;

    return {
        nounId: Number(beanId.toString()),
        nounImgSrc: imgSrc,
        attributes: {}, // Not needed, already extracted - TODO: maybe actually seperate these fn's
        timeRemaining: timeRemainingFormatted,
        bid: currentBidFormatted,
        bidder,
        nextBidMin,
        requiresSettlement,
        dynamicColors: {
            primary: "#" + classOneValue,
            secondary: "#" + classTwoValue,
        },
    };
}

function getBidTransactionData(nounId: bigint, bidAmount: bigint): FrameTransactionResponse {
    return {
        chainId: `eip155:${CLIENT.chain?.id}`,
        method: "eth_sendTransaction",
        params: {
            abi: auctionAbi,
            to: AUCTION_ADDRESS,
            data: encodeFunctionData({
                abi: auctionAbi,
                functionName: "createBid",
                args: [nounId],
            }),
            value: bidAmount.toString(),
        },
    };
}

export function BeansAuctionStatus({
    nounId,
    nounImgSrc,
    timeRemaining,
    bid,
    bidder,
    dynamicColors,
}: BeansAuctionData) {
    const rowEntries: { name: string; value: string }[] = [
        { name: "CURRENT BID", value: bid + " ETH" },
        { name: "TIME LEFT", value: timeRemaining },
        { name: "HIGHEST BIDDER", value: bidder },
    ];

    return (
        <div
            tw="flex flex-col w-full h-full justify-center items-center w-[1200px] h-[1200px] relative bg-black"
            style={{ color: dynamicColors.primary }}
        >
            <svg viewBox="0 0 80 80" style={{ position: "absolute", left: 125.93, top: 303.69 }}>
                <circle cx="40" cy="40" r="40" fill={dynamicColors.primary} />
            </svg>
            <svg viewBox="0 0 80 80" style={{ position: "absolute", left: 991.83, top: 303.69 }}>
                <circle cx="40" cy="40" r="40" fill={dynamicColors.primary} />
            </svg>
            <svg viewBox="0 0 80 80" style={{ position: "absolute", left: 125.93, top: 429.71 }}>
                <circle cx="40" cy="40" r="40" fill={dynamicColors.secondary} />
            </svg>
            <svg viewBox="0 0 80 80" style={{ position: "absolute", left: 991.83, top: 429.71 }}>
                <circle cx="40" cy="40" r="40" fill={dynamicColors.secondary} />
            </svg>
            <img
                src={nounImgSrc ?? ""}
                width={538.59}
                height={538.6}
                alt={`#${nounId}`}
                tw="left-[330.7px] top-[100.97px] absolute rounded-[50px]"
            />
            <img
                src={`${process.env.NEXT_PUBLIC_URL}/images/nounish-auction/beans/base.png`}
                width={1200}
                height={1200}
                tw="absolute top-0 left-0"
            />
            <div tw="flex flex-col absolute left-[235px] top-[692px] w-[730px] px-[16px] py-[30px]">
                <span tw="text-white font-bold text-[65px] tracking-[3.9px] pb-[40px]" style={{ fontFamily: "druk" }}>
                    BEAN #{nounId}
                </span>

                <div tw="flex flex-col justify-start text-[34px]" style={{ fontFamily: "graphik" }}>
                    {rowEntries.map((entry, i) => (
                        <div tw="flex flex-row pb-[26px] justify-start items-center" key={i}>
                            <span tw="font-bold tracking-[1.6px] w-[370px] h-full flex items-center">{entry.name}</span>
                            <span tw="w-[378px] overflow-hidden text-white h-full flex items-center">
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <svg viewBox="0 0 36.25 36.25" style={{ position: "absolute", left: 320.23, top: 136.59 }}>
                <circle cx="18.125" cy="18.125" r="18.125" fill={dynamicColors.secondary} />
            </svg>
            <svg viewBox="0 0 80 80" style={{ position: "absolute", left: 371.78, top: 136.59 }}>
                <circle cx="18.125" cy="18.125" r="18.125" fill={dynamicColors.primary} />
            </svg>
            <svg viewBox="0 0 72 72" style={{ position: "absolute", left: 808, top: 586 }}>
                <circle cx="36" cy="36" r="36" fill={dynamicColors.primary} />
            </svg>
            <svg viewBox="0 0 55 55" style={{ position: "absolute", left: 817.13, top: 595.05 }}>
                <path
                    d="M32.175 3.0375L38.075 13.8188C38.6 14.7813 39.3937 15.575 40.3625 16.1063L51.1437 22.0063C55.1312 24.1875 55.1312 29.9125 51.1437 32.0937L40.3625 37.9937C39.4 38.5187 38.6062 39.3125 38.075 40.2813L32.175 51.0625C29.9937 55.05 24.2687 55.05 22.0875 51.0625L16.1874 40.2813C15.6624 39.3188 14.8687 38.525 13.8999 37.9937L3.11868 32.0937C-0.868823 29.9125 -0.868823 24.1875 3.11868 22.0063L13.8999 16.1063C14.8624 15.5813 15.6562 14.7875 16.1874 13.8188L22.0875 3.0375C24.2687 -0.95 29.9937 -0.95 32.175 3.0375Z"
                    fill={dynamicColors.secondary}
                />
            </svg>
            <svg viewBox="0 0 72 72" style={{ position: "absolute", left: 923, top: 586 }}>
                <circle cx="36" cy="36" r="36" fill={dynamicColors.secondary} />
            </svg>
            <svg viewBox="0 0 55 55" style={{ position: "absolute", left: 931.76, top: 595.05 }}>
                <path
                    d="M32.175 3.0375L38.075 13.8188C38.6 14.7813 39.3937 15.575 40.3625 16.1063L51.1437 22.0063C55.1312 24.1875 55.1312 29.9125 51.1437 32.0937L40.3625 37.9937C39.4 38.5187 38.6062 39.3125 38.075 40.2813L32.175 51.0625C29.9937 55.05 24.2687 55.05 22.0875 51.0625L16.1874 40.2813C15.6624 39.3188 14.8687 38.525 13.8999 37.9937L3.11868 32.0937C-0.868823 29.9125 -0.868823 24.1875 3.11868 22.0063L13.8999 16.1063C14.8624 15.5813 15.6562 14.7875 16.1874 13.8188L22.0875 3.0375C24.2687 -0.95 29.9937 -0.95 32.175 3.0375Z"
                    fill={dynamicColors.primary}
                />
            </svg>
            <svg viewBox="0 0 50 51" style={{ position: "absolute", left: 883.39, top: 746.76 }}>
                <path
                    d="M0.393799 25.4562C14.0375 25.4562 25.0937 36.5125 25.0937 50.1562C25.0937 36.5125 36.15 25.4562 49.7937 25.4562C36.15 25.4562 25.0937 14.4 25.0937 0.756287C25.0937 14.4 14.0375 25.4562 0.393799 25.4562Z"
                    fill={dynamicColors.primary}
                />
            </svg>
            {paperclipIcon}
        </div>
    );
}

export function BeansReviewBid({ bid, dynamicColors, newBidAmount }: BeansAuctionData & { newBidAmount: string }) {
    console.log(newBidAmount);
    return (
        <div tw="flex flex-col w-full h-full justify-center items-center w-[1200px] h-[1200px] p-[80px] bg-black text-white">
            <div tw="text-[65px] font-bold tracking-[3.9px]">REVIEW YOUR BID</div>
            <div tw="w-full h-[634px] border-[8px] rounded-[40px] my-[80px] flex justify-center items-center text-[100px] font-bold border-white">
                Ξ {newBidAmount}
            </div>
            <div tw="flex flex-row justify-between w-full text-[52px]">
                <span tw="font-medium">CURRENT BID</span>
                <span tw="font-bold">Ξ {bid}</span>
            </div>
            {paperclipIcon}
        </div>
    );
}

export const beansConfig: NounishAuctionConfig<BeansAuctionData> = {
    getAuctionData,
    auctionStatusComponent: BeansAuctionStatus,
    reviewBidComponent: BeansReviewBid,
    getBidTransactionData,
    auctionUrl: "https://beans.wtf",
    fonts: ["druk", "graphik"],
    transactionFlowSlug: "beans-auction",
};
