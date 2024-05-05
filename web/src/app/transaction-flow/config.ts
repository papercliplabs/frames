import { FontType } from "@/utils/imageOptions";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { yellowCollectiveAuctionTransactionFlowConfig } from "./slugConfigs/yellowCollectiveAuction";
import { Client } from "viem";
import { beansAuctionTransactionFlowConfig } from "./slugConfigs/beansAuction";
import { nounsAuctionTransactionFlowConfig } from "./slugConfigs/nounsAuction";
import { superrareTransactionFlowConfig } from "./slugConfigs/superrare";
import { vrbsAuctionFlowConfig } from "./slugConfigs/vrbsAuction";

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
  | "vrbs-auction";

export const transactionFlowConfigs: Record<SupportedTransactionFlowSlug, TransactionFlowConfig> = {
  "yellow-collective-auction": yellowCollectiveAuctionTransactionFlowConfig,
  "beans-auction": beansAuctionTransactionFlowConfig,
  "nouns-auction": nounsAuctionTransactionFlowConfig,
  superrare: superrareTransactionFlowConfig,
  "vrbs-auction": vrbsAuctionFlowConfig,
};
