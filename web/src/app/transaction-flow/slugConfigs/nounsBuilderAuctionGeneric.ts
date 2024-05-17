import { basePublicClient } from "@/utils/wallet";
import { TransactionFlowConfig } from "../config";
import { Client } from "viem";
import { SupportedNounsBuilderDao } from "@/app/nounish-auction/v2/nouns-builder/configs";

export function nounsBuilderAuctionGenericTransactionFlowConfig(
  client: Client,
  auctionSlug: SupportedNounsBuilderDao
): TransactionFlowConfig {
  return {
    client: client,
    style: {
      font: {
        primary: {
          type: "londrina",
          color: "#221B1A",
        },
        secondary: {
          type: "pt-root-ui",
          color: "#666666",
        },
      },
      backgroundColor: "white",
    },
    terminalButtons: {
      success: {
        label: "Back to auction",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v2/nouns-builder/${auctionSlug}`,
      },
      failed: {
        label: "Try Again",
        action: "post",
        target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v2/nouns-builder/${auctionSlug}`,
      },
    },
  };
}
