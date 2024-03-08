import { NounishAuctionConfig } from "../configs";
import {
    NounBuilderAuctionStatus,
    NounBuilderReviewBid,
    NounsBuilderAuctionData,
    getNounBuilderAuctionData,
    getNounsBuilderBidTransactionData,
    getNounsBuilderSettleTransactionData,
} from "./common/nounsBuilder";
import { basePublicClient } from "@/utils/wallet";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { ColorConfig } from "./common/types";

type PermittedBackgroundAttribute = "based" | "yellow";

const AUCTION_ADDRESS = "0x0aa23a7e112889c965010558803813710becf263";
const TOKEN_ADDRESS = "0x220e41499CF4d93a3629a5509410CBf9E6E0B109";
const METADATA_ADDRESS = "0x10907e788Ad02A81beF81e4Ae560664cED3b0818";
const CLIENT = basePublicClient;
const COLORS_FOR_BACKGROUND_ATTRIBUTE: Record<PermittedBackgroundAttribute, ColorConfig> = {
    based: {
        background: { primary: "#DCE5FE", secondary: "#FBcB07" },
        text: { primary: "#212529", secondary: "rgba(33, 37, 41, 0.70)" },
    },
    yellow: {
        background: { primary: "#FCF0DB", secondary: "#FBcB07" },
        text: { primary: "#212529", secondary: "rgba(33, 37, 41, 0.70)" },
    },
};

async function getAuctionData(): Promise<NounsBuilderAuctionData> {
    const data = await getNounBuilderAuctionData({
        client: CLIENT,
        auctionAddress: AUCTION_ADDRESS,
        tokenAddress: TOKEN_ADDRESS,
        metadataAddress: METADATA_ADDRESS,
    });

    const backgroundAttribute = data.attributes["0-backgrounds"];

    const colors = COLORS_FOR_BACKGROUND_ATTRIBUTE[backgroundAttribute as PermittedBackgroundAttribute];
    if (!colors) {
        throw Error(`No colors found for background attribute=${backgroundAttribute}`);
    }

    return {
        ...data,
        namePrefix: "Collective Noun #",
        colors,
    };
}

function getBidTransactionData(nounId: bigint, bidAmount: bigint): FrameTransactionResponse {
    return getNounsBuilderBidTransactionData({
        client: CLIENT,
        auctionAddress: AUCTION_ADDRESS,
        tokenAddress: TOKEN_ADDRESS,
        nounId,
        bidAmount,
    });
}

function getSettleTransactionData(): FrameTransactionResponse {
    return getNounsBuilderSettleTransactionData({
        client: CLIENT,
        auctionAddress: AUCTION_ADDRESS,
        tokenAddress: TOKEN_ADDRESS,
    });
}

export const yellowCollectiveAuctionConfig: NounishAuctionConfig<NounsBuilderAuctionData> = {
    getAuctionData,
    auctionStatusComponent: NounBuilderAuctionStatus,
    reviewBidComponent: NounBuilderReviewBid,
    getBidTransactionData,
    getSettleTransactionData,
    auctionUrl: "https://nouns.wtf",
    fonts: ["pally", "pt-root-ui"],
    transactionFlowSlug: "yellow-collective-auction",
};
