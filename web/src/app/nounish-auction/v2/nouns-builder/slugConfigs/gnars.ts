import { basePublicClient } from "@/common/utils/walletClients";
import { getAddress } from "viem";
import { NounsBuilderAuctionConfig } from "../configs";
import { genericResponseExtrude } from "../utils/genericResponse";

export const gnarsAuctionConfig: NounsBuilderAuctionConfig = {
  client: basePublicClient,
  collectionAddress: getAddress("0x880fb3cf5c6cc2d7dfc13a993e839a9411200c17"),
  frontendUrl: "https://www.gnars.wtf",
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
  transactionFlowSlug: "gnars-auction",
};
