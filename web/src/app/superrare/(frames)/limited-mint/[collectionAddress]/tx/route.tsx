import { NextRequest } from "next/server";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { mainnet } from "viem/chains";
import { SUPERRARE_MINTER_PROXY_ADDRESS, SUPERRARE_NETWORK_FEE_PERCENT } from "@/app/superrare/utils/constants";
import { encodeFunctionData, getAddress } from "viem";
import { rareMinterAbi } from "@/abis/superrare/rareMinter";
import { getLimitedMintDataUncached } from "@/app/superrare/data/queries/getLimitedMintData";
import { readContract } from "viem/actions";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { mainnetPublicClient } from "@/utils/wallet";
import { frameErrorResponse } from "@/utils/frameErrorResponse";

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
    readContract(mainnetPublicClient, {
      address: SUPERRARE_MINTER_PROXY_ADDRESS,
      abi: rareMinterAbi,
      functionName: "getContractMintsPerAddress",
      args: [collectionAddress, userAddress],
    }),
    readContract(mainnetPublicClient, {
      address: SUPERRARE_MINTER_PROXY_ADDRESS,
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

  const priceWithFee = limitedMintData.price + (limitedMintData.price * SUPERRARE_NETWORK_FEE_PERCENT) / BigInt(100);

  const txResponse = {
    chainId: `eip155:${mainnet.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: rareMinterAbi,
      to: SUPERRARE_MINTER_PROXY_ADDRESS,
      data: encodeFunctionData({
        abi: rareMinterAbi,
        functionName: "mintDirectSale",
        args: [collectionAddress, limitedMintData.currency.address, limitedMintData.price, 1, []],
      }),
      value: priceWithFee.toString(),
    },
  } as FrameTransactionResponse;

  return Response.json(txResponse);
}
