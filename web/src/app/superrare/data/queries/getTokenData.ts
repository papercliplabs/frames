import { readContractCached } from "@/common/utils/caching/readContractCached";
import { SECONDS_PER_MONTH, SECONDS_PER_WEEK } from "@/utils/constants";
import { mainnetPublicClient } from "@/common/utils/walletClients";
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
    readContractCached(
      mainnetPublicClient,
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "symbol",
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
    readContractCached(
      mainnetPublicClient,
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
