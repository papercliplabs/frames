"use server";

import { Address, Client } from "viem";
import { nounsBuilderTokenAbi } from "../abis/token";
import { readContractCached } from "@/common/utils/caching/readContractCached";
import { SECONDS_PER_MONTH } from "@/utils/constants";
import { parseBase64Json } from "@/common/utils/base64";
import { nounsBuilderMetadataAbi } from "../abis/metadata";

interface GetTokenParams {
  client: Client;
  collectionAddress: Address;
  tokenId: bigint;
}

export interface NounsBuilderToken {
  id: bigint;

  name: string;

  ownerAddress: Address;
  seeds: Record<string, string>;

  imgSrc: string;
}

export async function getToken({ client, collectionAddress, tokenId }: GetTokenParams): Promise<NounsBuilderToken> {
  const tokenContract = {
    address: collectionAddress,
    abi: nounsBuilderTokenAbi,
  };

  const [ownerAddress, name, tokenUri, metadataContractAddresses] = await Promise.all([
    readContractCached(
      client,
      {
        ...tokenContract,
        functionName: "ownerOf",
        args: [tokenId],
      },
      { revalidate: 30 }
    ),
    readContractCached(
      client,
      {
        ...tokenContract,
        functionName: "name",
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
    readContractCached(
      client,
      {
        ...tokenContract,
        functionName: "tokenURI",
        args: [tokenId],
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
    readContractCached(
      client,
      {
        ...tokenContract,
        functionName: "metadataRenderer",
        args: [],
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
  ]);

  const metadata = await readContractCached(client, {
    address: metadataContractAddresses,
    abi: nounsBuilderMetadataAbi,
    functionName: "getAttributes",
    args: [tokenId],
  });

  const imgSrc = (parseBase64Json(tokenUri).image as string).replace(
    "https://api.zora.co/renderer",
    "https://nouns.build/api/renderer"
  );

  return {
    id: tokenId,
    name: `${name} #${tokenId.toString()}`,

    ownerAddress,
    seeds: JSON.parse(metadata[0]),

    imgSrc,
  };
}
