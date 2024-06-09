import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { mainnet } from "viem/chains";
import { SUPERRARE_BRAZZER_ADDRESS, SUPERRARE_NETWORK_FEE_PERCENT } from "@/app/superrare/utils/constants";
import { encodeFunctionData, getAddress } from "viem";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse } from "@/common/utils/frameResponse";
import { brazzerAbi } from "@/app/superrare/abis/brazzer";
import { getBuyNowDataUncached } from "@/app/superrare/data/queries/getBuyNowData";

export async function POST(
  req: NextRequest,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = BigInt(params.tokenId);
  const frameRequest: FrameRequest = await req.json();

  const [frameValidationResponse, buyNowData] = await Promise.all([
    getFrameMessageWithNeynarApiKey(frameRequest),
    getBuyNowDataUncached({ collectionAddress, tokenId }),
  ]);

  const userAddressString = frameValidationResponse?.message?.address;

  if (!frameValidationResponse.isValid || !userAddressString) {
    console.error(
      "superrare buy-now tx endpoint: invalid frame request - ",
      collectionAddress,
      frameRequest,
      userAddressString,
      buyNowData
    );
    return frameErrorResponse("Error: Invalid frame request");
  }

  if (!buyNowData) {
    return frameErrorResponse("Error: no longer for sale");
  }

  const priceWithFee = buyNowData.price + (buyNowData.price * SUPERRARE_NETWORK_FEE_PERCENT) / BigInt(100);

  const txResponse = {
    chainId: `eip155:${mainnet.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: brazzerAbi,
      to: SUPERRARE_BRAZZER_ADDRESS,
      data: encodeFunctionData({
        abi: brazzerAbi,
        functionName: "buy",
        args: [collectionAddress, tokenId, buyNowData.currency.address, buyNowData.price],
      }),
      value: priceWithFee.toString(),
    },
  } as FrameTransactionResponse;

  return Response.json(txResponse);
}
