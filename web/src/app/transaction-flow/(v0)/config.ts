import { FontType } from "@/utils/imageOptions";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { yellowCollectiveAuctionTransactionFlowConfig } from "./slugConfigs/yellowCollectiveAuction";
import { Client } from "viem";
import { beansAuctionTransactionFlowConfig } from "./slugConfigs/beansAuction";
import { nounsAuctionTransactionFlowConfig } from "./slugConfigs/nounsAuction";
import { superrareTransactionFlowConfig } from "./slugConfigs/superrare";
import { vrbsAuctionFlowConfig } from "./slugConfigs/vrbsAuction";
import { nounsBuilderAuctionGenericTransactionFlowConfig } from "./slugConfigs/nounsBuilderAuctionGeneric";
import { basePublicClient, zoraPublicClient } from "@/common/utils/walletClients";

// Put this into state to compose
export interface TransactionFlowConfig {
  client: Client;
  icons?: {
    pending?: string;
    success?: string;
    failed?: string;
  };
  style: {
    font: {
      primary: {
        type: FontType;
        color: string;
      };
      secondary: {
        type: FontType;
        color: string;
      };
    };
    backgroundColor: string;
  };
  terminalButtons: {
    success: FrameButtonMetadata;
    failed: FrameButtonMetadata;
  };
  hidePaperclipLogo?: boolean;
  deriveTerminalButtonTargetFromState?: boolean;
}

export type SupportedTransactionFlowSlug =
  | "yellow-collective-auction"
  | "beans-auction"
  | "nouns-auction"
  | "superrare"
  | "vrbs-auction"
  | "gnars-auction"
  | "africa-auction"
  | "energy-auction"
  | "purple-auction"
  | "park-auction"
  | "lil-toadz-auction"
  | "member-auction";

export const transactionFlowConfigs: Record<SupportedTransactionFlowSlug, TransactionFlowConfig> = {
  "yellow-collective-auction": yellowCollectiveAuctionTransactionFlowConfig,
  "beans-auction": beansAuctionTransactionFlowConfig,
  "nouns-auction": nounsAuctionTransactionFlowConfig,
  superrare: superrareTransactionFlowConfig,
  "vrbs-auction": vrbsAuctionFlowConfig,
  "gnars-auction": nounsBuilderAuctionGenericTransactionFlowConfig(basePublicClient, "gnars"),
  "africa-auction": nounsBuilderAuctionGenericTransactionFlowConfig(basePublicClient, "africa"),
  "purple-auction": nounsBuilderAuctionGenericTransactionFlowConfig(basePublicClient, "purple"),
  "energy-auction": nounsBuilderAuctionGenericTransactionFlowConfig(zoraPublicClient, "energy"),
  "park-auction": nounsBuilderAuctionGenericTransactionFlowConfig(basePublicClient, "park"),
  "lil-toadz-auction": nounsBuilderAuctionGenericTransactionFlowConfig(basePublicClient, "lil-toadz"),
  "member-auction": nounsBuilderAuctionGenericTransactionFlowConfig(basePublicClient, "member"),
};
