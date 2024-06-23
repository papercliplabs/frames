import { Address, erc721Abi, isAddressEqual, zeroAddress } from "viem";
import { TokenData, getTokenData } from "./getTokenData";
import { SUPERRARE_CHAIN_CONFIG } from "../../config";
import { readContract } from "viem/actions";
import { bazaarAbi } from "../../abis/bazaar";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

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
        abi: bazaarAbi,
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

    const isPermittedCurrency =
      isAddressEqual(currency.address, zeroAddress) ||
      isAddressEqual(currency.address, SUPERRARE_CHAIN_CONFIG.addresses.rareToken);
    const isValidForFrameTxn = isPermittedCurrency;

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

export const getBuyNowData = customUnstableCache(getBuyNowDataUncached, ["superrare-get-buy-now-data"], {
  revalidate: 60 * 15, // 15min
});
