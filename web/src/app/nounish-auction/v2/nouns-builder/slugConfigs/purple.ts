import { basePublicClient } from "@/utils/wallet";
import { getAddress } from "viem";
import { NounsBuilderAuctionConfig } from "../configs";
import { genericResponseBackgroundBlur } from "../utils/genericResponse";

export const purpleAuctionConfig: NounsBuilderAuctionConfig = {
  client: basePublicClient,
  collectionAddress: getAddress("0x8de71d80ee2c4700bc9d4f8031a2504ca93f7088"),
  frontendUrl: "https://purple.construction/",
  imageResponse: genericResponseBackgroundBlur({
    fontFamily: {
      title: "londrina",
      body: "pt-root-ui",
    },
    color: {
      content: { primary: "#221B1A", secondary: "#666" },
      background: "white",
    },
  }),
  transactionFlowSlug: "purple-auction",
};
