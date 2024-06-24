import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { CHAIN_FOR_ID } from "../../../../../config";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { sendAnalyticsEvent } from "@/common/utils/analytics";

async function response(
  req: Request,
  { params }: { params: { chainId: string; fromNounId: string; toNounId: string; txHash: string } }
): Promise<Response> {
  const chain = CHAIN_FOR_ID[parseInt(params.chainId)];
  if (!chain) {
    console.error("Invalid chainId", params.chainId);
    return Response.error();
  }

  // Handle link clicks with logging
  if (req.method === "POST") {
    const frameRequest: FrameRequest = await req.json();
    if (frameRequest.untrustedData.buttonIndex == 1) {
      sendAnalyticsEvent("link-clicked", { app: "nounswap/instant-swap", label: "View Tx" });
      return Response.redirect(`${chain.blockExplorers?.default.url}/tx/${params.txHash}`, 302);
    } else if (frameRequest.untrustedData.buttonIndex == 2) {
      sendAnalyticsEvent("link-clicked", { app: "nounswap/instant-swap", label: "NounSwap" });
      return Response.redirect("https://nounswap.wtf", 302);
    }
  }

  return frameResponse({
    req,
    browserRedirectUrl: "https://nounswap.wtf",
    ogTitle: "NounSwap Swap",
    appName: "nounswap/instant-swap",
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: "View Tx",
        action: "post_redirect",
      },
      {
        label: "NounSwap",
        action: "post_redirect",
      },
    ],
  });
}

export const GET = response;
export const POST = response;
