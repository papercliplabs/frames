import { cachedReadContract } from "@/utils/caching";
import { mainnetPublicClient } from "@/utils/wallet";
import { Address, erc20Abi, isAddressEqual, zeroAddress } from "viem";

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
    cachedReadContract(mainnetPublicClient, {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "symbol",
    }),
    cachedReadContract(mainnetPublicClient, {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "decimals",
    }),
  ]);

  return {
    address: tokenAddress,
    symbol,
    decimals,
  };
}
