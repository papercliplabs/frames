import { CHAIN_FOR_ID } from "@/app/nounswap/config";
import { trackEvent } from "@/common/utils/analytics";
import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameRequest } from "@coinbase/onchainkit/frame";

async function response(
  req: Request,
  { params }: { params: { chainId: string; nounId: string; txHash: string } }
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
      trackEvent("link_clicked", { app: "nounswap/noun", nounId: params.nounId });
      return Response.redirect(`https://www.nounswap.wtf/explore?nounId=${params.nounId}`, 302);
    }
  }

  return frameResponse({
    req,
    browserRedirectUrl: `https://www.nounswap.wtf/explore?nounId=${params.nounId}`,
    ogTitle: "NounSwap Noun",
    appName: "nounswap/noun",
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: relativeEndpointUrl(req, `/image`), // Allow caching :)Allow caching :)Allow caching :)Allow caching :)
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: `Noun ${params.nounId}`,
        action: "post_redirect",
      },
    ],
  });
}

export const GET = response;
export const POST = response;
