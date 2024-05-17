import { basePublicClient } from "@/utils/wallet";
import { getAddress } from "viem";
import { NounsBuilderAuctionConfig } from "../configs";
import { genericResponseBackgroundBlur, genericResponseExtrude } from "../utils/genericResponse";

export const memberAuctionConfig: NounsBuilderAuctionConfig = {
  client: basePublicClient,
  collectionAddress: getAddress("0xFBfe187b444798214Dd4BbfAdE369F8DC3864C6a"),
  frontendUrl: "https://member.clinic",
  imageResponse: genericResponseBackgroundBlur({
    fontFamily: {
      title: "helvetica-neue",
      body: "roboto",
    },
    color: {
      content: { primary: "#030711", secondary: "#6B7280" },
      background: "white",
    },
  }),
  transactionFlowSlug: "member-auction",
};
