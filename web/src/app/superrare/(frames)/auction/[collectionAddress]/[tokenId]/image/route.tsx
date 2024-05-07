import { getAddress } from "viem";
import { auctionImage } from "./auctionImage";

export async function GET(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  return auctionImage(getAddress(params.collectionAddress), BigInt(params.tokenId));
}

export const maxDuration = 300; // Allow up to 5min for first fetch
