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

const AUCTION_ADDRESS = "0xd0bc249ec45a767075bdde2523f8c4febfeafc00";
const TOKEN_ADDRESS = "0x145d46bf67ab4fadaebf7f8040b43875f95794c4";
const METADATA_ADDRESS = "0xce43cf80dd585f9e7981d66442c0edf0937b5574";
const CLIENT = basePublicClient;
const COLORS_FOR_BACKGROUND_ATTRIBUTE: Record<PermittedBackgroundAttribute, ColorConfig> = {
  based: {
    background: { primary: "#DCE5FE", secondary: "#FBcB07" },
    text: { primary: "#212529", secondary: "#212529" },
  },
  yellow: {
    background: { primary: "#FCF0DB", secondary: "#FBcB07" },
    text: { primary: "#212529", secondary: "#212529" },
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

  const colors = COLORS_FOR_BACKGROUND_ATTRIBUTE["based"];
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

export const baseTestConfig: NounishAuctionConfig<NounsBuilderAuctionData> = {
  getAuctionData,
  auctionStatusComponent: NounBuilderAuctionStatus,
  reviewBidComponent: NounBuilderReviewBid,
  getBidTransactionData,
  // getSettleTransactionData,
  auctionUrl: "https://nouns.wtf",
  fonts: ["pally", "pt-root-ui"],
  transactionFlowSlug: "yellow-collective-auction",
};
