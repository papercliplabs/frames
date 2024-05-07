import { getAddress } from "viem";
import { limitedMintImage } from "./limitedMintImage";

export async function GET(req: Request, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  return limitedMintImage(getAddress(params.collectionAddress));
}

export const maxDuration = 300; // Allow up to 5min for first fetch
