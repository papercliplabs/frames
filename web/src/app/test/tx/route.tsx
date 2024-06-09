import { NextRequest } from "next/server";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { baseSepolia, sepolia } from "viem/chains";

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest = await req.json();
  console.log("HERE", frameRequest);
  const txResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: [],
      to: "0x267B3d36f6927928BdeaE220Aa525E21e1ACf0e7",
      value: BigInt(100).toString(),
    },
  } as FrameTransactionResponse;

  return Response.json(txResponse);
}
