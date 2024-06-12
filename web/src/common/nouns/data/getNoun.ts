"use server";
import { readContractCached } from "@/common/utils/caching/readContractCached";
import { SECONDS_PER_MONTH } from "@/utils/constants";
import { parseBase64Json } from "@/common/utils/base64";
import { nounsTokenContract } from "../contracts/token";
import { mainnetPublicClient } from "@/common/utils/walletClients";

interface GetNounParams {
  id: bigint;
}

export interface Noun {
  id: bigint;

  seeds: {
    background: number;
    head: number;
    glasses: number;
    body: number;
    accessory: number;
  };

  imgSrc: string;
}

export async function getNoun({ id }: GetNounParams): Promise<Noun> {
  const [[background, body, accessory, head, glasses], tokenUri] = await Promise.all([
    readContractCached(
      mainnetPublicClient,
      {
        ...nounsTokenContract,
        functionName: "seeds",
        args: [id],
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
    readContractCached(
      mainnetPublicClient,
      {
        ...nounsTokenContract,
        functionName: "tokenURI",
        args: [id],
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
  ]);

  const imgSrc = parseBase64Json(tokenUri).image as string;

  return {
    id,

    seeds: {
      background,
      head,
      glasses,
      body,
      accessory,
    },

    imgSrc,
  };
}
