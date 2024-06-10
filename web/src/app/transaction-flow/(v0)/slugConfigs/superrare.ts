import { TransactionFlowConfig } from "../config";
import { localImageUrl } from "@/utils/urlHelpers";
import { SUPERRARE_CHAIN_CONFIG } from "@/app/superrare/config";

export const superrareTransactionFlowConfig: TransactionFlowConfig = {
  client: SUPERRARE_CHAIN_CONFIG.client,
  hidePaperclipLogo: true,
  icons: {
    success: localImageUrl("/superrare/tx-success.png"),
    failed: localImageUrl("/superrare/tx-fail.png"),
    pending: localImageUrl("/superrare/tx-pending.png"),
  },
  style: {
    font: {
      primary: {
        type: "inter",
        color: "white",
      },
      secondary: {
        type: "inter",
        color: "#A0A0A0",
      },
    },
    backgroundColor: "#191919",
  },
  terminalButtons: {
    success: {
      label: "Done",
      action: "post",
      target: "",
    },
    failed: {
      label: "Try again",
      action: "post",
      target: "",
    },
  },
  deriveTerminalButtonTargetFromState: true,
};
