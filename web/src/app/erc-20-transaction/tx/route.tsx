import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { frameErrorResponse, frameTxWriteContractResponse } from "@/common/utils/frameResponse";
import { erc20Abi, getAddress, isAddressEqual, maxUint256, zeroAddress } from "viem";
import { multicall } from "viem/actions";
import { extractAndValidateState } from "../utils/validation";
import { getClientForChainId } from "@/common/utils/walletClients";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";

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

  const [allowance, balance] = await multicall(client, {
    contracts: [
      {
        abi: erc20Abi,
        address: state.tokenAddress,
        functionName: "allowance",
        args: [userAddress, state.spenderAddress],
      },
      {
        abi: erc20Abi,
        address: state.tokenAddress,
        functionName: "balanceOf",
        args: [userAddress],
      },
    ],
    allowFailure: false,
  });

  if (balance < BigInt(state.tokenAmount)) {
    return frameErrorResponse("Error: Insufficient balance");
  }

  const requiresApproval = allowance < BigInt(state.tokenAmount);

  if (!requiresApproval) {
    return await fetch(state.actionTxEndpointUrl, { method: "POST", body: JSON.stringify(frameRequest) });
  } else {
    return frameTxWriteContractResponse(state.chainId, {
      address: state.tokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [state.spenderAddress, maxUint256], // Always max approve
    });
  }
}
