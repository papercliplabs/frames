import { getUserInfo } from "@/common/farcaster/user";
import { getAccountVotes } from "@/common/nouns/data/getAccountVotes";
import { Address } from "viem";

export async function getVoteWeightForFid(fid: number, blockNumber: bigint): Promise<number> {
  const userInfo = await getUserInfo(fid);
  const userVerifiedAddresses = userInfo.verified_addresses.eth_addresses as Address[];

  const votesForAddresses = await Promise.all(
    userVerifiedAddresses.map((address) => getAccountVotes({ account: address, blockNumber }))
  );
  const totalVotes = votesForAddresses.reduce((acc, votes) => acc + votes, BigInt(0));
  return Number(totalVotes);
}
