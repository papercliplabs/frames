import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { NounishAuctionConfig } from "../configs";
import {
  Colors,
  NounAuctionStatus,
  NounReviewBid,
  OgNounsAuctionData,
  getNounsBidTransactionData,
  getOgNounsAuctionData,
} from "./common/ogNouns";
import { mainnetPublicClient } from "@/common/utils/walletClients";

type PermittedBackgroundAttribute = "0" | "1";

const AUCTION_ADDRESS = "0x830BD73E4184ceF73443C15111a1DF14e495C706";
const TOKEN_ADDRESS = "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03";
const CLIENT = mainnetPublicClient;

const COLORS_FOR_BACKGROUND_ATTRIBUTE: Record<PermittedBackgroundAttribute, Colors> = {
  "0": { background: "#d5d7e1", primary: "#151c3b", secondary: "#79809c" },
  "1": { background: "#e1d7d5", primary: "#221b1a", secondary: "#8F7E7C" },
};

async function getAuctionData(): Promise<OgNounsAuctionData> {
  const data = await getOgNounsAuctionData({
    client: CLIENT,
    auctionAddress: AUCTION_ADDRESS,
    tokenAddress: TOKEN_ADDRESS,
  });

  const backgroundAttribute = data.attributes["background"];

  const colors = COLORS_FOR_BACKGROUND_ATTRIBUTE[backgroundAttribute as PermittedBackgroundAttribute];
  if (!colors) {
    throw Error(`No colors found for background attribute=${backgroundAttribute}`);
  }

  return {
    ...data,
    namePrefix: "Noun ",
    colors,
  };
}

function getBidTransactionData(nounId: bigint, bidAmount: bigint): FrameTransactionResponse {
  return getNounsBidTransactionData({
    client: CLIENT,
    auctionAddress: AUCTION_ADDRESS,
    tokenAddress: TOKEN_ADDRESS,
    nounId,
    bidAmount,
  });
}

export const nounsAuctionConfig: NounishAuctionConfig<OgNounsAuctionData> = {
  getAuctionData,
  auctionStatusComponent: NounAuctionStatus,
  reviewBidComponent: NounReviewBid,
  getBidTransactionData,
  auctionUrl: "https://nouns.wtf",
  fonts: ["londrina", "pt-root-ui"],
  transactionFlowSlug: "nouns-auction",
};
