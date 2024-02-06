import { getFollowerUserIdsForChannel, getLikedUserIdsForCast, getUserInfo } from "@/utils/farcaster";
import { Address } from "viem";

export async function isCastLikedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
    const likedUserIds = await getLikedUserIdsForCast(castHash);
    return likedUserIds.includes(userId);
}

export async function isChannelFollowedByUser(channelId: string, userId: number): Promise<boolean> {
    const followerUserIds = await getFollowerUserIdsForChannel(channelId);
    return followerUserIds.includes(userId);
}

export async function isUserFollowedByUser(userId: number, userIdToCheckIfFollowing: number): Promise<boolean> {
    return (await getUserInfo(userId, userIdToCheckIfFollowing)).result.user.viewerContext?.following ?? false;
}