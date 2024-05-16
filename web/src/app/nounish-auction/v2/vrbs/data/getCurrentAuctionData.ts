"use server";
import { vrbsPublicClient } from "../utils/client";
import { vrbsAuctionHouseContract } from "../contracts/vrbsAuctionHouse";
import { vrbsRevolutionTokenContract } from "../contracts/vrbsRevolutionToken";
import { readContract } from "viem/actions";
import { bigIntMax } from "@/common/utils/bigInt";
import { formatTimeLeft } from "@/utils/format";
import { User, getUser } from "@/common/data/getUser";
import { readContractCached } from "@/common/utils/caching/readContractCached";
import { SECONDS_PER_HOUR } from "@/utils/constants";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

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
      readContractCached(
        vrbsPublicClient,
        {
          ...vrbsAuctionHouseContract,
          functionName: "minBidIncrementPercentage",
          args: [],
        },
        { revalidate: SECONDS_PER_HOUR }
      ),
      readContractCached(
        vrbsPublicClient,
        {
          ...vrbsAuctionHouseContract,
          functionName: "reservePrice",
          args: [],
        },
        { revalidate: SECONDS_PER_HOUR }
      ),
    ]);

  const [artData, highestBidder] = await Promise.all([
    readContractCached(
      vrbsPublicClient,
      {
        ...vrbsRevolutionTokenContract,
        functionName: "getArtPieceById",
        args: [tokenId],
      },
      { revalidate: SECONDS_PER_HOUR }
    ),
    getUser({ address: highestBidderAddress, resolverTypes: ["farcaster", "ens"] }),
  ]);

  // Artist
  const creators = [...artData.creators].sort((a, b) => Number(a.bps - b.bps));
  const mainCreatorAddress = creators[0].creator;
  const artist = await getUser({ address: mainCreatorAddress, resolverTypes: ["farcaster", "ens"] });

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
export const getCurrentAuctionDataCached = customUnstableCache(
  getCurrentAuctionData,
  ["vrbs-get-current-auction-data"],
  {
    revalidate: 5,
  }
);
