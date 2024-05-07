import { getAddress } from "viem";
import { getArtworkState } from "@/app/superrare/data/queries/getArtworkState";
import { readContract } from "viem/actions";
import { mainnetPublicClient } from "@/utils/wallet";
import { baseNft } from "@/abis/superrare/baseNft";
import { NextRequest } from "next/server";
import { errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";
import { auctionImage } from "@/app/superrare/(frames)/auction/[collectionAddress]/[tokenId]/image/auctionImage";
import { limitedMintImage } from "@/app/superrare/(frames)/limited-mint/[collectionAddress]/image/limitedMintImage";
import { fallbackImage } from "@/app/superrare/(frames)/fallback/[collectionAddress]/[tokenId]/image/fallbackImage";

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
    case "fallback": // Push fallback through limited mint, since it handles fetching tokenId and redirecting
      return fallbackImage(collectionAddress, tokenId!);
  }
}

export const maxDuration = 300; // Allow up to 5min for first fetch
