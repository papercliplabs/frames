import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const NEYNAR_KEY = process.env.NEYNAR_API_KEY!;

export const neynarClient = new NeynarAPIClient(NEYNAR_KEY);

export interface FrameRequest {
    trustedData: {
        messageBytes: string;
    };
}

export async function validateFrameAndGetPayload(request: FrameRequest) {
    return await neynarClient.validateFrameAction(request.trustedData.messageBytes);
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
            }
        );
        return await followersRes.json();
    }

    let cursor = undefined;
    let followerIds: number[] = [];
    do {
        try {
            const followersResponse = await makePagenatedRequest(cursor);
            followerIds = followerIds.concat(followersResponse["users"].map((user: any) => user["fid"]));
            cursor = followersResponse["next"]["cursor"];
        } catch (e) {
            console.error("getFollowerUserIdsForChannel: api error - ", e);
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
        });
        const resp = await req.json();
        const likes = resp["result"]["casts"][0]["reactions"]["likes"] as Array<any>;
        return likes.map((like: any) => like["fid"]);
    } catch (e) {
        console.error("getLikedUserIdsForCast: api error - ", e);
        return [];
    }
}
