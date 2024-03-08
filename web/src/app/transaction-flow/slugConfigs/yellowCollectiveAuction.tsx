import { basePublicClient, mainnetPublicClient } from "@/utils/wallet";
import { TransactionFlowConfig } from "../config";

export const yellowCollectiveAuctionTransactionFlowConfig: TransactionFlowConfig = {
    client: basePublicClient,
    style: {
        font: {
            primary: {
                type: "pally",
                color: "#212529",
            },
            secondary: {
                type: "pally",
                color: "rgba(33, 37, 41, 0.70)",
            },
        },
        backgroundColor: "#FBcB07",
    },
    terminalButtons: {
        success: {
            label: "Back to auction",
            action: "post",
            target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/yellow-collective`,
        },
        failed: {
            label: "Try Again",
            action: "post",
            target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/yellow-collective`,
        },
    },
};
