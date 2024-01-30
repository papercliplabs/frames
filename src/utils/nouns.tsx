import { Address, PublicClient, formatEther } from "viem";
import { readContract } from "viem/actions";
import { formatNumber, formatTimeLeft } from "./format";
import { basePublicClient, getWalletName, mainnetPublicClient } from "./wallet";
import { FontType } from "./baseImg";

interface NounsDaoConfig {
    getAuctionDetails: () => Promise<AuctionDetails>;
    collectionName: string;
    backgroundColor: string;
    textColor: string;
    fontType: FontType;
}

export type SupportedNounsDao = "nouns" | "yellow" | "purple";

export const nounsDaoConfigs: Record<SupportedNounsDao, NounsDaoConfig> = {
    nouns: {
        getAuctionDetails: () =>
            getNounOgAuctionDetails({
                client: mainnetPublicClient,
                auctionAddress: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
                tokenAddress: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
            }),
        collectionName: "Noun ",
        backgroundColor: "white",
        textColor: "black",
        fontType: "pally",
    },
    yellow: {
        getAuctionDetails: () =>
            getNounBuilderAuctionDetails({
                client: basePublicClient,
                auctionAddress: "0x0aa23a7e112889c965010558803813710becf263",
                tokenAddress: "0x220e41499CF4d93a3629a5509410CBf9E6E0B109",
            }),
        collectionName: "Yellow Collective ",
        backgroundColor: "#FBCB07",
        textColor: "black",
        fontType: "pally",
    },
    purple: {
        getAuctionDetails: () =>
            getNounBuilderAuctionDetails({
                client: mainnetPublicClient,
                auctionAddress: "0x43790fe6bd46b210eb27f01306c1d3546aeb8c1b",
                tokenAddress: "0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60",
            }),
        collectionName: "Purple #",
        backgroundColor: "#7649C7",
        textColor: "white",
        fontType: "inter",
    },
};

interface GetAuctionDetailsParams {
    client: PublicClient;
    auctionAddress: Address;
    tokenAddress: Address;
}

interface AuctionDetails {
    nounId: number;
    nounImgSrc: string;
    timeRemaining: string;
    bidFormatted: string;
    bidder: string;
}

export async function getNounOgAuctionDetails({
    client,
    auctionAddress,
}: GetAuctionDetailsParams): Promise<AuctionDetails> {
    const abi = [
        {
            inputs: [],
            name: "auction",
            outputs: [
                { internalType: "uint256", name: "nounId", type: "uint256" },
                { internalType: "uint256", name: "amount", type: "uint256" },
                { internalType: "uint256", name: "startTime", type: "uint256" },
                { internalType: "uint256", name: "endTime", type: "uint256" },
                { internalType: "address payable", name: "bidder", type: "address" },
                { internalType: "bool", name: "settled", type: "bool" },
            ],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    const [nounId, currentBid, startTime, endTime, currentBidder, settled] = await readContract(client, {
        address: auctionAddress,
        abi,
        functionName: "auction",
    });

    const now = Date.now() / 1000;
    const timeRemainingFormatter = formatTimeLeft(settled ? 0 : Number(endTime.toString()) - now);
    const currentBidFormatted = formatNumber(formatEther(currentBid), 4);

    const bidder = await getWalletName({ address: currentBidder });

    return {
        nounId: Number(nounId.toString()),
        nounImgSrc: `https://noun.pics/${nounId}`,
        timeRemaining: timeRemainingFormatter,
        bidFormatted: currentBidFormatted,
        bidder,
    };
}

// builder folks decided to change the contract interfaces...
export async function getNounBuilderAuctionDetails({
    client,
    auctionAddress,
    tokenAddress,
}: GetAuctionDetailsParams): Promise<AuctionDetails> {
    const auctionAbi = [
        {
            inputs: [],
            name: "auction",
            outputs: [
                { internalType: "uint256", name: "nounId", type: "uint256" },
                { internalType: "uint256", name: "hightestBid", type: "uint256" },
                { internalType: "address", name: "highestBidder", type: "address" },
                { internalType: "uint256", name: "startTime", type: "uint256" },
                { internalType: "uint256", name: "endTime", type: "uint256" },
                { internalType: "bool", name: "settled", type: "bool" },
            ],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    const tokenAbi = [
        {
            inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
            name: "tokenURI",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    const [nounId, currentBid, currentBidder, startTime, endTime, settled] = await readContract(client, {
        address: auctionAddress,
        abi: auctionAbi,
        functionName: "auction",
    });

    const tokenUri = await readContract(client, {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "tokenURI",
        args: [nounId],
    });

    const parseBase64String = (val: string) => {
        const clean: string = val?.substring(29);
        const json = Buffer.from(clean, "base64").toString();
        return JSON.parse(json);
    };
    const imgSrc = parseBase64String(tokenUri).image;

    const now = Date.now() / 1000;
    const timeRemainingFormatter = formatTimeLeft(settled ? 0 : Number(endTime.toString()) - now);
    const currentBidFormatted = formatNumber(formatEther(currentBid), 4);

    const bidder = await getWalletName({ address: currentBidder });

    return {
        nounId: Number(nounId.toString()),
        nounImgSrc: imgSrc,
        timeRemaining: timeRemainingFormatter,
        bidFormatted: currentBidFormatted,
        bidder,
    };
}
