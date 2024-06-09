import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { Hex, erc20Abi, parseEventLogs } from "viem";
import { getClientForChainId } from "@/common/utils/walletClients";
import { getTransactionReceipt } from "viem/actions";
import { Erc20TransactionInputState } from "../types";

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

  const decodedState = JSON.parse(
    decodeURIComponent(frameValidationResponse!.message!.state.serialized)
  ) as Erc20TransactionInputState & { transactionHash: Hex };

  const hash = decodedState.transactionHash;

  const client = getClientForChainId(decodedState.chainId);

  console.log("DEBUG", decodedState);

  const receipt = await getTransactionReceipt(client, {
    hash,
  });

  let txWasApprove = false;
  try {
    const logs = parseEventLogs({ abi: erc20Abi, logs: receipt.logs });
    txWasApprove = logs.length == 1 && logs[0].eventName == "Approval";
  } catch (e) {
    // Error parsing, not an approval
  }

  if (txWasApprove) {
    return Response.redirect(decodedState.entryFrameUrl);
  } else {
    return Response.redirect(decodedState.exitFrameUrl);
  }
}
