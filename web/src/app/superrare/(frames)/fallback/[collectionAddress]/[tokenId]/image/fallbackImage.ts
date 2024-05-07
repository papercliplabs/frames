import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { getArtworkData } from "@/app/superrare/data/queries/getArtworkData";
import { Address } from "viem";

export async function fallbackImage(collectionAddress: Address, tokenId: bigint) {
  let artworkData = await getArtworkData({
    collectionAddress: collectionAddress,
    tokenId: tokenId,
  });

  return artworkData
    ? artworkImageResponse({
        imageCacheMaxAgeS: 900, // Refetch this image every 15min, only dynamic on a state change
        artwork: {
          title: artworkData.title,
          imgSrc: artworkData.imageSrc,
        },
        artist: {
          name: artworkData.creator.name,
          imgSrc: artworkData.creator.imageSrc,
        },
      })
    : errorImageResponse();
}
