import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { frameErrorResponse, frameTxWriteContractResponse } from "@/common/utils/frameResponse";
import { erc20Abi, getAddress, isAddressEqual, maxUint256, zeroAddress } from "viem";
import { extractAndValidateState } from "../utils/validation";
import { getClientForChainId } from "@/common/utils/walletClients";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { getErc20ApprovalAndBalanceCheck } from "../data/getErc20ApprovalAndBalanceCheck";
import { getIsTransactionApproval, storeTransactionIsApproval } from "../data/transactionStorage";

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);
  if (!frameValidationResponse.isValid) {
    throw Error("Invalid frame request");
  }

  const state = await extractAndValidateState(frameValidationResponse.message);
  const client = await getClientForChainId(state.chainId);
  const userAddress = getAddress(frameValidationResponse.message.address as any);

  // If ETH, just return target txn (don't need approval)
  if (isAddressEqual(state.tokenAddress, zeroAddress)) {
    return await fetch(state.actionTxEndpointUrl, { method: "POST", body: JSON.stringify(frameRequest) });
  }

  const { sufficientBalance, requiresApproval } = await getErc20ApprovalAndBalanceCheck({
    client,
    tokenAddress: state.tokenAddress,
    ownerAddress: userAddress,
    spenderAddress: state.spenderAddress,
    requiredAmount: BigInt(state.tokenAmount),
  });

  if (!sufficientBalance) {
    return frameErrorResponse("Error: Insufficient balance");
  }

  if (!requiresApproval) {
    await storeTransactionIsApproval(state.uuid, false);
    return await fetch(state.actionTxEndpointUrl, { method: "POST", body: JSON.stringify(frameRequest) });
  } else {
    await storeTransactionIsApproval(state.uuid, true);
    return frameTxWriteContractResponse(state.chainId, {
      address: state.tokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [state.spenderAddress, maxUint256], // Always max approve
    });
  }
}
