import { frameResponse } from "@/common/utils/frameResponse";
import { localImageUrl, relativeEndpointUrl } from "@/utils/urlHelpers";
import { getAddress, isAddressEqual, zeroAddress } from "viem";
import { getLimitedMintData } from "../../../data/queries/getLimitedMintData";
import { readContract } from "viem/actions";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { baseNft } from "@/app/superrare/abis/baseNft";
import { SUPERRARE_CHAIN_CONFIG } from "@/app/superrare/config";
import { Erc20TransactionInputState } from "@/app/erc-20-transaction/types";
import { generateUuid } from "@/common/utils/uuid";

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
              label: `${isAddressEqual(limitedMintData.currency.address, zeroAddress) ? "" : "Approve / "}Mint`,
              action: "tx",
              target: `${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/tx`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/erc-20-transaction/pending`,
            } as FrameButtonMetadata,
          ]
        : []),
    ],
    state: {
      ...({
        chainId: SUPERRARE_CHAIN_CONFIG.client.chain!.id,
        appName: "superrare-limited-mint",

        tokenAddress: limitedMintData.currency.address,
        spenderAddress: SUPERRARE_CHAIN_CONFIG.addresses.superrareMinter,
        tokenAmount: (
          limitedMintData.price +
          (limitedMintData.price * SUPERRARE_CHAIN_CONFIG.superrareNetworkFeePercent) / BigInt(100)
        ).toString(),

        tryAgainFrameUrl: relativeEndpointUrl(req, "/"),

        txFailedImgUrl: localImageUrl("/superrare/transaction/failed.png"),

        approvePendingImgUrl: relativeEndpointUrl(req, `/image/tx/${limitedMintData.tokenId}/approve-pending`),
        approveSuccessImgUrl: relativeEndpointUrl(req, `/image/tx/${limitedMintData.tokenId}/success-approved-rare`),
        actionName: "Mint",

        actionPendingImgUrl: relativeEndpointUrl(req, `/image/tx/${limitedMintData.tokenId}/purchase-pending`),
        actionTxEndpointUrl: relativeEndpointUrl(req, "/tx"),
        actionSuccessImgUrl: relativeEndpointUrl(req, `/image/tx/${limitedMintData.tokenId}/success-collected`),
        actionExitButtonConfig: {
          label: "View Collection",
          action: "link",
          target: href,
        },

        uuid: generateUuid(),
      } as Erc20TransactionInputState),
    },
  });
}

export const GET = response;
export const POST = response;
