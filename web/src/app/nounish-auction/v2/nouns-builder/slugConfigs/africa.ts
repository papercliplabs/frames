import { basePublicClient } from "@/common/utils/walletClients";
import { getAddress } from "viem";
import { NounsBuilderAuctionConfig } from "../configs";
import { genericResponseExtrude } from "../utils/genericResponse";

export const africaAuctionConfig: NounsBuilderAuctionConfig = {
  client: basePublicClient,
  collectionAddress: getAddress("0x614d7503a44e6fd67997f9945bb32d02e8c19431"),
  frontendUrl: "https://nouns.build/dao/base/0x614d7503a44e6fd67997f9945bb32d02e8c19431/86?tab=contracts",
  imageResponse: genericResponseExtrude({
    fontFamily: {
      title: "londrina",
      body: "pt-root-ui",
    },
    color: {
      content: { primary: "#221B1A", secondary: "#666" },
      background: "white",
    },
  }),
  transactionFlowSlug: "africa-auction",
};
