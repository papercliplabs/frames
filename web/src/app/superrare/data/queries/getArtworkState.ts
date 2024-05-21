import { Address } from "viem";
import { getLimitedMintData } from "./getLimitedMintData";
import { getAuctionData } from "./getAuctionData";
import { getBuyNowData } from "./getBuyNowData";

type ArtworkState = "fallback" | "auction" | "limited-mint" | "buy-now";

interface GetArtworkStateParams {
  collectionAddress: Address;
  tokenId?: bigint;
}

export async function getArtworkState({ collectionAddress, tokenId }: GetArtworkStateParams): Promise<ArtworkState> {
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
