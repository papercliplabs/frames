import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { SUPERRARE_CHAIN_CONFIG } from "@/app/superrare/config";
import { getAddress, isAddressEqual, zeroAddress } from "viem";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse, frameTxWriteContractResponse } from "@/common/utils/frameResponse";
import { bazaarAbi } from "@/app/superrare/abis/bazaar";
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

  const priceWithFee =
    buyNowData.price + (buyNowData.price * SUPERRARE_CHAIN_CONFIG.superrareNetworkFeePercent) / BigInt(100);

  return frameTxWriteContractResponse(SUPERRARE_CHAIN_CONFIG.client.chain!.id, {
    abi: bazaarAbi,
    address: SUPERRARE_CHAIN_CONFIG.addresses.superrareBazaar,
    functionName: "buy",
    args: [collectionAddress, tokenId, buyNowData.currency.address, buyNowData.price],
    value: isAddressEqual(buyNowData.currency.address, zeroAddress) ? priceWithFee : BigInt(0),
  });
}
