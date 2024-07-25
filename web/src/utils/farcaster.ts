import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit/frame";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { User as FarcasterUser } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export const NEYNAR_KEY = process.env.NEYNAR_API_KEY!;
const REVALIDATION_TIME_S = 15;

export const neynarClient = new NeynarAPIClient(NEYNAR_KEY);

interface User extends FarcasterUser {
  power_badge: boolean;
}

export async function getFollowerUserIdsForChannel(channelId: string): Promise<number[]> {
  async function makePagenatedRequest(cursor: string | undefined) {
    const followersRes = await fetch(
      `https://api.neynar.com/v2/farcaster/channel/followers?id=${channelId}&limit=1000${
        cursor ? "&cursor=" + cursor : ""
      }`,
      {
        headers: {
          api_key: NEYNAR_KEY,
        },
        next: {
          revalidate: REVALIDATION_TIME_S,
        },
      }
    );
    return await followersRes.json();
  }

  let cursor = undefined;
  let followerIds: number[] = [];
  do {
    const followersResponse = await makePagenatedRequest(cursor);
    try {
      followerIds = followerIds.concat(followersResponse["users"].map((user: any) => user["fid"]));
      cursor = followersResponse["next"]["cursor"];
    } catch (e) {
      console.error("getFollowerUserIdsForChannel: api error - ", e, followersResponse);
      cursor = undefined;
    }
  } while (cursor != undefined);

  followerIds = Array.from(new Set(followerIds)); // Remove any duplicates

  return followerIds;
}

export async function getLikedUserIdsForCast(castHash: string): Promise<number[]> {
  try {
    const req = await fetch(`https://api.neynar.com/v2/farcaster/casts?casts=${castHash}`, {
      headers: {
        api_key: NEYNAR_KEY,
      },
      next: {
        revalidate: REVALIDATION_TIME_S,
      },
    });
    const resp = await req.json();
    const likes = resp["result"]["casts"][0]["reactions"]["likes"] as Array<any>;
    return likes.map((like: any) => like["fid"]);
  } catch (e) {
    // console.error("getLikedUserIdsForCast: api error - ", e);
    return [];
  }
}

export async function getUserInfo(fid: number, viewerFid?: number): Promise<User> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}${
    viewerFid != undefined ? "&viewer_fid=" + viewerFid : ""
  }`;
  const req = await fetch(url, {
    headers: {
      api_key: NEYNAR_KEY,
    },
    next: {
      revalidate: REVALIDATION_TIME_S,
    },
  });

  const resp = await req.json();
  const user = resp["users"][0] as User;

  return user;
}

export async function getFrameMessageWithNeynarApiKey(frameRequest: FrameRequest) {
  return getFrameMessage(frameRequest, {
    neynarApiKey: NEYNAR_KEY,
  });
}
