import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { formatNumber } from "@/utils/format";
import { Address, formatUnits } from "viem";
import { getArtworkData } from "@/app/superrare/data/queries/getArtworkData";
import { getBuyNowData } from "@/app/superrare/data/queries/getBuyNowData";

export async function buyNowImage(collectionAddress: Address, tokenId: bigint) {
  const [artworkData, buyNowData] = await Promise.all([
    getArtworkData({ collectionAddress, tokenId }),
    getBuyNowData({
      collectionAddress,
      tokenId,
    }),
  ]);

  return artworkData && buyNowData
    ? artworkImageResponse({
        artwork: {
          title: artworkData.title,
          imgSrc: artworkData.imageSrc,
        },
        artist: {
          name: artworkData.creator.name,
          imgSrc: artworkData.creator.imageSrc,
        },
        extra: {
          title: "List price",
          content: `${formatNumber(formatUnits(buyNowData.price, buyNowData.currency.decimals), 4)} ${buyNowData.currency.symbol}`,
        },
      })
    : errorImageResponse();
}
