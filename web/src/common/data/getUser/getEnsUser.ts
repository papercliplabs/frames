import { SECONDS_PER_MONTH } from "@/utils/constants";
import { mainnetPublicClient } from "@/common/utils/walletClients";
import { Address } from "viem";
import { getEnsAvatar, getEnsName } from "viem/actions";
import { normalize } from "viem/ens";
import { User } from ".";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

async function getEnsUserUncached({ address }: { address: Address }): Promise<User | null> {
  const ensName = await getEnsName(mainnetPublicClient, { address });

  if (ensName) {
    const ensAvatar = await getEnsAvatar(mainnetPublicClient, { name: normalize(ensName) });
    return {
      name: ensName,
      imageSrc: ensAvatar || undefined,
    };
  } else {
    return null;
  }
}

export const getEnsUser = customUnstableCache(getEnsUserUncached, ["get-ens-user"], { revalidate: SECONDS_PER_MONTH });
