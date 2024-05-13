import { shortenAddress } from "@/utils/wallet";
import { unstable_cache } from "next/cache";
import { Address } from "viem";
import { getEnsUser } from "./getEnsUser";
import { getFarcasterUser } from "./getFarcasterUser";
import { SECONDS_PER_MONTH } from "@/utils/constants";

type UserResolverType = "ens" | "farcaster";

interface GetUserParams {
  address: Address;
  resolverTypes: UserResolverType[]; // Order to resolve the user data
}

export interface User {
  name: string;
  imageSrc?: string;
}

const resolverForType: Record<
  UserResolverType,
  ({ address }: { address: GetUserParams["address"] }) => Promise<User | null>
> = {
  ens: getEnsUser,
  farcaster: getFarcasterUser,
};

export async function getUser({ address, resolverTypes }: GetUserParams): Promise<User> {
  let name: string | undefined = undefined;
  let imageSrc: string | undefined = undefined;

  for (let type of resolverTypes) {
    const resolvedUser = await resolverForType[type]({ address });
    if (resolvedUser) {
      // Take first resolved name
      name = name ?? resolvedUser.name;

      // Exhaustive search to try to find image src
      imageSrc = resolvedUser.imageSrc;
      if (imageSrc) {
        break;
      }
    }
  }

  return { name: name ?? shortenAddress(address, 4), imageSrc };
}
