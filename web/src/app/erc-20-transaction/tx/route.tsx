import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse, frameTxWriteContractResponse } from "@/common/utils/frameResponse";
import { Address, Client, erc20Abi, getAddress } from "viem";
import { getClientForChainId } from "@/common/utils/walletClients";
import { readContract } from "viem/actions";
import { Erc20TransactionInputState } from "../types";

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);
  const userAddressString = frameValidationResponse?.message?.address;

  let userAddress: Address;
  let tokenAddress: Address;
  let spenderAddress: Address;
  let tokenAmount: bigint;
  let chainId: number;
  let targetTxUrl: string;
  let client: Client;
  let error: string | undefined;
  try {
    const decodedState = JSON.parse(
      decodeURIComponent(frameValidationResponse!.message!.state.serialized)
    ) as Erc20TransactionInputState;

    userAddress = getAddress(userAddressString!);
    tokenAddress = getAddress(decodedState.tokenAddress);
    spenderAddress = getAddress(decodedState.spenderAddress);
    tokenAmount = BigInt(decodedState.tokenAmount);
    chainId = decodedState.chainId;
    targetTxUrl = decodedState.targetTxUrl;
    client = getClientForChainId(chainId);

    if (chainId == undefined) {
      throw Error("Missing chainId");
    }

    if (targetTxUrl == undefined) {
      throw Error("Missing chainId");
    }

    if (!frameValidationResponse.isValid) {
      throw Error("Invalid frame request");
    }
  } catch (err: unknown) {
    let errorLog = `Error: Invalid frame request - ${frameRequest}, ${userAddressString}, ${error}`;
    if (err instanceof Error) {
      errorLog += `- ${err.message}`;
    }
    console.error(errorLog);
    return frameErrorResponse("Error: Invalid frame request");
  }

  const allowance = await readContract(client, {
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [userAddress, spenderAddress],
  });

  const requiresApproval = allowance < tokenAmount;

  if (!requiresApproval) {
    return await fetch(targetTxUrl, { method: "POST", body: JSON.stringify(frameRequest) });
  } else {
    return frameTxWriteContractResponse(chainId, {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [spenderAddress, tokenAmount],
    });
  }
}
