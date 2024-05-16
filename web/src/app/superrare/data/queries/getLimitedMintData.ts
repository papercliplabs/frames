import { Address, isAddressEqual, zeroAddress } from "viem";
import { baseNft } from "@/abis/superrare/baseNft";
import { readContract } from "viem/actions";
import { mainnetPublicClient } from "@/utils/wallet";
import { SUPERRARE_MINTER_PROXY_ADDRESS } from "../../utils/constants";
import { rareMinterAbi } from "@/abis/superrare/rareMinter";
import { TokenData, getTokenData } from "./getTokenData";
import { readContractCached } from "@/common/utils/caching/readContractCached";
import { SECONDS_PER_DAY, SECONDS_PER_HOUR } from "@/utils/constants";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

interface GetLimitedMintDataParams {
  collectionAddress: Address;
}

interface LimitedMintData {
  currentSupply: bigint;
  maxSupply: bigint;
  tokenId: bigint;

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
        readContractCached(
          mainnetPublicClient,
          {
            address: collectionAddress,
            abi: baseNft,
            functionName: "maxTokens",
          },
          { revalidate: SECONDS_PER_HOUR }
        ),
        readContractCached(
          mainnetPublicClient,
          {
            address: SUPERRARE_MINTER_PROXY_ADDRESS,
            abi: rareMinterAbi,
            functionName: "getDirectSaleConfig",
            args: [collectionAddress],
          },
          { revalidate: SECONDS_PER_HOUR }
        ),
        readContractCached(
          mainnetPublicClient,
          {
            address: SUPERRARE_MINTER_PROXY_ADDRESS,
            abi: rareMinterAbi,
            functionName: "getContractMintLimit",
            args: [collectionAddress],
          },
          { revalidate: SECONDS_PER_HOUR }
        ),
        readContractCached(
          mainnetPublicClient,
          {
            address: SUPERRARE_MINTER_PROXY_ADDRESS,
            abi: rareMinterAbi,
            functionName: "getContractTxLimit",
            args: [collectionAddress],
          },
          { revalidate: SECONDS_PER_HOUR }
        ),
        readContractCached(
          mainnetPublicClient,
          {
            address: SUPERRARE_MINTER_PROXY_ADDRESS,
            abi: rareMinterAbi,
            functionName: "getContractAllowListConfig",
            args: [collectionAddress],
          },
          { revalidate: SECONDS_PER_HOUR }
        ),
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

    return {
      currentSupply,
      maxSupply,
      tokenId,
      currency,
      price: directSaleConfig.price,
      maxMintsPerAddress,
      txnLimitPerAddress,
      isValidForFrameTxn,
    };
  } catch (e) {
    console.log("getLimitedMintData - error:", collectionAddress, e);
    return null;
  }
}

export const getLimitedMintData = customUnstableCache(getLimitedMintDataUncached, ["get-limited-mint-data"], {
  revalidate: 10,
});
