import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { basePublicClient } from "@/utils/wallet";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { log } from "console";
import { Hex } from "viem";
import { getTransactionReceipt } from "viem/actions";

async function response(req: Request): Promise<Response> {
  const frameRequest: FrameRequest = await req.json();
  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);
  console.log(frameRequest.untrustedData);
  const decodedState = frameRequest.untrustedData.state
    ? JSON.parse(decodeURIComponent(frameRequest.untrustedData.state))
    : {};

  const userAddress = frameValidationResponse.message?.address ?? decodedState["userAddress"];
  const hash = frameValidationResponse.message?.transaction?.hash ?? decodedState["hash"];

  let status: "pending" | "success" | "failed" = "pending";
  let isApproval = false;
  try {
    const receipt = await getTransactionReceipt(basePublicClient, {
      hash: hash as Hex,
    });
    status = receipt.status == "success" ? "success" : "failed";

    const logs = receipt.logs;
    if (logs.length > 0) {
      isApproval = true; // TODO: dumb check for now
    }
    console.log("LOG", logs);
  } catch (e) {
    // Don't have receipt yet, still pending
  }

  if (status == "success") {
    if (isApproval) {
      return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/test?approved=1`, 302);
    } else {
      return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/test/done`, 302);
    }
  }

  console.log("STAT", hash, status);

  return frameResponseWrapper({
    req,
    postUrl: relativeEndpointUrl(req, ""),
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/frame-restricted.png`,
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: "refresh",
        action: "post",
      },
    ],
    state: {
      hash,
      userAddress,
    },
  });
}

export const GET = response;
export const POST = response;
