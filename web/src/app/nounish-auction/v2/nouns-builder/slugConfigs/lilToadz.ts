import { basePublicClient } from "@/common/utils/walletClients";
import { getAddress } from "viem";
import { NounsBuilderAuctionConfig } from "../configs";
import { genericResponseBackgroundBlur, genericResponseExtrude } from "../utils/genericResponse";

export const lilToadzAuctionConfig: NounsBuilderAuctionConfig = {
  client: basePublicClient,
  collectionAddress: getAddress("0x87175107412c57a2dde6f3f82cab6ec19295efc3"),
  frontendUrl: "http://liltoadz.com/",
  imageResponse: genericResponseExtrude({
    fontFamily: {
      title: "roboto",
      body: "roboto",
    },
    color: {
      content: { primary: "white", secondary: "#A3A3A3" },
      background: "0x121212",
    },
  }),
  transactionFlowSlug: "lil-toadz-auction",
};
