import { Address, erc20Abi, isAddressEqual, zeroAddress } from "viem";
import { ArtworkData, getArtworkData } from "./getArtworkData";
import { cachedReadContract } from "@/utils/caching";
import { baseNft } from "@/abis/superrare/baseNft";
import { readContract } from "viem/actions";
import { mainnetPublicClient } from "@/utils/wallet";
import { SUPERRARE_BRAZZER_ADDRESS } from "../../utils/constants";
import { rareMinterAbi } from "@/abis/superrare/rareMinter";
import { unstable_cache } from "next/cache";
import { gql } from "../generated";
import { getSuperrareApolloClient } from "../client";
import { brazzerAbi } from "@/abis/superrare/brazzer";
import { User, getUserData } from "./getUserData";
import { bigIntMax, bigIntMin } from "@/utils/bigInt";
import { TokenData, getTokenData } from "./getTokenData";
import { formatTimeLeft } from "@/utils/format";

interface GetAuctionDataParams {
  collectionAddress: Address;
  tokenId: bigint;
}

interface LiveAuctionData extends ArtworkData {
  currency: TokenData;

  highestBidder?: User;
  highestBid: bigint;

  nextMinBid: bigint;

  startTime: bigint;
  endTime: bigint;
  timeRemainingFormatted: string;

  isValidForFrameTxn: boolean; // Valid when: currency is ETH, mint has started, mint has not ended
}

async function getAuctionDataUncached({
  collectionAddress,
  tokenId,
}: GetAuctionDataParams): Promise<LiveAuctionData | null> {
  try {
    const [
      artworkData,
      [creatorAddress, , startTime, auctionLength, currencyAddress, minimumBid, auctionType],
      [bidderAddress, , highestBid],
      minBidIncrementPercentage,
    ] = await Promise.all([
      getArtworkData({ collectionAddress, tokenId }),
      cachedReadContract(mainnetPublicClient, {
        address: SUPERRARE_BRAZZER_ADDRESS,
        abi: brazzerAbi,
        functionName: "getAuctionDetails",
        args: [collectionAddress, tokenId],
      }),
      cachedReadContract(mainnetPublicClient, {
        address: SUPERRARE_BRAZZER_ADDRESS,
        abi: brazzerAbi,
        functionName: "auctionBids",
        args: [collectionAddress, tokenId],
      }),
      cachedReadContract(mainnetPublicClient, {
        address: SUPERRARE_BRAZZER_ADDRESS,
        abi: brazzerAbi,
        functionName: "minimumBidIncreasePercentage",
      }),
    ]);

    const highestBidder = bidderAddress != zeroAddress ? await getUserData({ userAddress: bidderAddress }) : undefined;

    const nextMinBid = bigIntMax(
      minimumBid,
      highestBid + (highestBid * BigInt(minBidIncrementPercentage)) / BigInt(100)
    );

    const endTime = startTime + auctionLength;

    const currency = await getTokenData({ tokenAddress: currencyAddress });

    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000)); // sec since unix epoch, same as EVM's timestamp

    const auctionStarted = currentTimestamp > startTime;
    const auctionEnded = currentTimestamp > endTime;

    if (!artworkData) {
      console.log("getAuctionData - no artwork data", collectionAddress, tokenId);
      return null;
    }

    if (!auctionStarted || auctionEnded) {
      console.log("getAuctionData - auction not running");
      return null;
    }

    const timeLeftS = endTime - currentTimestamp; // Will be positive, and auction must be active to get here
    const timeRemainingFormatted = formatTimeLeft(Number(timeLeftS));

    const isValidForFrameTxn = isAddressEqual(currency.address, zeroAddress);

    return {
      ...artworkData,
      currency,
      highestBidder: highestBidder ?? undefined,
      highestBid,
      nextMinBid,
      startTime,
      endTime,

      timeRemainingFormatted,

      isValidForFrameTxn,
    };
  } catch (e) {
    console.error("getAuctionDataUncached - error:", collectionAddress, tokenId, e);
    return null;
  }
}

export const getAuctionData = unstable_cache(getAuctionDataUncached, ["get-auction-data"], {
  revalidate: 10,
});
