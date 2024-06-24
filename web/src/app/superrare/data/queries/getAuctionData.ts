import { Address, isAddressEqual, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { User, getUserData } from "./getUserData";
import { bigIntMax } from "@/common/utils/bigInt";
import { TokenData, getTokenData } from "./getTokenData";
import { formatTimeLeft } from "@/utils/format";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";
import { readContractCached } from "@/common/utils/caching/readContractCached";
import { bazaarAbi } from "../../abis/bazaar";
import { SUPERRARE_CHAIN_CONFIG } from "../../config";

interface GetAuctionDataParams {
  collectionAddress: Address;
  tokenId: bigint;
}

interface LiveAuctionData {
  currency: TokenData;

  highestBidder?: User;
  highestBid: bigint;

  nextMinBid: bigint;

  startTime: bigint;
  endTime: bigint;
  timeRemainingFormatted: string;

  isValidForFrameTxn: boolean; // Valid when: currency is ETH, mint has started, mint has not ended
}

export async function getAuctionDataUncached({
  collectionAddress,
  tokenId,
}: GetAuctionDataParams): Promise<LiveAuctionData | null> {
  try {
    const [
      [creatorAddress, , startTime, auctionLength, currencyAddress, minimumBid, auctionType],
      [bidderAddress, , highestBid],
      minBidIncrementPercentage,
    ] = await Promise.all([
      readContract(SUPERRARE_CHAIN_CONFIG.client, {
        address: SUPERRARE_CHAIN_CONFIG.addresses.superrareBazaar,
        abi: bazaarAbi,
        functionName: "getAuctionDetails",
        args: [collectionAddress, tokenId],
      }),
      readContract(SUPERRARE_CHAIN_CONFIG.client, {
        address: SUPERRARE_CHAIN_CONFIG.addresses.superrareBazaar,
        abi: bazaarAbi,
        functionName: "auctionBids",
        args: [collectionAddress, tokenId],
      }),
      readContractCached(SUPERRARE_CHAIN_CONFIG.client, {
        address: SUPERRARE_CHAIN_CONFIG.addresses.superrareBazaar,
        abi: bazaarAbi,
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

    if (!auctionStarted || auctionEnded) {
      console.log("getAuctionData - auction not running");
      return null;
    }

    const timeLeftS = endTime - currentTimestamp; // Will be positive, and auction must be active to get here
    const timeRemainingFormatted = formatTimeLeft(Number(timeLeftS));

    const isValidForFrameTxn = isAddressEqual(currency.address, zeroAddress);

    return {
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

export const getAuctionData = customUnstableCache(getAuctionDataUncached, ["get-auction-data"], {
  revalidate: 15,
});
