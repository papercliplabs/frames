import { unstable_cache } from "next/cache";
import { Abi, Chain, Client, ContractFunctionArgs, ContractFunctionName, Transport } from "viem";
import { ReadContractParameters, ReadContractReturnType, readContract } from "viem/actions";

export const cachedReadContract = unstable_cache(readContract, ["cached-read-contract"], { revalidate: 60 });

// export async function readContract<
//   chain extends Chain | undefined,
//   const abi extends Abi | readonly unknown[],
//   functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
//   const args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
// >(
//   client: Client<Transport, chain>,
//   parameters: ReadContractParameters<abi, functionName, args>,
// ): Promise<ReadContractReturnType<abi, functionName, args>>
