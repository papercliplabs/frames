import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { getLimitedMintData } from "@/app/superrare/data/queries/getLimitedMintData";
import { formatNumber } from "@/utils/format";
import { getAddress, formatUnits } from "viem";

export async function GET(req: Request, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  const limitedMintData = await getLimitedMintData({
    collectionAddress: getAddress(params.collectionAddress),
  });

  return limitedMintData
    ? artworkImageResponse({
        artwork: {
          title: limitedMintData.title,
          imgSrc: limitedMintData.imageSrc,
        },
        artist: {
          name: limitedMintData.creator.name,
          imgSrc: limitedMintData.creator.imageSrc,
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
