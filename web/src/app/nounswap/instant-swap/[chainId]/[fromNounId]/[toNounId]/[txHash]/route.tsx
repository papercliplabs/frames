import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { CHAIN_FOR_ID } from "../../../../../config";

async function response(
  req: Request,
  { params }: { params: { chainId: string; fromNounId: string; toNounId: string; txHash: string } }
): Promise<Response> {
  const chain = CHAIN_FOR_ID[parseInt(params.chainId)];
  if (!chain) {
    console.error("Invalid chainId", params.chainId);
    return Response.error();
  }

  return frameResponse({
    req,
    browserRedirectUrl: "https://nounswap.wtf",
    ogTitle: "NounSwap Swap",
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: "View Tx",
        action: "link",
        target: `${chain.blockExplorers?.default.url}/tx/${params.txHash}`,
      },
      {
        label: "NounSwap",
        action: "link",
        target: "https://nounswap.wtf",
      },
    ],
  });
}

export const GET = response;
export const POST = response;
