import { getAddress } from "viem";
import { fallbackImage } from "./fallbackImage";

export async function GET(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  return fallbackImage(getAddress(params.collectionAddress), BigInt(params.tokenId));
}

export const maxDuration = 300; // Allow up to 5min for first fetch
