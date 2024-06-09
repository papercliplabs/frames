import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { getAddress } from "viem";
import { getLimitedMintData } from "../../../data/queries/getLimitedMintData";
import { readContract } from "viem/actions";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { baseNft } from "@/app/superrare/abis/baseNft";
import { SUPERRARE_CHAIN_CONFIG } from "@/app/superrare/config";

async function response(req: Request, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);

  let limitedMintData = await getLimitedMintData({
    collectionAddress: collectionAddress,
  });

  if (!limitedMintData) {
    const tokenId = await readContract(SUPERRARE_CHAIN_CONFIG.client, {
      address: collectionAddress,
      abi: baseNft,
      functionName: "totalSupply",
    });

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_URL}/superrare/fallback/${collectionAddress}/${tokenId.toString()}`,
      302
    );
  }

  const transactionFlowSearchParams = new URLSearchParams({ successMessage: "You minted it!" });
  const href = `${SUPERRARE_CHAIN_CONFIG.superrareBaseUrl}/releases/${params.collectionAddress.toLowerCase()}`;
  return frameResponse({
    req,
    // browserRedirectUrl: href,
    postUrl: `${process.env.NEXT_PUBLIC_URL}/superrare/limited-mint/${collectionAddress}`,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: "Refresh",
        action: "post",
      },
      { label: "View", action: "link", target: href },
      ...(limitedMintData.isValidForFrameTxn
        ? [
            {
              label: "Mint",
              action: "tx",
              target: relativeEndpointUrl(req, `/tx`),
              postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/superrare?${transactionFlowSearchParams.toString()}`,
            } as FrameButtonMetadata,
          ]
        : []),
    ],
    state: {
      txSuccessTarget: `${process.env.NEXT_PUBLIC_URL}/superrare/fallback/${collectionAddress}/${limitedMintData.tokenId.toString()}`, // Go to the minted artworks frame
      txFailedTarget: req.url,
    },
  });
}

export const GET = response;
export const POST = response;
