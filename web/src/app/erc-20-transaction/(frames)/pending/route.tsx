import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { getTransactionReceipt } from "viem/actions";
import { extractAndValidateState } from "../../utils/validation";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { getClientForChainId } from "@/common/utils/walletClients";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { Hex } from "viem";
import { getIsTransactionApproval } from "../../data/transactionStorage";
import { trackEvent } from "@/common/utils/analytics";

export async function POST(req: NextRequest): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

  if (!frameValidationResponse.isValid) {
    throw Error("Invalid frame request");
  }

  const state = extractAndValidateState(frameValidationResponse.message);
  const client = getClientForChainId(state.chainId);
  const transactionHash = (frameValidationResponse.message.transaction?.hash ?? state.transactionHash) as
    | Hex
    | undefined;

  if (!transactionHash) {
    throw Error(`Missing txn hash - ${transactionHash}`);
  }

  let isApproval = await getIsTransactionApproval(state.uuid);

  // Only track if its the first entry
  if (frameValidationResponse.message.transaction?.hash) {
    trackEvent("txn_pending", { hash: transactionHash, appName: state.appName });
  }

  let status: "pending" | "success" | "failed" = "pending";
  try {
    const receipt = await getTransactionReceipt(client, {
      hash: transactionHash,
    });

    status = receipt.status == "success" ? "success" : "failed";
  } catch (e) {
    // Don't have receipt yet, still pending
  }

  if (status == "success") {
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/success`);
  } else if (status == "failed") {
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/failed`);
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image: {
        src: isApproval ? state.approvePendingImgUrl : state.actionPendingImgUrl,
        aspectRatio: "1:1",
      },
      buttons: [
        {
          label: "View txn",
          action: "link",
          target: client.chain?.blockExplorers?.default.url + `/tx/${transactionHash}`,
        },
        {
          label: "Refresh",
          action: "post",
          target: relativeEndpointUrl(req, "/"),
        },
      ],
      state: {
        ...state,
        transactionHash,
        isApproval,
      },
    })
  );
}

export const dynamic = "force-dynamic";
