import { Address, Client, erc20Abi } from "viem";
import { multicall } from "viem/actions";

interface GetErc20ApprovalAndBalanceCheckParam {
  client: Client;
  tokenAddress: Address;
  ownerAddress: Address;
  spenderAddress: Address;
  requiredAmount: bigint;
}

interface GetErc20ApprovalAndBalanceCheckReturnType {
  sufficientBalance: boolean;
  requiresApproval: boolean;
}

export async function getErc20ApprovalAndBalanceCheck({
  client,
  tokenAddress,
  ownerAddress,
  spenderAddress,
  requiredAmount,
}: GetErc20ApprovalAndBalanceCheckParam): Promise<GetErc20ApprovalAndBalanceCheckReturnType> {
  const [allowance, balance] = await multicall(client, {
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "allowance",
        args: [ownerAddress, spenderAddress],
      },
      {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "balanceOf",
        args: [ownerAddress],
      },
    ],
    allowFailure: false,
  });

  return {
    sufficientBalance: balance >= requiredAmount,
    requiresApproval: allowance < requiredAmount,
  };
}
