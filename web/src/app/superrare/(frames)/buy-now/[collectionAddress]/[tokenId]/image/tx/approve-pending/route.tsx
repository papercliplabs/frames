import { errorImageResponse, overlayedArtworkImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { formatNumber } from "@/utils/format";
import { formatUnits, getAddress } from "viem";
import { getArtworkData } from "@/app/superrare/data/queries/getArtworkData";
import { getBuyNowData } from "@/app/superrare/data/queries/getBuyNowData";
import { localImageUrl } from "@/utils/urlHelpers";

export async function GET(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId: bigint } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = BigInt(params.tokenId);
  const artworkData = await getArtworkData({ collectionAddress, tokenId });

  return artworkData
    ? overlayedArtworkImageResponse({
        artwork: {
          title: artworkData.title,
          imgSrc: artworkData.imageSrc,
        },
        artist: {
          name: artworkData.creator.name,
          imgSrc: artworkData.creator.imageSrc,
        },

        overlaySrc: localImageUrl("/superrare/transaction/approve-pending-overlay.png"),
      })
    : errorImageResponse();
}

export const maxDuration = 300; // Allow up to 5min for first fetch
