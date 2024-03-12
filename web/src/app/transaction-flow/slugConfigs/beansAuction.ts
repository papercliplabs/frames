import { basePublicClient, mainnetPublicClient } from "@/utils/wallet";
import { TransactionFlowConfig } from "../config";

export const beansAuctionTransactionFlowConfig: TransactionFlowConfig = {
    client: basePublicClient,
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
            target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/beans`,
        },
        failed: {
            label: "Try Again",
            action: "post",
            target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/beans`,
        },
    },
};
