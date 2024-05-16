import { Address } from "viem";
import { beansClient } from "@/common/beans/config/client";
import { beansTokenContract } from "@/common/beans/config/contracts/token";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { readContractCached } from "@/common/utils/caching/readContractCached";

interface GetBeanIdForAddressParams {
  ownerAddress: Address;
}

export async function getBeanIdsForAddress({ ownerAddress }: GetBeanIdForAddressParams): Promise<bigint[]> {
  const beanBalance = await readContractCached(
    beansClient,
    { ...beansTokenContract, functionName: "balanceOf", args: [ownerAddress] },
    { revalidate: SECONDS_PER_DAY }
  );

  if (beanBalance > BigInt(0)) {
    const beanIds = await Promise.all(
      Array(Number(beanBalance))
        .fill(0)
        .map((v, i) =>
          readContractCached(
            beansClient,
            { ...beansTokenContract, functionName: "tokenOfOwnerByIndex", args: [ownerAddress, BigInt(i)] },
            { revalidate: SECONDS_PER_DAY }
          )
        )
    );

    return beanIds.map((id) => BigInt(id)); // To avoid issues with bigint cache serialization
  } else {
    return [];
  }
}
