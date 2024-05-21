import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { base } from "viem/chains";
import { encodeFunctionData, erc20Abi, getAddress } from "viem";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse } from "@/utils/frameErrorResponse";
import { readContract } from "viem/actions";
import { basePublicClient } from "@/utils/wallet";

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

  const userAddressString = frameValidationResponse?.message?.address;

  if (!frameValidationResponse.isValid || !userAddressString) {
    console.error("ERROR tx endpoint: invalid frame request - ", frameRequest, userAddressString);
    return frameErrorResponse("Error: Invalid frame request");
  }

  const userAddress = getAddress(userAddressString);

  const allowance = await readContract(basePublicClient, {
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    abi: erc20Abi,
    functionName: "allowance",
    args: [userAddress, "0x267B3d36f6927928BdeaE220Aa525E21e1ACf0e7"],
  });

  console.log("ALLOW", allowance);

  let txResponse: FrameTransactionResponse;
  if (allowance < BigInt(10003)) {
    // Approve
    txResponse = {
      chainId: `eip155:${base.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: erc20Abi,
        to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "approve",
          args: ["0x267B3d36f6927928BdeaE220Aa525E21e1ACf0e7", BigInt(10003)],
        }),
        value: BigInt(0).toString(),
      },
    };
  } else {
    // Send
    txResponse = {
      chainId: `eip155:${base.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: [],
        to: "0x267B3d36f6927928BdeaE220Aa525E21e1ACf0e7",
        value: BigInt(1).toString(),
      },
    };
  }

  return Response.json(txResponse);
}
