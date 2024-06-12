import { zoraPublicClient } from "@/common/utils/walletClients";
import { getAddress } from "viem";
import { NounsBuilderAuctionConfig } from "../configs";
import { genericResponseBackgroundBlur } from "../utils/genericResponse";

export const energyAuctionConfig: NounsBuilderAuctionConfig = {
  client: zoraPublicClient,
  collectionAddress: getAddress("0x32297b7416294b1acf404b6148a3c58107ba8afd"),
  frontendUrl: "https://nouns.build/dao/zora/0x32297b7416294b1acf404b6148a3c58107ba8afd",
  imageResponse: genericResponseBackgroundBlur({
    fontFamily: {
      title: "arial-narrow",
      body: "arial-narrow",
    },
    color: {
      content: { primary: "#221B1A", secondary: "#666" },
      background: "white",
    },
  }),
  transactionFlowSlug: "energy-auction",
};
