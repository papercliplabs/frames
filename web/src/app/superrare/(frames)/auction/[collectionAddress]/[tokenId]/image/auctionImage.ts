import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { getAuctionData } from "@/app/superrare/data/queries/getAuctionData";
import { formatNumber } from "@/utils/format";
import { Address, formatUnits } from "viem";
import { getArtworkData } from "@/app/superrare/data/queries/getArtworkData";

export async function auctionImage(collectionAddress: Address, tokenId: bigint) {
  const [artworkData, auctionData] = await Promise.all([
    getArtworkData({ collectionAddress, tokenId }),
    getAuctionData({
      collectionAddress,
      tokenId,
    }),
  ]);

  return artworkData && auctionData
    ? artworkImageResponse({
        artwork: {
          title: artworkData.title,
          imgSrc: artworkData.imageSrc,
        },
        artist: {
          name: artworkData.creator.name,
          imgSrc: artworkData.creator.imageSrc,
        },
        tag: {
          active: true,
          content: auctionData.timeRemainingFormatted,
        },
        extra: {
          title: "Current Bid",
          content: `${formatNumber(formatUnits(auctionData.highestBid, auctionData.currency.decimals), 4)} ${auctionData.currency.symbol}`,
        },
      })
    : errorImageResponse();
}
