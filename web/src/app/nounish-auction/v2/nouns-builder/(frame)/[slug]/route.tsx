import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { SupportedNounsBuilderDao, nounsBuilderAuctionConfigs } from "../../configs";

async function response(req: Request, { params }: { params: { slug: string } }): Promise<Response> {
  const config = nounsBuilderAuctionConfigs[params.slug as SupportedNounsBuilderDao];

  if (!config) {
    console.error("No auction config found - ", params.slug);
    return Response.error();
  }

  const transactionFlowSearchParams = new URLSearchParams({ successMessage: "Your bid was submitted!" });
  return frameResponse({
    req,
    browserRedirectUrl: config.frontendUrl,
    ogTitle: params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    input: { text: "Enter ETH bid amount" },
    buttons: [
      {
        label: "Refresh",
        action: "post",
      },
      { label: "View", action: "link", target: config.frontendUrl },
      {
        label: "Bid",
        action: "tx",
        target: relativeEndpointUrl(req, "/tx/bid"),
        postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/${config.transactionFlowSlug}?${transactionFlowSearchParams.toString()}`,
      },
    ],
    state: {
      txSuccessTarget: req.url,
      txFailedTarget: req.url,
    },
  });
}

export const GET = response;
export const POST = response;
