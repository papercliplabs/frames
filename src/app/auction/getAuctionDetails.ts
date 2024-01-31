import { Address, PublicClient, formatEther } from "viem";
import { readContract } from "viem/actions";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { NounsDaoType } from "./daoConfig";
import { getWalletName } from "@/utils/wallet";
import { formatNumber, formatTimeLeft } from "@/utils/format";

const { palette } = ImageData; // Used with `buildSVG``

interface AuctionDetails {
    nounId: number;
    nounImgSrc: string;
    timeRemaining: string;
    bidFormatted: string;
    bidder: string;
}

interface GetAuctionDetailsParams {
    client: PublicClient;
    auctionAddress: Address;
    tokenAddress: Address;
}

export async function getAuctionDetails(
    params: GetAuctionDetailsParams & { type: NounsDaoType }
): Promise<AuctionDetails> {
    switch (params.type) {
        default:
            console.error("getAuctionDetails: unsupported type - ", params.type);
        case "originalNouns":
            return await getNounOgAuctionDetails(params);
        case "nounsBuilder":
            return await getNounBuilderAuctionDetails(params);
    }
}

async function getNounOgAuctionDetails({
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

    const tokenAbi = [
        {
            inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            name: "seeds",
            outputs: [
                { internalType: "uint48", name: "background", type: "uint48" },
                { internalType: "uint48", name: "body", type: "uint48" },
                { internalType: "uint48", name: "accessory", type: "uint48" },
                { internalType: "uint48", name: "head", type: "uint48" },
                { internalType: "uint48", name: "glasses", type: "uint48" },
            ],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    const [nounId, currentBid, startTime, endTime, currentBidder, settled] = await readContract(client, {
        address: auctionAddress,
        abi: auctionAbi,
        functionName: "auction",
    });

    const [background, body, accessory, head, glasses] = await readContract(client, {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "seeds",
        args: [nounId],
    });

    const { parts, background: bg } = getNounData({ background, body, accessory, head, glasses });
    const svgBinary = buildSVG(parts, palette, bg);
    const svgBase64 = btoa(svgBinary);

    const now = Date.now() / 1000;
    const timeRemainingFormatter = formatTimeLeft(settled ? 0 : Math.max(Number(endTime.toString()) - now, 0));
    const currentBidFormatted = formatNumber(formatEther(currentBid), 4);

    const bidder = await getWalletName({ address: currentBidder });

    return {
        nounId: Number(nounId.toString()),
        nounImgSrc: `data:image/svg+xml;base64,${svgBase64}`,
        timeRemaining: timeRemainingFormatter,
        bidFormatted: currentBidFormatted,
        bidder,
    };
}

// builder folks decided to change the contract interfaces...
async function getNounBuilderAuctionDetails({
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
    const timeRemainingFormatter = formatTimeLeft(settled ? 0 : Math.max(Number(endTime.toString()) - now, 0));
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
