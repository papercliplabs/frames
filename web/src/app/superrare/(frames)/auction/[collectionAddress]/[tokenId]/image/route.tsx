import { artworkImageResponse, errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { getAuctionData } from "@/app/superrare/data/queries/getAuctionData";
import { formatNumber } from "@/utils/format";
import { formatUnits, getAddress } from "viem";

export async function GET(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  let auctionData = await getAuctionData({
    collectionAddress: getAddress(params.collectionAddress),
    tokenId: BigInt(params.tokenId),
  });

  return auctionData
    ? artworkImageResponse({
        artwork: {
          title: auctionData.title,
          imgSrc: auctionData.imageSrc,
        },
        artist: {
          name: auctionData.creator.name,
          imgSrc: auctionData.creator.imageSrc,
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
