import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { getArtworkData } from "@/app/superrare/data/queries/getArtworkData";
import { getAddress } from "viem";

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
