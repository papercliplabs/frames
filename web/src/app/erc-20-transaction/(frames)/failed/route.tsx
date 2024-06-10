import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { extractAndValidateState } from "../../utils/validation";
import { getClientForChainId } from "@/common/utils/walletClients";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { Hex } from "viem";
import { track } from "@vercel/analytics/server";

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

  await track("txn-failed", { hash: transactionHash, appName: state.appName });

  return new NextResponse(
    getFrameHtmlResponse({
      image: {
        src: state.txPendingImgUrl,
        aspectRatio: "1:1",
      },
      buttons: [
        {
          label: "View txn",
          action: "link",
          target: client.chain?.blockExplorers?.default.url + `/tx/${transactionHash}`,
        },
        {
          label: "Try again",
          action: "post",
          target: state.tryAgainFrameUrl,
        },
      ],
    })
  );
}

export const dynamic = "force-dynamic";
