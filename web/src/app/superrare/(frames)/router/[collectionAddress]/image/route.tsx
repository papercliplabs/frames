import { getAddress } from "viem";
import { getArtworkState } from "@/app/superrare/data/queries/getArtworkState";
import { readContract } from "viem/actions";
import { mainnetPublicClient } from "@/utils/wallet";
import { NextRequest } from "next/server";
import { limitedMintImage } from "@/app/superrare/(frames)/limited-mint/[collectionAddress]/image/limitedMintImage";
import { fallbackImage } from "@/app/superrare/(frames)/fallback/[collectionAddress]/[tokenId]/image/fallbackImage";
import { baseNft } from "@/app/superrare/abis/baseNft";
import { buyNowImage } from "@/app/superrare/(frames)/buy-now/[collectionAddress]/[tokenId]/image/buyNowImage";
import { auctionImage } from "../../../auction/[collectionAddress]/[tokenId]/image/auctionImage";
import { errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";

export async function GET(req: NextRequest, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenIdString = req.nextUrl.searchParams.get("tokenId");
  let tokenId = tokenIdString ? BigInt(tokenIdString) : undefined;

  const artworkState = await getArtworkState({ collectionAddress, tokenId });

  if (artworkState == "fallback" && tokenId == undefined) {
    tokenId = await readContract(mainnetPublicClient, {
      address: collectionAddress,
      abi: baseNft,
      functionName: "totalSupply",
    });
  }

  if (artworkState != "limited-mint" && tokenId == undefined) {
    console.log("router image - no tokenId", collectionAddress);
    return errorImageResponse();
  }

  // Route correct dynamic image
  switch (artworkState) {
    case "auction":
      return auctionImage(collectionAddress, tokenId!);
    case "limited-mint":
      return limitedMintImage(collectionAddress);
    case "buy-now":
      return buyNowImage(collectionAddress, tokenId!);
    case "fallback":
      return fallbackImage(collectionAddress, tokenId!);
  }
}

export const maxDuration = 300; // Allow up to 5min for first fetch
