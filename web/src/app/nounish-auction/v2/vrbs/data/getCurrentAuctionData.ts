"use server";
import { cachedReadContract } from "@/utils/caching";
import { unstable_cache } from "next/cache";
import { vrbsPublicClient } from "../utils/client";
import { vrbsAuctionHouseContract } from "../contracts/vrbsAuctionHouse";
import { vrbsRevolutionTokenContract } from "../contracts/vrbsRevolutionToken";
import { readContract } from "viem/actions";
import { bigIntMax, bigIntMin } from "@/utils/bigInt";
import { formatTimeLeft } from "@/utils/format";
import { User, getUser } from "./getUser";
import "@/utils/bigIntPolyfill";

interface AuctionData {
  tokenId: bigint;

  artworkImageSrc: string;

  artist: User;

  highestBidder: User;
  highestBid: bigint;

  nextMinBid: bigint;

  endTime: bigint;
  timeRemainingFormatted: string;
}

export async function getCurrentAuctionData(): Promise<AuctionData> {
  const [[tokenId, highestBid, , endTime, highestBidderAddress], minBidIncrementPercentage, reservePrice] =
    await Promise.all([
      readContract(vrbsPublicClient, {
        ...vrbsAuctionHouseContract,
        functionName: "auction",
        args: [],
      }),
      cachedReadContract(vrbsPublicClient, {
        ...vrbsAuctionHouseContract,
        functionName: "minBidIncrementPercentage",
        args: [],
      }),
      cachedReadContract(vrbsPublicClient, {
        ...vrbsAuctionHouseContract,
        functionName: "reservePrice",
        args: [],
      }),
    ]);

  const [artData, highestBidder] = await Promise.all([
    cachedReadContract(vrbsPublicClient, {
      ...vrbsRevolutionTokenContract,
      functionName: "getArtPieceById",
      args: [tokenId],
    }),
    getUser({ address: highestBidderAddress }),
  ]);

  // Artist
  const creators = [...artData.creators].sort((a, b) => Number(a.bps - b.bps));
  const mainCreatorAddress = creators[0].creator;
  const artist = await getUser({ address: mainCreatorAddress });

  // Next bid
  const nextMinBid = bigIntMax(
    reservePrice,
    highestBid + (highestBid * BigInt(minBidIncrementPercentage)) / BigInt(100)
  );

  // End time
  const currentTimestampS = BigInt(Math.floor(Date.now() / 1000));
  const timeLeftS = bigIntMax(BigInt(0), endTime - currentTimestampS);
  const timeRemainingFormatted = formatTimeLeft(Number(timeLeftS));

  return {
    tokenId,

    artworkImageSrc: artData.metadata.image,

    artist,

    highestBidder,
    highestBid,

    nextMinBid,

    endTime,
    timeRemainingFormatted,
  };
}

// Light cached to help deduplicate requests
export const getCurrentAuctionDataCached = unstable_cache(getCurrentAuctionData, ["vrbs-get-current-auction-data"], {
  revalidate: 5,
});
