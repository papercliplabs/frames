import { basePublicClient } from "@/utils/wallet";
import { TransactionFlowConfig } from "../config";

export const vrbsAuctionFlowConfig: TransactionFlowConfig = {
  client: basePublicClient,
  hidePaperclipLogo: true,
  style: {
    font: {
      primary: {
        type: "roboto",
        color: "#221B1A",
      },
      secondary: {
        type: "roboto",
        color: "#71717A",
      },
    },
    backgroundColor: "#F6F3EF",
  },
  terminalButtons: {
    success: {
      label: "Back to auction",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v2/vrbs`,
    },
    failed: {
      label: "Try Again",
      action: "post",
      target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v2/vrbs`,
    },
  },
};
