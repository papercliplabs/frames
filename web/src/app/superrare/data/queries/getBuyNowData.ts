import { Address, erc721Abi, isAddressEqual, zeroAddress } from "viem";
import { TokenData, getTokenData } from "./getTokenData";
import { SUPERRARE_CHAIN_CONFIG } from "../../config";
import { readContract } from "viem/actions";
import { unstable_cache } from "next/cache";
import { brazzerAbi } from "../../abis/brazzer";

interface GetBuyNowDataParams {
  collectionAddress: Address;
  tokenId: bigint;
}

type BuyNowData = {
  currency: TokenData;
  price: bigint;

  isValidForFrameTxn: boolean;
};

export async function getBuyNowDataUncached({
  collectionAddress,
  tokenId,
}: GetBuyNowDataParams): Promise<BuyNowData | null> {
  try {
    const [[seller, currencyAddress, price], tokenOwner] = await Promise.all([
      readContract(SUPERRARE_CHAIN_CONFIG.client, {
        address: SUPERRARE_CHAIN_CONFIG.addresses.superrareBazaar,
        abi: brazzerAbi,
        functionName: "tokenSalePrices",
        args: [collectionAddress, tokenId, zeroAddress],
      }),
      readContract(SUPERRARE_CHAIN_CONFIG.client, {
        address: collectionAddress,
        abi: erc721Abi,
        functionName: "ownerOf",
        args: [tokenId],
      }),
    ]);

    const [ownerHasMarketplaceApproved, currency] = await Promise.all([
      readContract(SUPERRARE_CHAIN_CONFIG.client, {
        address: collectionAddress,
        abi: erc721Abi,
        functionName: "isApprovedForAll",
        args: [tokenOwner, SUPERRARE_CHAIN_CONFIG.addresses.superrareBazaar],
      }),
      getTokenData({ tokenAddress: currencyAddress }),
    ]);

    const sellerIsOwner = isAddressEqual(seller, tokenOwner);
    const forSale = sellerIsOwner && ownerHasMarketplaceApproved && price > BigInt(0);
    if (!forSale) {
      return null;
    }

    const isValidForFrameTxn = isAddressEqual(currency.address, zeroAddress); // ETH only

    return {
      currency,
      price,

      isValidForFrameTxn,
    };
  } catch (e) {
    console.error("getBuyNowData - error", e);
    return null;
  }
}

export const getBuyNowData = unstable_cache(getBuyNowDataUncached, ["superrare-get-buy-now-data"], { revalidate: 30 });
