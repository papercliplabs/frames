"use server";
import { readContractCached } from "@/common/utils/caching/readContractCached";
import { Address } from "viem";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { bigIntMax } from "@/common/utils/bigInt";
import { mainnetPublicClient } from "@/utils/wallet";
import { nounsAuctionHouseContract } from "../contracts/auctionHouse";

export interface NounsAuction {
  nounId: bigint;

  highestBidAmount: bigint;
  highestBidderAddress: Address;

  startTime: bigint;
  endTime: bigint;

  settled: boolean;

  nextMinBid: bigint;
}

export async function getCurrentAuction(): Promise<NounsAuction> {
  const [
    { nounId, amount: highestBidAmount, startTime, endTime, bidder: highestBidderAddress, settled },
    reservePrice,
    minBidIncrementPercentage,
  ] = await Promise.all([
    readContractCached(
      mainnetPublicClient,
      {
        ...nounsAuctionHouseContract,
        functionName: "auction",
      },
      { revalidate: 15 }
    ),
    readContractCached(
      mainnetPublicClient,
      {
        ...nounsAuctionHouseContract,
        functionName: "reservePrice",
      },
      { revalidate: SECONDS_PER_DAY }
    ),
    readContractCached(
      mainnetPublicClient,
      {
        ...nounsAuctionHouseContract,
        functionName: "minBidIncrementPercentage",
      },
      { revalidate: SECONDS_PER_DAY }
    ),
  ]);

  const nextMinBid = bigIntMax(
    reservePrice,
    highestBidAmount + (highestBidAmount * BigInt(minBidIncrementPercentage)) / BigInt(100)
  );

  return {
    nounId,

    highestBidAmount,
    highestBidderAddress,

    startTime: BigInt(startTime),
    endTime: BigInt(endTime),

    settled,

    nextMinBid,
  };
}
