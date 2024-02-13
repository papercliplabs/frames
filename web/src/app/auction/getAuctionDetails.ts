import { Address, PublicClient, formatEther } from "viem";
import { readContract } from "viem/actions";
import { ImageData, getNounData } from "@nouns/assets";
import { buildSVG } from "@nouns/sdk";
import { getWalletName } from "@/utils/wallet";
import { formatNumber, formatTimeLeft } from "@/utils/format";

const { palette } = ImageData; // Used with `buildSVG``

const parseBase64String = (val: string) => {
    const clean: string = val?.substring(29);
    const json = Buffer.from(clean, "base64").toString();
    return JSON.parse(json);
};

export interface GetAuctionDetailsParams {
    client: PublicClient;
    auctionAddress: Address;
    tokenAddress: Address;
}

export interface AuctionDetails {
    nounId: number;
    nounImgSrc: string;
    timeRemaining: string;
    bidFormatted: string;
    bidder: string;
    dynamicTextColor?: string;
}

export async function getNounOgAuctionDetails({
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

export async function getBeansDaoAuctionDetails({
    client,
    auctionAddress,
    tokenAddress,
}: GetAuctionDetailsParams): Promise<AuctionDetails> {
    const auctionAbi = [
        {
            inputs: [],
            name: "auction",
            outputs: [
                { internalType: "uint256", name: "beanId", type: "uint256" },
                { internalType: "uint256", name: "amount", type: "uint256" },
                { internalType: "uint256", name: "startTime", type: "uint256" },
                { internalType: "uint256", name: "endTime", type: "uint256" },
                { internalType: "address", name: "bidder", type: "address" },
                { internalType: "bool", name: "settled", type: "bool" },
            ],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    const tokenAbi = [
        {
            inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
            name: "tokenURI",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
            name: "seeds",
            outputs: [
                { internalType: "uint256", name: "classOne", type: "uint256" },
                { internalType: "uint256", name: "classTwo", type: "uint256" },
                { internalType: "uint256", name: "size", type: "uint256" },
                { internalType: "uint256", name: "helmetLib", type: "uint256" },
                { internalType: "uint256", name: "helmet", type: "uint256" },
                { internalType: "uint256", name: "gearLib", type: "uint256" },
                { internalType: "uint256", name: "gear", type: "uint256" },
                { internalType: "uint256", name: "vibe", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "descriptor",
            outputs: [{ internalType: "address", name: "descriptor", type: "address" }],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    const descriptorAbi = [
        {
            inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
            name: "classOne",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    const [beanId, currentBid, startTime, endTime, currentBidder, settled] = await readContract(client, {
        address: auctionAddress,
        abi: auctionAbi,
        functionName: "auction",
    });

    const tokenUri = await readContract(client, {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "tokenURI",
        args: [beanId],
    });

    const [classOne] = await readContract(client, {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "seeds",
        args: [beanId],
    });

    const descriptorAddress = await readContract(client, {
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "descriptor",
        args: [],
    });

    const highlightColor = await readContract(client, {
        address: descriptorAddress,
        abi: descriptorAbi,
        functionName: "classOne",
        args: [classOne],
    });

    const imgSrc = parseBase64String(tokenUri).image;

    const now = Date.now() / 1000;
    const timeRemainingFormatter = formatTimeLeft(settled ? 0 : Math.max(Number(endTime.toString()) - now, 0));
    const currentBidFormatted = formatNumber(formatEther(currentBid), 4);

    const bidder = await getWalletName({ address: currentBidder });

    return {
        nounId: Number(beanId.toString()),
        nounImgSrc: imgSrc,
        timeRemaining: timeRemainingFormatter,
        bidFormatted: currentBidFormatted,
        bidder,
        dynamicTextColor: `#${highlightColor}`,
    };
}
