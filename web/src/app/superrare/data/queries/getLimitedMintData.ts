import { Address, erc20Abi, isAddressEqual, zeroAddress } from "viem";
import { ArtworkData, getArtworkData } from "./getArtworkData";
import { cachedReadContract } from "@/utils/caching";
import { baseNft } from "@/abis/superrare/baseNft";
import { readContract } from "viem/actions";
import { mainnetPublicClient } from "@/utils/wallet";
import { SUPERRARE_MINTER_PROXY_ADDRESS } from "../../utils/constants";
import { rareMinterAbi } from "@/abis/superrare/rareMinter";
import { unstable_cache } from "next/cache";
import { TokenData, getTokenData } from "./getTokenData";
import "@/utils/bigIntPolyfill";

interface GetLimitedMintDataParams {
  collectionAddress: Address;
}

interface LimitedMintData extends ArtworkData {
  currentSupply: bigint;
  maxSupply: bigint;
  currency: TokenData;
  price: bigint;
  maxMintsPerAddress: bigint; // total number of mints an address can make - 0 => no limit
  txnLimitPerAddress: bigint; // total number of a times an address can mint

  isValidForFrameTxn: boolean; // Valid when: token is ETH, doesn't have an allowlist, mint has started, and not minted out
}

export async function getLimitedMintDataUncached({
  collectionAddress,
}: GetLimitedMintDataParams): Promise<LimitedMintData | null> {
  try {
    const [currentSupply, maxSupply, directSaleConfig, maxMintsPerAddress, txnLimitPerAddress, allowListConfig] =
      await Promise.all([
        readContract(mainnetPublicClient, {
          address: collectionAddress,
          abi: baseNft,
          functionName: "totalSupply",
        }),
        cachedReadContract(mainnetPublicClient, {
          address: collectionAddress,
          abi: baseNft,
          functionName: "maxTokens",
        }),
        cachedReadContract(mainnetPublicClient, {
          address: SUPERRARE_MINTER_PROXY_ADDRESS,
          abi: rareMinterAbi,
          functionName: "getDirectSaleConfig",
          args: [collectionAddress],
        }),
        cachedReadContract(mainnetPublicClient, {
          address: SUPERRARE_MINTER_PROXY_ADDRESS,
          abi: rareMinterAbi,
          functionName: "getContractMintLimit",
          args: [collectionAddress],
        }),
        cachedReadContract(mainnetPublicClient, {
          address: SUPERRARE_MINTER_PROXY_ADDRESS,
          abi: rareMinterAbi,
          functionName: "getContractTxLimit",
          args: [collectionAddress],
        }),
        cachedReadContract(mainnetPublicClient, {
          address: SUPERRARE_MINTER_PROXY_ADDRESS,
          abi: rareMinterAbi,
          functionName: "getContractAllowListConfig",
          args: [collectionAddress],
        }),
      ]);

    const currencyAddress = directSaleConfig.currencyAddress;

    const currency = await getTokenData({ tokenAddress: currencyAddress });

    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000)); // sec since unix epoch, same as EVM's timestamp

    const isEthMint = isAddressEqual(directSaleConfig.currencyAddress, zeroAddress);
    const noAllowList = 0 == Number(allowListConfig.root) || allowListConfig.endTimestamp < currentTimestamp;
    const mintStarted = directSaleConfig.startTime < currentTimestamp;
    const notMintedOut = currentSupply < maxSupply;

    const isValidForFrameTxn = isEthMint && noAllowList && mintStarted && notMintedOut;

    const tokenId = notMintedOut ? currentSupply + BigInt(1) : currentSupply;
    const artworkData = await getArtworkData({ collectionAddress, tokenId });
    if (!artworkData) {
      console.log("getLimitedMintData - no artwork data", collectionAddress, tokenId);
      return null;
    }

    console.log("FROM DATA", directSaleConfig.price, typeof directSaleConfig.price);

    return {
      ...artworkData,
      currentSupply,
      maxSupply,
      currency,
      price: BigInt(directSaleConfig.price), // For some reason, need this explicit cast
      maxMintsPerAddress,
      txnLimitPerAddress,
      isValidForFrameTxn,
    };
  } catch (e) {
    console.log("getArtworkData - error:", collectionAddress, e);
    return null;
  }
}

export const getLimitedMintData = unstable_cache(getLimitedMintDataUncached, ["get-limited-mint-data"], {
  revalidate: 10,
});
