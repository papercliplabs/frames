import { getAddress } from "viem";
import { getArtworkState } from "@/app/superrare/data/queries/getArtworkState";
import { NextRequest } from "next/server";
import { limitedMintImage } from "@/app/superrare/(frames)/limited-mint/[collectionAddress]/image/limitedMintImage";
import { fallbackImage } from "@/app/superrare/(frames)/fallback/[collectionAddress]/[tokenId]/image/fallbackImage";
import { buyNowImage } from "@/app/superrare/(frames)/buy-now/[collectionAddress]/[tokenId]/image/buyNowImage";
import { auctionImage } from "../../../auction/[collectionAddress]/[tokenId]/image/auctionImage";
import { errorImageResponse } from "@/app/superrare/utils/artworkImageResponse";

export async function GET(req: NextRequest, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenIdString = req.nextUrl.searchParams.get("tokenId");
  let tokenId = tokenIdString ? BigInt(tokenIdString) : undefined;

  const artworkState = await getArtworkState({ collectionAddress, tokenId });

  // Superrare frontend forgot to provide fetch tokenId previously for a collection (not release)
  // So we are tracking tip of their main NFT collection, and sucking crazy bandwidth.
  // Throw error for these kind of frames.
  if (artworkState == "fallback" && tokenId == undefined) {
    // tokenId = await readContract(SUPERRARE_CHAIN_CONFIG.client, {
    //   address: collectionAddress,
    //   abi: baseNft,
    //   functionName: "totalSupply",
    // });
    console.log("router image - not limited-mint and no tokenId", collectionAddress);
    return errorImageResponse();
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
