import { mainnetPublicClient } from "@/common/utils/walletClients";
import { TransactionFlowConfig } from "../config";

export const nounsAuctionTransactionFlowConfig: TransactionFlowConfig = {
  client: mainnetPublicClient,
  style: {
    font: {
      primary: {
        type: "londrina",
        color: "black",
      },
      secondary: {
        type: "pt-root-ui",
        color: "black",
      },
    },
    backgroundColor: "white",
  },
  terminalButtons: {
    success: {
      label: "Back to auction",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v2/nouns`,
    },
    failed: {
      label: "Try Again",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v2/nouns`,
    },
  },
};
