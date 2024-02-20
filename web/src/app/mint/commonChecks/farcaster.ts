import { getFollowerUserIdsForChannel, getLikedUserIdsForCast, getUserInfo } from "@/utils/farcaster";
import { revalidateTag, unstable_cache } from "next/cache";
import { Address } from "viem";

export async function isCastLikedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    const likedUserIds = await getLikedUserIdsForCast(castHash);
    return likedUserIds.includes(userId);
}

export async function isChannelFollowedByUser(channelId: string, userId: number): Promise<boolean> {
    // const followerUserIds = await unstable_cache(
    //     () => getFollowerUserIdsForChannel(channelId),
    //     [`get-follower-user-ids-for-channel`, channelId],
    //     {
    //         revalidate: 15,
    //         tags: ["TEST"],
    //     }
    // )();

    const followerUserIds = await getFollowerUserIdsForChannel(channelId);

    return followerUserIds.includes(userId);
}

export async function isUserFollowedByUser(userId: number, userIdToCheckIfFollowing: number): Promise<boolean> {
    const isFollowing = (await getUserInfo(userId, userIdToCheckIfFollowing)).viewer_context?.following;
    return userId == userIdToCheckIfFollowing || (isFollowing ?? false);
}

export async function doesUserHaveActiveBadge(userId: number, inclusionIds: number[]): Promise<boolean> {
    const status = (await getUserInfo(userId)).active_status;
    return status == "active" || inclusionIds.includes(userId);
}
