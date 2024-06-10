import { FrameTransactionResponse, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { detect } from "detect-browser";
import {
  Abi,
  Account,
  Address,
  Chain,
  Client,
  ContractFunctionArgs,
  ContractFunctionName,
  EncodeFunctionDataParameters,
  Transport,
  WriteContractParameters,
  encodeFunctionData,
} from "viem";
import { writeContract } from "viem/actions";

type FrameResponseWrapperParams = {
  req: Request;
  browserRedirectUrl?: string;
} & Parameters<typeof getFrameHtmlResponse>[0];

export function frameResponse({
  req,
  browserRedirectUrl,
  ...getFrameHtmlResponseParams
}: FrameResponseWrapperParams): Response {
  // Handle redirect if clicked on frame
  const browser = detect(req.headers.get("user-agent") ?? "");
  if (browser?.name && browserRedirectUrl) {
    return Response.redirect(browserRedirectUrl);
  }

  return new Response(getFrameHtmlResponse(getFrameHtmlResponseParams));
}

export function frameErrorResponse(message: string): Response {
  return Response.json({ message: message.slice(0, 90) }, { status: 400 });
}

export function frameTxSendNativeResponse(chainId: number, parameters: { to: Address; value: bigint }): Response {
  const { to, value } = parameters;
  return Response.json({
    chainId: `eip155:${chainId}`,
    method: "eth_sendTransaction",
    params: {
      abi: [],
      to,
      value: value.toString(),
    },
  } as FrameTransactionResponse);
}

export function frameTxWriteContractResponse<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
>(
  chainId: number,
  parameters: {
    abi: abi;
    address: Address;
    args: args;
    functionName: functionName;
    value?: bigint;
  }
): Response {
  const { abi, address, args, functionName, value } = parameters;
  const frameTx = {
    chainId: `eip155:${chainId}`,
    method: "eth_sendTransaction",
    params: {
      abi,
      to: address,
      data: encodeFunctionData({
        abi,
        functionName,
        args,
      } as EncodeFunctionDataParameters),
      value: value?.toString() ?? "0",
    },
  } as FrameTransactionResponse;

  return Response.json(frameTx);
}
