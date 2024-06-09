import { baseSepoliaPublicClient, sepoliaPublicClient } from "@/common/utils/walletClients";
import { TransactionFlowConfig } from "../config";

export const testTransactionFlowConfig: TransactionFlowConfig = {
  client: baseSepoliaPublicClient,
  style: {
    font: {
      primary: {
        type: "druk",
        color: "white",
      },
      secondary: {
        type: "graphik",
        color: "white",
      },
    },
    backgroundColor: "black",
  },
  terminalButtons: {
    success: {
      label: "Back to auction",
      action: "post",
      target: "",
    },
    failed: {
      label: "Try Again",
      action: "post",
      target: "",
    },
  },
  deriveTerminalButtonTargetFromState: true,
};
