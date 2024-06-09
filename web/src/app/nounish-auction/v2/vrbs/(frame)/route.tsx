import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";

const FRONTEND_AUCTION_URL = "https://vrbs.build/";

async function response(req: Request): Promise<Response> {
  const transactionFlowSearchParams = new URLSearchParams({ successMessage: "Your bid was submitted!" });
  return frameResponse({
    req,
    browserRedirectUrl: FRONTEND_AUCTION_URL,
    postUrl: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v2/vrbs`,
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
      { label: "View", action: "link", target: FRONTEND_AUCTION_URL },
      {
        label: "Bid",
        action: "tx",
        target: relativeEndpointUrl(req, "/tx"),
        postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/vrbs-auction?${transactionFlowSearchParams.toString()}`,
      } as FrameButtonMetadata,
    ],
  });
}

export const GET = response;
export const POST = response;
