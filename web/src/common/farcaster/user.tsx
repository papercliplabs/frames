import { User as FarcasterUser } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { unstable_cache } from "next/cache";

interface FCUser extends FarcasterUser {
  power_badge: boolean;
}

export async function getUserInfo(fid: number, viewerFid?: number): Promise<FCUser> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}${
    viewerFid != undefined ? "&viewer_fid=" + viewerFid : ""
  }`;
  const req = await fetch(url, {
    headers: {
      api_key: process.env.NEYNAR_API_KEY!,
    },
    next: {
      revalidate: 0,
    },
  });

  const resp = await req.json();
  const user = resp["users"][0] as FCUser;

  return user;
}

async function isUserFollowingUserUncached(userFid: number, isBeingFollowedFid: number): Promise<boolean> {
  console.log("CACHE SKIP");
  const userWithViewerContext = await getUserInfo(userFid, isBeingFollowedFid);
  console.log("CACHE SKIP - DONE");
  return userWithViewerContext.viewer_context?.followed_by ?? false;
}

// Unstable cache to avoid stale while revalidate
export const isUserFollowingUser = unstable_cache(isUserFollowingUserUncached, ["is-user-following-user"], {
  revalidate: 15,
});
