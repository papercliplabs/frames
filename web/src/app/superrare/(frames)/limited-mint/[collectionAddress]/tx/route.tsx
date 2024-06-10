import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { getAddress, isAddressEqual, zeroAddress } from "viem";
import { rareMinterAbi } from "@/app/superrare/abis/rareMinter";
import { getLimitedMintDataUncached } from "@/app/superrare/data/queries/getLimitedMintData";
import { readContract } from "viem/actions";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { frameErrorResponse, frameTxWriteContractResponse } from "@/common/utils/frameResponse";
import { SUPERRARE_CHAIN_CONFIG } from "@/app/superrare/config";

export async function POST(req: NextRequest, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const frameRequest: FrameRequest = await req.json();

  const [frameValidationResponse, limitedMintData] = await Promise.all([
    getFrameMessageWithNeynarApiKey(frameRequest),
    getLimitedMintDataUncached({ collectionAddress }),
  ]);

  const userAddressString = frameValidationResponse?.message?.address;

  if (!frameValidationResponse.isValid || !limitedMintData || !userAddressString) {
    console.error(
      "limited-mint tx endpoint: invalid frame request - ",
      collectionAddress,
      frameRequest,
      userAddressString,
      limitedMintData
    );
    return frameErrorResponse("Error: Invalid frame request");
  }

  const userAddress = getAddress(userAddressString);

  const [userMintCount, userTxnCount] = await Promise.all([
    readContract(SUPERRARE_CHAIN_CONFIG.client, {
      address: SUPERRARE_CHAIN_CONFIG.addresses.superrareMinter,
      abi: rareMinterAbi,
      functionName: "getContractMintsPerAddress",
      args: [collectionAddress, userAddress],
    }),
    readContract(SUPERRARE_CHAIN_CONFIG.client, {
      address: SUPERRARE_CHAIN_CONFIG.addresses.superrareMinter,
      abi: rareMinterAbi,
      functionName: "getContractTxsPerAddress",
      args: [collectionAddress, userAddress],
    }),
  ]);

  const soldOut = limitedMintData.currentSupply >= limitedMintData.maxSupply;
  const hitMintLimit =
    limitedMintData.maxMintsPerAddress != BigInt(0) && userMintCount >= limitedMintData.maxMintsPerAddress;
  const hitTxnLimit =
    limitedMintData.txnLimitPerAddress != BigInt(0) && userTxnCount >= limitedMintData.txnLimitPerAddress;

  const errorMessage = soldOut
    ? "Error: Sold out"
    : hitMintLimit
      ? "Error: At user mint limit"
      : hitTxnLimit
        ? "Error: At user txn limit for mint"
        : undefined;
  if (errorMessage) {
    return frameErrorResponse(errorMessage);
  }

  const priceWithFee =
    limitedMintData.price + (limitedMintData.price * SUPERRARE_CHAIN_CONFIG.superrareNetworkFeePercent) / BigInt(100);

  return frameTxWriteContractResponse(SUPERRARE_CHAIN_CONFIG.client.chain!.id, {
    abi: rareMinterAbi,
    address: SUPERRARE_CHAIN_CONFIG.addresses.superrareMinter,
    functionName: "mintDirectSale",
    args: [collectionAddress, limitedMintData.currency.address, limitedMintData.price, 1, []],
    value: isAddressEqual(limitedMintData.currency.address, zeroAddress) ? priceWithFee : BigInt(0),
  });
}
