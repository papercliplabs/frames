import { NextRequest, NextResponse } from "next/server";
import { FrameButtonMetadata, FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { transactionFlowConfigs, SupportedTransactionFlowSlug } from "../config";
import { getTransactionReceipt } from "viem/actions";
import { Hex } from "viem";
import { trackEvent } from "@/common/utils/analytics";

export async function GET(req: NextRequest, { params }: { params: { slug: string; hash: string } }): Promise<Response> {
  const config = transactionFlowConfigs[params.slug as SupportedTransactionFlowSlug];

  if (!config) {
    console.error("No config found - ", params.slug);
    return Response.error();
  }

  // Only for testing, should never hit here
  return new NextResponse(
    getFrameHtmlResponse({
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/${params.slug}/image/pending`,
        aspectRatio: "1:1",
      },
      buttons: [{ label: "Refresh", action: "post" }],
    })
  );
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
  const config = transactionFlowConfigs[params.slug as SupportedTransactionFlowSlug];

  if (!config) {
    console.error("No config found - ", params.slug);
    return Response.error();
  }

  const searchParams = req.nextUrl.searchParams;

  const frameRequest: FrameRequest = await req.json();
  let transactionHash: string | null | undefined = frameRequest.untrustedData.transactionId;

  if (!transactionHash) {
    // See if we already stored in search params
    transactionHash = searchParams.get("hash");

    if (!transactionHash) {
      console.error("Missing txn hash - ", frameRequest);
      return Response.error();
    }
  } else {
    // First time, so store for next time
    searchParams.append("hash", transactionHash);
    trackEvent("txn_pending", { slug: params.slug, hash: transactionHash });
  }

  let status: "pending" | "success" | "failed" = "pending";
  try {
    const receipt = await getTransactionReceipt(config.client, {
      hash: transactionHash as Hex,
    });
    status = receipt.status == "success" ? "success" : "failed";
  } catch (e) {
    // Don't have receipt yet, still pending
  }

  let decodedState: { txSuccessTarget?: string; txFailedTarget?: string } | undefined = undefined;
  if (config.deriveTerminalButtonTargetFromState) {
    decodedState = JSON.parse(decodeURIComponent(frameRequest.untrustedData.state));
  }

  let secondButton: FrameButtonMetadata = { label: "Refresh", action: "post" };
  if (status == "success") {
    trackEvent("txn_successful", { slug: params.slug, hash: transactionHash });
    secondButton = config.terminalButtons.success;
    if (config.deriveTerminalButtonTargetFromState && decodedState?.txSuccessTarget) {
      secondButton.target = decodedState.txSuccessTarget;
    }
  } else if (status == "failed") {
    trackEvent("txn_failed", { slug: params.slug, hash: transactionHash });
    secondButton = config.terminalButtons.failed;
    if (config.deriveTerminalButtonTargetFromState && decodedState?.txFailedTarget) {
      secondButton.target = decodedState.txFailedTarget;
    }
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/${
          params.slug
        }/image/${status}?${searchParams.toString()}&t=${Date.now()}`,
        aspectRatio: "1:1",
      },
      buttons: [
        {
          label: "View txn",
          action: "link",
          target: config.client.chain?.blockExplorers?.default.url + `/tx/${transactionHash}`,
        },
        secondButton,
      ],
      postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/${params.slug}?${searchParams.toString()}`,
      state: { ...decodedState },
    })
  );
}

export const dynamic = "force-dynamic";
