import { readContractCached } from "@/common/utils/caching/readContractCached";
import { mainnetPublicClient } from "@/common/utils/walletClients";
import { Address } from "viem";
import { nounsTokenContract } from "../contracts/token";

export async function getAccountVotes({ account, blockNumber }: { account: Address; blockNumber: bigint }) {
  const votes = await readContractCached(mainnetPublicClient, {
    ...nounsTokenContract,
    functionName: "getPriorVotes",
    args: [account, blockNumber],
  });

  return votes;
}
