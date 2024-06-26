import { Abi, Chain, Client, ContractFunctionArgs, ContractFunctionName, Transport } from "viem";
import { ReadContractParameters, ReadContractReturnType, readContract } from "viem/actions";
import { customUnstableCache } from "./customUnstableCache";

export async function readContractCached<
  chain extends Chain | undefined,
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "pure" | "view">,
  const args extends ContractFunctionArgs<abi, "pure" | "view", functionName>,
>(
  client: Client<Transport, chain>,
  parameters: ReadContractParameters<abi, functionName, args>,
  cacheOptions?: {
    revalidate?: number | false;
    tags?: string[];
  }
): Promise<ReadContractReturnType<abi, functionName, args>> {
  return customUnstableCache(
    (client: Client<Transport, chain>, parameters: ReadContractParameters<abi, functionName, args>) => {
      return readContract(client, parameters);
    },
    ["read-contract-cached"],
    cacheOptions
  )(client, parameters);
}
