import { FontType } from "@/utils/imageOptions";
import { yellowCollectiveAuctionConfig } from "./slugConfigs/yellowCollective";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { baseTestConfig } from "./slugConfigs/baseTest";
import { SupportedTransactionFlowSlug } from "../transaction-flow/config";
import { beansConfig } from "./slugConfigs/beans";

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

export type SupportedNounishAuctionSlug = "yellow-collective" | "base-test" | "beans";

export const nounishAuctionConfigs: Record<SupportedNounishAuctionSlug, NounishAuctionConfig<any>> = {
  "yellow-collective": yellowCollectiveAuctionConfig,
  "base-test": baseTestConfig,
  beans: beansConfig,
};
