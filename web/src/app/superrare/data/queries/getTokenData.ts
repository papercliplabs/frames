import { readContractCached } from "@/common/utils/caching/readContractCached";
import { SECONDS_PER_MONTH } from "@/utils/constants";
import { Address, erc20Abi, isAddressEqual, zeroAddress } from "viem";
import { SUPERRARE_CHAIN_CONFIG } from "../../config";

interface GetTokenDataParams {
  tokenAddress: Address;
}

export interface TokenData {
  address: Address;
  symbol: string;
  decimals: number;
}

export async function getTokenData({ tokenAddress }: GetTokenDataParams): Promise<TokenData> {
  if (isAddressEqual(tokenAddress, zeroAddress)) {
    return {
      address: tokenAddress,
      symbol: "Ξ",
      decimals: 18,
    };
  }

  const [symbol, decimals] = await Promise.all([
    readContractCached(
      SUPERRARE_CHAIN_CONFIG.client,
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "symbol",
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
    readContractCached(
      SUPERRARE_CHAIN_CONFIG.client,
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "decimals",
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
  ]);

  return {
    address: tokenAddress,
    symbol,
    decimals,
  };
}
