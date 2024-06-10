import { Erc20TransactionInputState } from "@/app/erc-20-transaction/types";
import { getBuyNowData } from "@/app/superrare/data/queries/getBuyNowData";
import { SUPERRARE_CHAIN_CONFIG } from "@/app/superrare/config";
import { frameResponse } from "@/common/utils/frameResponse";
import { localImageUrl, relativeEndpointUrl } from "@/utils/urlHelpers";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { NextRequest } from "next/server";
import { getAddress, isAddressEqual, zeroAddress } from "viem";

async function response(
  req: NextRequest,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = BigInt(params.tokenId);

  const buyNowData = await getBuyNowData({
    collectionAddress: collectionAddress,
    tokenId: tokenId,
  });

  if (!buyNowData) {
    return Response.redirect(
      `${process.env.NEXT_PUBLIC_URL}/superrare/fallback/${collectionAddress}/${tokenId.toString()}`,
      302
    );
  }

  const href = `${SUPERRARE_CHAIN_CONFIG.superrareBaseUrl}/${params.collectionAddress.toLowerCase()}/${params.tokenId}`;
  return frameResponse({
    req,
    image: {
      src: relativeEndpointUrl(req, `/image?t=${Date.now()}`),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "View", action: "link", target: href },
      ...(buyNowData.isValidForFrameTxn
        ? [
            {
              label: `${isAddressEqual(buyNowData.currency.address, zeroAddress) ? "" : "Approve / "}Buy Now`,
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
        appName: "superrare-buy-now",

        tokenAddress: buyNowData.currency.address,
        spenderAddress: SUPERRARE_CHAIN_CONFIG.addresses.superrareBazaar,
        tokenAmount: (
          buyNowData.price +
          (buyNowData.price * SUPERRARE_CHAIN_CONFIG.superrareNetworkFeePercent) / BigInt(100)
        ).toString(),

        tryAgainFrameUrl: relativeEndpointUrl(req, "/"),

        txPendingImgUrl: relativeEndpointUrl(req, "/image/tx/pending"),
        txFailedImgUrl: localImageUrl("/superrare/transaction/failed.png"),

        approveSuccessImgUrl: relativeEndpointUrl(req, "/image/tx/success-approved-rare"),
        actionName: "Buy",

        actionTxEndpointUrl: relativeEndpointUrl(req, "/tx"),
        actionSuccessImgUrl: relativeEndpointUrl(req, "/image/tx/success-collected"),
        actionExitButtonConfig: {
          label: "View Artwork",
          action: "link",
          target: href,
        },
      } as Erc20TransactionInputState),
    },
  });
}

export const GET = response;
export const POST = response;
