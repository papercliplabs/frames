import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { getLimitedMintData } from "@/app/superrare/data/queries/getLimitedMintData";
import { formatNumber } from "@/utils/format";
import { getAddress, formatUnits } from "viem";
import { getArtworkData } from "@/app/superrare/data/queries/getArtworkData";

export async function GET(req: Request, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);

  const limitedMintData = await getLimitedMintData({
    collectionAddress: collectionAddress,
  });

  if (!limitedMintData) {
    return errorImageResponse();
  }

  const artworkData = await getArtworkData({ collectionAddress, tokenId: limitedMintData.tokenId });

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
        tag: {
          active: BigInt(limitedMintData.currentSupply) < BigInt(limitedMintData.maxSupply),
          content: `${limitedMintData.currentSupply.toString()} / ${limitedMintData.maxSupply.toString()} Minted`,
        },
        extra: {
          title: "Price",
          content: `${formatNumber(formatUnits(BigInt(limitedMintData.price), limitedMintData.currency.decimals), 4)} ${limitedMintData.currency.symbol}`,
        },
      })
    : errorImageResponse();
}

export const maxDuration = 300; // Allow up to 5min for first fetch
