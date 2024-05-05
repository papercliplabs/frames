"use server";
import { mainnetPublicClient, shortenAddress } from "@/utils/wallet";
import { unstable_cache } from "next/cache";
import { Address } from "viem";
import { getEnsAvatar, getEnsName } from "viem/actions";
import { normalize } from "viem/ens";

interface GetUserParams {
  address: Address;
}

export interface User {
  name: string;
  imageSrc?: string;
}

async function getUserUncached({ address }: GetUserParams): Promise<User> {
  const ensName = await getEnsName(mainnetPublicClient, { address });
  const ensAvatar = ensName ? await getEnsAvatar(mainnetPublicClient, { name: normalize(ensName) }) : undefined;

  return {
    name: ensName ?? shortenAddress(address, 4),
    imageSrc: ensAvatar ?? undefined,
  };
}

export const getUser = unstable_cache(getUserUncached, ["vrbs-get-user"], { revalidate: 86400 });
