import { frameResponse } from "@/common/utils/frameResponse";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { getAddress, isAddressEqual, zeroAddress } from "viem";
import { getLimitedMintData } from "../../../data/queries/getLimitedMintData";
import { readContract } from "viem/actions";
import { FrameButtonMetadata, FrameRequest } from "@coinbase/onchainkit/frame";
import { baseNft } from "@/app/superrare/abis/baseNft";
import { SUPERRARE_CHAIN_CONFIG } from "@/app/superrare/config";
import { Erc20TransactionInputState } from "@/app/erc-20-transaction/types";

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

  let didApprove = false;
  try {
    const frameRequest: FrameRequest = await req.json();
    const decodedState = JSON.parse(decodeURIComponent(frameRequest.untrustedData.state));

    didApprove = decodedState["transactionHash"] != undefined;
  } catch (e) {
    // Ignore
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
              label: `${didApprove || isAddressEqual(limitedMintData.currency.address, zeroAddress) ? "" : "Approve / "}Mint`, // TODO: approve / mint
              action: "tx",
              target: `${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/tx`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/superrare?${transactionFlowSearchParams.toString()}`,
            } as FrameButtonMetadata,
          ]
        : []),
    ],
    state: {
      txSuccessTarget: `${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/router`,
      txFailedTarget: relativeEndpointUrl(req, "/"),
      ...({
        chainId: SUPERRARE_CHAIN_CONFIG.client.chain!.id,
        tokenAddress: limitedMintData.currency.address,
        spenderAddress: SUPERRARE_CHAIN_CONFIG.addresses.superrareMinter,
        tokenAmount: (
          BigInt(5) + // TODO: remove this piece (testing only)
          limitedMintData.price +
          (limitedMintData.price * SUPERRARE_CHAIN_CONFIG.superrareNetworkFeePercent) / BigInt(100)
        ).toString(),
        targetTxUrl: relativeEndpointUrl(req, "/tx"),

        entryFrameUrl: relativeEndpointUrl(req, "/"),
        exitFrameUrl: `${process.env.NEXT_PUBLIC_URL}/superrare/fallback/${collectionAddress}/${limitedMintData.tokenId.toString()}`, // Go to the minted artworks frame
      } as Erc20TransactionInputState),
    },
  });
}

export const GET = response;
export const POST = response;
