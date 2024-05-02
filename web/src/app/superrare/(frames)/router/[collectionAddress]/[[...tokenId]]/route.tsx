import { getAddress } from "viem";

async function response(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId?: string[] } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = params.tokenId?.[0];

  // Route to auction or mint, they each handle hitting fallback if states are not valid
  if (!tokenId) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/superrare/limited-mint/${collectionAddress}`, 302);
  } else {
    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/superrare/auction/${collectionAddress}/${tokenId}`, 302);
  }
}

export const GET = response;
export const POST = response;
