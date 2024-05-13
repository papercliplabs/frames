import { Address } from "viem";
import "@/common/utils/bigIntPolyfill";
import { readContractCached } from "@/common/viem/readContractCached";
import { beansClient } from "@/common/beans/config/client";
import { beansTokenContract } from "@/common/beans/config/contracts/token";
import { SECONDS_PER_DAY } from "@/utils/constants";

interface GetBeanIdForAddressParams {
  ownerAddress: Address;
}

export async function getBeanIdForAddress({ ownerAddress }: GetBeanIdForAddressParams): Promise<bigint | undefined> {
  const beanBalance = await readContractCached(
    beansClient,
    { ...beansTokenContract, functionName: "balanceOf", args: [ownerAddress] },
    { revalidate: SECONDS_PER_DAY }
  );

  if (beanBalance > BigInt(0)) {
    const beanId = await readContractCached(
      beansClient,
      { ...beansTokenContract, functionName: "tokenOfOwnerByIndex", args: [ownerAddress, BigInt(0)] },
      { revalidate: SECONDS_PER_DAY }
    );

    return BigInt(beanId);
  } else {
    return undefined;
  }
}
