import { Address } from "viem";
import { getLimitedMintData } from "./getLimitedMintData";
import { getAuctionData } from "./getAuctionData";

type ArtworkState = "fallback" | "auction" | "limited-mint";

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
    return auctionData ? "auction" : "fallback";
  }
}
