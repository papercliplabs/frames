import { NextRequest, NextResponse } from "next/server";
import { FrameButtonMetadata, FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { Hex, erc20Abi, parseEventLogs } from "viem";
import { getClientForChainId } from "@/common/utils/walletClients";
import { getTransactionReceipt } from "viem/actions";
import { extractAndValidateState } from "../../utils/validation";
import { sendAnalyticsEvent } from "@/common/utils/analytics";

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

  if (!frameValidationResponse.isValid) {
    throw Error("Invalid frame request");
  }

  const state = await extractAndValidateState(frameValidationResponse.message);
  const client = await getClientForChainId(state.chainId);
  const transactionHash = (frameValidationResponse.message.transaction?.hash ?? state.transactionHash) as
    | Hex
    | undefined;

  if (!transactionHash) {
    throw Error("Missing txn hash");
  }

  sendAnalyticsEvent("txn_success", { hash: transactionHash, appName: state.appName });

  const receipt = await getTransactionReceipt(client, {
    hash: transactionHash,
  });

  let txWasApprove = false;
  try {
    const logs = parseEventLogs({ abi: erc20Abi, logs: receipt.logs });
    txWasApprove = logs.length == 1 && logs[0].eventName == "Approval";
  } catch (e) {
    // Error parsing, not an approval
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image: {
        src: txWasApprove ? state.approveSuccessImgUrl : state.actionSuccessImgUrl,
        aspectRatio: "1:1",
      },
      buttons: [
        {
          label: "View txn",
          action: "link",
          target: client.chain?.blockExplorers?.default.url + `/tx/${transactionHash}`,
        },
        ...(txWasApprove
          ? [
              {
                label: state.actionName,
                action: "tx",
                target: `${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/tx`,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/pending`,
              } as FrameButtonMetadata,
            ]
          : [state.actionExitButtonConfig]),
      ],
      state: {
        ...state,
        transactionHash: undefined, // Clear the hash
      },
    })
  );
}
