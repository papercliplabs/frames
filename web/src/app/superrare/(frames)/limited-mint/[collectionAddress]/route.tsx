import { SUPERRARE_BASE_URL } from "@/app/superrare/utils/constants";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { getAddress } from "viem";
import { getLimitedMintData } from "../../../data/queries/getLimitedMintData";
import { readContract } from "viem/actions";
import { baseNft } from "@/abis/superrare/baseNft";
import { mainnetPublicClient } from "@/utils/wallet";
import { FrameButtonMetadata } from "@coinbase/onchainkit";

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

    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/superrare/fallback/${collectionAddress}/${tokenId}`, 302);
  }

  const href = `${SUPERRARE_BASE_URL}/releases/${params.collectionAddress.toLowerCase()}`;
  return frameResponseWrapper({
    req,
    browserRedirectUrl: href,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    // TODO(spennyp): make txn endpoint
    buttons: [
      { label: "Refresh", action: "post" },
      { label: "View", action: "link", target: href },
      ...(limitedMintData.isValidForFrameTxn
        ? [{ label: "Bid", action: "post", target: href } as FrameButtonMetadata]
        : []),
    ],
  });
}

export const GET = response;
export const POST = response;
