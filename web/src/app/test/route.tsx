import { localImageUrl, relativeEndpointUrl } from "@/utils/urlHelpers";
import { frameResponse } from "@/common/utils/frameResponse";
import { baseSepolia } from "viem/chains";
import { getAddress } from "viem";
import { Erc20TransactionInputState } from "../erc-20-transaction/types";
import { FrameRequest } from "@coinbase/onchainkit/frame";

export async function GET(req: Request): Promise<Response> {
  return frameResponse({
    req,
    image: {
      src: localImageUrl("/frame-restricted.png"),
      aspectRatio: "1:1",
    },
    buttons: [{ label: "Continue", action: "post" }],
  });
}

export async function POST(req: Request): Promise<Response> {
  let didApprove = false;
  try {
    const frameRequest: FrameRequest = await req.json();
    const decodedState = JSON.parse(decodeURIComponent(frameRequest.untrustedData.state));

    didApprove = decodedState["transactionHash"] != undefined;
  } catch (e) {
    // Ignore
  }

  return frameResponse({
    req,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}&${didApprove && "did-approve"}`),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Refresh", action: "post" },
      {
        label: `${didApprove ? "" : "Approve / "}Send`,
        action: "tx",
        target: `${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/tx`,
        postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/test`,
      },
    ],
    state: {
      chainId: baseSepolia.id,
      tokenAddress: getAddress("0x081827b8C3Aa05287b5aA2bC3051fbE638F33152"),
      spenderAddress: getAddress("0x267B3d36f6927928BdeaE220Aa525E21e1ACf0e7"),
      tokenAmount: BigInt(1000000000000).toString(),
      targetTxUrl: relativeEndpointUrl(req, "/tx"),

      txSuccessTarget: `${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/router`,
      txFailedTarget: `${process.env.NEXT_PUBLIC_URL}/test`,

      entryFrameUrl: `${process.env.NEXT_PUBLIC_URL}/test`,
      exitFrameUrl: `${process.env.NEXT_PUBLIC_URL}/test/2`,
    } as Erc20TransactionInputState,
  });
}
