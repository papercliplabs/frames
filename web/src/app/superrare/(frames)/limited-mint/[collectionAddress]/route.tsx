import { SUPERRARE_BASE_URL } from "@/app/superrare/utils/constants";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { getAddress } from "viem";
import { getLimitedMintData } from "../../../data/queries/getLimitedMintData";
import { readContract } from "viem/actions";
import { mainnetPublicClient } from "@/utils/wallet";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { baseNft } from "@/app/superrare/abis/baseNft";

async function response(req: Request, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);

  let limitedMintData = await getLimitedMintData({
    collectionAddress: collectionAddress,
  });

  if (!limitedMintData) {
    const tokenId = await readContract(mainnetPublicClient, {
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
  const href = `${SUPERRARE_BASE_URL}/releases/${params.collectionAddress.toLowerCase()}`;
  return frameResponseWrapper({
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
