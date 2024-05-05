import { FontType } from "@/utils/imageOptions";
import { yellowCollectiveAuctionConfig } from "./slugConfigs/yellowCollective";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { SupportedTransactionFlowSlug } from "../../transaction-flow/config";
import { beansConfig } from "./slugConfigs/beans";
import { nounsAuctionConfig } from "./slugConfigs/nouns";

type GenericNounishAuctionData<Data> = { nounId: number; nextBidMin: string; requiresSettlement: boolean } & Data;

export interface NounishAuctionConfig<Data> {
  getAuctionData: () => Promise<GenericNounishAuctionData<Data>>;
  auctionStatusComponent: React.ComponentType<GenericNounishAuctionData<Data>>;
  reviewBidComponent: React.ComponentType<GenericNounishAuctionData<Data> & { newBidAmount: string }>;
  getBidTransactionData: (nounId: bigint, bidAmount: bigint) => FrameTransactionResponse;
  // getSettleTransactionData: () => FrameTransactionResponse;
  auctionUrl: string;
  fonts: FontType[];
  transactionFlowSlug: SupportedTransactionFlowSlug;
}

export type SupportedNounishAuctionSlug = "yellow-collective" | "nouns" | "beans";

export const nounishAuctionConfigs: Record<SupportedNounishAuctionSlug, NounishAuctionConfig<any>> = {
  "yellow-collective": yellowCollectiveAuctionConfig,
  nouns: nounsAuctionConfig,
  beans: beansConfig,
};
