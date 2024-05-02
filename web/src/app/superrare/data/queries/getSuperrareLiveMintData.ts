import { lazySovereignNftAbi } from "@/abis/superrare/lazySovereignNft";
import { fetchIpfsData } from "@/utils/fetchIpfsDats";
import { mainnetPublicClient } from "@/utils/wallet";
import { unstable_cache } from "next/cache";
import { Address, ReadContractParameters, Abi, ContractFunctionName, ContractFunctionArgs } from "viem";
import { multicall, readContract } from "viem/actions";
import "@/utils/bigIntPolyfill";

interface Nft {
  name: string;
  image: string;
}

export interface LiveMint {
  currentSupply: bigint;
  supplyCap: bigint;
  nextNft: Nft;
  previousNfts: Nft[]; // Prev 0-3 mints
}

const cachedReadContract = unstable_cache(readContract, ["superrare-live-mint"], { revalidate: 86400 });

export async function getSuperrareLiveMintData(collectionAddress: Address): Promise<LiveMint | undefined> {
  try {
    const currentSupply = await readContract(mainnetPublicClient, {
      address: collectionAddress,
      abi: lazySovereignNftAbi,
      functionName: "totalSupply",
    });

    const supplyCap = await cachedReadContract(mainnetPublicClient, {
      address: collectionAddress,
      abi: lazySovereignNftAbi,
      functionName: "maxTokens",
    });

    const soldOut = currentSupply >= supplyCap;

    // Cache all this data
    const tokenUris = await Promise.all([
      ...(!soldOut
        ? [
            cachedReadContract(mainnetPublicClient, {
              address: collectionAddress,
              abi: lazySovereignNftAbi,
              functionName: "tokenURI",
              args: [currentSupply + BigInt(1)],
            }),
          ]
        : []),
      ...(currentSupply >= BigInt(1)
        ? [
            cachedReadContract(mainnetPublicClient, {
              address: collectionAddress,
              abi: lazySovereignNftAbi,
              functionName: "tokenURI",
              args: [currentSupply],
            }),
          ]
        : []),
      ...(currentSupply >= BigInt(2)
        ? [
            cachedReadContract(mainnetPublicClient, {
              address: collectionAddress,
              abi: lazySovereignNftAbi,
              functionName: "tokenURI",
              args: [currentSupply - BigInt(1)],
            }),
          ]
        : []),
      ...(currentSupply >= BigInt(3)
        ? [
            cachedReadContract(mainnetPublicClient, {
              address: collectionAddress,
              abi: lazySovereignNftAbi,
              functionName: "tokenURI",
              args: [currentSupply - BigInt(2)],
            }),
          ]
        : []),
      ...(soldOut && currentSupply >= BigInt(4)
        ? [
            cachedReadContract(mainnetPublicClient, {
              address: collectionAddress,
              abi: lazySovereignNftAbi,
              functionName: "tokenURI",
              args: [currentSupply - BigInt(3)],
            }),
          ]
        : []),
    ]);

    const nftData = await Promise.all(tokenUris.map((uri) => fetchIpfsData<Nft>(uri)));

    if (!nftData.reduce((valid, data) => valid && data != undefined, true)) {
      throw new Error("error fetching nft metadata");
    }

    return {
      currentSupply,
      supplyCap,
      nextNft: nftData[0] as Nft, // Checked above
      previousNfts: nftData.slice(1) as Nft[], // Checked above
    };
  } catch (e) {
    console.error("getSuperrareLiveMintData - ", collectionAddress, e);
    return undefined;
  }
}
