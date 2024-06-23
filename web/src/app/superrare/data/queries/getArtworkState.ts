import { Address } from "viem";
import { getLimitedMintData } from "./getLimitedMintData";
import { getAuctionData } from "./getAuctionData";
import { getBuyNowData } from "./getBuyNowData";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

type ArtworkState = "fallback" | "auction" | "limited-mint" | "buy-now";

interface GetArtworkStateParams {
  collectionAddress: Address;
  tokenId?: bigint;
}

async function getArtworkStateUncached({ collectionAddress, tokenId }: GetArtworkStateParams): Promise<ArtworkState> {
  if (tokenId == undefined) {
    const limitedMintData = await getLimitedMintData({ collectionAddress });
    return limitedMintData ? "limited-mint" : "fallback";
  } else {
    const auctionData = await getAuctionData({ collectionAddress, tokenId });
    if (auctionData) {
      return "auction";
    } else {
      const buyNowData = await getBuyNowData({ collectionAddress, tokenId });
      return buyNowData ? "buy-now" : "fallback";
    }
  }
}

export const getArtworkState = customUnstableCache(getArtworkStateUncached, ["get-artwork-state"], {
  revalidate: 60 * 15,
}); // 15min
