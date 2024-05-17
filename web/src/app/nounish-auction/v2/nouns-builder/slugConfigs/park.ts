import { basePublicClient } from "@/utils/wallet";
import { getAddress } from "viem";
import { NounsBuilderAuctionConfig } from "../configs";
import { genericResponseBackgroundBlur } from "../utils/genericResponse";

export const parkAuctionConfig: NounsBuilderAuctionConfig = {
  client: basePublicClient,
  collectionAddress: getAddress("0x72b31421a462996f559ffb7fc5dfaca94e754d89"),
  frontendUrl: "https://thepark.wtf",
  imageResponse: genericResponseBackgroundBlur({
    fontFamily: {
      title: "helvetica-neue",
      body: "helvetica-neue",
    },
    color: {
      content: { primary: "#221B1A", secondary: "#666" },
      background: "white",
    },
  }),
  transactionFlowSlug: "park-auction",
};
