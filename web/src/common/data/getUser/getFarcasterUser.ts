import { SECONDS_PER_MONTH } from "@/utils/constants";
import { Address } from "viem";
import { User } from ".";
import { NEYNAR_KEY } from "@/utils/farcaster";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

async function getFarcasterUserUncached({ address }: { address: Address }): Promise<User | null> {
  try {
    const req = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}&address_types=verified_address`,
      {
        headers: {
          api_key: NEYNAR_KEY,
        },
        cache: "no-store",
      }
    );
    const resp = await req.json();

    const userObject = resp[address.toLowerCase()]?.[0] as { username: string; pfp_url?: string } | undefined;

    if (!userObject) {
      return null;
    } else {
      return {
        name: "@" + userObject.username,
        imageSrc: undefined, // userObject.pfp_url ?? undefined, // Farcaster uses imgur, and they don't support direct link to images...
      };
    }
  } catch (e) {
    console.error("getFarcasterUser - ", e);
    return null;
  }
}

export const getFarcasterUser = customUnstableCache(getFarcasterUserUncached, ["get-farcaster-user"], {
  revalidate: SECONDS_PER_MONTH,
});
