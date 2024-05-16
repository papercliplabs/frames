import { Address } from "viem";
import { beansClient } from "../config/client";
import { beansAuctionContract } from "../config/contracts/auction";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { bigIntMax } from "@/common/utils/bigInt";
import { readContractCached } from "@/common/utils/caching/readContractCached";

interface Auction {
  beanId: bigint;

  highestBidAmount: bigint;
  highestBiderAddress: Address;

  startTime: bigint;
  endTime: bigint;

  settled: boolean;

  nextMinBid: bigint;
}

export async function getCurrentAuction(): Promise<Auction> {
  const [
    [beanId, highestBidAmount, startTime, endTime, highestBiderAddress, settled],
    reservePrice,
    minBidIncrementPercentage,
  ] = await Promise.all([
    readContractCached(beansClient, { ...beansAuctionContract, functionName: "auction" }, { revalidate: 30 }),
    readContractCached(
      beansClient,
      { ...beansAuctionContract, functionName: "reservePrice" },
      { revalidate: SECONDS_PER_DAY }
    ),
    readContractCached(
      beansClient,
      { ...beansAuctionContract, functionName: "minBidIncrementPercentage" },
      { revalidate: SECONDS_PER_DAY }
    ),
  ]);

  const nextMinBid = bigIntMax(
    reservePrice,
    highestBidAmount + (highestBidAmount * BigInt(minBidIncrementPercentage)) / BigInt(100)
  );

  return {
    beanId,

    highestBiderAddress,
    highestBidAmount,

    startTime,
    endTime,

    settled,
    nextMinBid,
  };
}
