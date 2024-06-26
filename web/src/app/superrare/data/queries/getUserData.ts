import { Address } from "viem";
import { gql } from "../generated";
import { getSuperrareApolloClient } from "../client";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";
import { shortenAddress } from "@/utils/format";

interface GetUserDataParams {
  userAddress: Address;
}

export interface User {
  name: string;
  imageSrc?: string;
}

async function getUserDataUncached({ userAddress }: GetUserDataParams): Promise<User | null> {
  const query = gql(/* GraphQL */ `
    query UserQuery($userAddresses: [String!]!) {
      usersByAddresses(userAddresses: $userAddresses) {
        primaryProfile {
          sr {
            srAvatarUri
            srName
          }
          ens {
            ensAvatarUri
            ensName
          }
        }
      }
    }
  `);

  const { data } = await getSuperrareApolloClient().query({
    query,
    variables: { userAddresses: [userAddress.toLowerCase()] },
    context: {
      fetchOptions: {
        next: {
          revalidate: 15,
        },
      },
    },
  });

  const user = data.usersByAddresses[0];

  const name = user?.primaryProfile.sr?.srName ?? user?.primaryProfile.ens?.ensName ?? shortenAddress(userAddress);

  const imageSrc = user?.primaryProfile.sr?.srAvatarUri ?? user?.primaryProfile.ens?.ensAvatarUri ?? undefined;

  return {
    name,
    imageSrc,
  };
}

export const getUserData = customUnstableCache(getUserDataUncached, ["get-user-data"]);
