import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { getAuctionData } from "@/app/superrare/data/queries/getAuctionData";
import { formatNumber } from "@/utils/format";
import { formatUnits, getAddress } from "viem";
import { getArtworkData } from "@/app/superrare/data/queries/getArtworkData";
import { SECONDS_PER_YEAR } from "@/utils/constants";

export async function GET(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = BigInt(params.tokenId);

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

export const maxDuration = 300; // Allow up to 5min for first fetch
