import { readContractCached } from "@/common/utils/caching/readContractCached";
import { Address, Client } from "viem";
import { nounsBuilderTokenAbi } from "../abis/token";
import { SECONDS_PER_DAY, SECONDS_PER_MONTH } from "@/utils/constants";
import { nounsBuilderAuctionAbi } from "../abis/auction";
import { bigIntMax } from "@/common/utils/bigInt";

interface GetCurrentAuctionParams {
  client: Client;
  collectionAddress: Address;
}

export interface NounsBuilderAuction {
  tokenId: bigint;

  highestBidAmount: bigint;
  highestBidderAddress: Address;

  startTime: bigint;
  endTime: bigint;

  settled: boolean;

  nextMinBid: bigint;

  auctionAddress: Address;
}

export async function getCurrentAuction({
  client,
  collectionAddress,
}: GetCurrentAuctionParams): Promise<NounsBuilderAuction> {
  const auctionAddress = await readContractCached(
    client,
    {
      address: collectionAddress,
      abi: nounsBuilderTokenAbi,
      functionName: "auction",
    },
    { revalidate: SECONDS_PER_MONTH }
  );

  const auctionContract = {
    address: auctionAddress,
    abi: nounsBuilderAuctionAbi,
  };

  const [
    [tokenId, highestBidAmount, highestBidderAddress, startTime, endTime, settled],
    reservePrice,
    minBidIncrementPercentage,
  ] = await Promise.all([
    readContractCached(
      client,
      {
        ...auctionContract,
        functionName: "auction",
      },
      { revalidate: 15 }
    ),
    readContractCached(
      client,
      {
        ...auctionContract,
        functionName: "reservePrice",
      },
      { revalidate: SECONDS_PER_DAY }
    ),
    readContractCached(
      client,
      {
        ...auctionContract,
        functionName: "minBidIncrement",
      },
      { revalidate: SECONDS_PER_DAY }
    ),
  ]);

  const nextMinBid = bigIntMax(
    reservePrice,
    highestBidAmount + (highestBidAmount * BigInt(minBidIncrementPercentage)) / BigInt(100)
  );

  return {
    tokenId,

    highestBidAmount,
    highestBidderAddress,

    startTime: BigInt(startTime),
    endTime: BigInt(endTime),

    settled,

    nextMinBid,

    auctionAddress,
  };
}
