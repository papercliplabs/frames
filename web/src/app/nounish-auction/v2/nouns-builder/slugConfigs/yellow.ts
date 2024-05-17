import { basePublicClient } from "@/utils/wallet";
import { getAddress } from "viem";
import { NounsBuilderAuctionConfig } from "../configs";
import { genericResponseExtrude } from "../utils/genericResponse";

export const yellowCollectiveAuctionConfig: NounsBuilderAuctionConfig = {
  client: basePublicClient,
  collectionAddress: getAddress("0x220e41499CF4d93a3629a5509410CBf9E6E0B109"),
  frontendUrl: "https://www.yellowcollective.xyz",
  imageResponse: genericResponseExtrude({
    fontFamily: {
      title: "pally",
      body: "pt-root-ui",
    },
    color: {
      content: { primary: "#212529", secondary: "rgba(33, 37, 41, 0.70)" },
      background: "#FBcB07",
    },
  }),
  transactionFlowSlug: "yellow-collective-auction",
};
