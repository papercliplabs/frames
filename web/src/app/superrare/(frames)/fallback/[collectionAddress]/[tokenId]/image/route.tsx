import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { getArtworkData } from "@/app/superrare/data/queries/getArtworkData";
import { getAddress } from "viem";
import { SECONDS_PER_YEAR } from "@/utils/constants";

export async function GET(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  let artworkData = await getArtworkData({
    collectionAddress: getAddress(params.collectionAddress),
    tokenId: BigInt(params.tokenId),
  });

  return artworkData
    ? artworkImageResponse({
        imageCacheMaxAgeS: SECONDS_PER_YEAR, // This image is not dynamic, don't need to cache
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

export const maxDuration = 300; // Allow up to 5min for first fetch
