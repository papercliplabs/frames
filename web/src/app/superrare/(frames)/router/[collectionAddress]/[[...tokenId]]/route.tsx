import { getArtworkState } from "@/app/superrare/data/queries/getArtworkState";
import { SUPERRARE_BASE_URL } from "@/app/superrare/utils/constants";
import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { FrameRequest } from "@coinbase/onchainkit/frame";
import { getAddress } from "viem";

async function response(
  req: Request,
  { params }: { params: { collectionAddress: string; tokenId?: string[] } }
): Promise<Response> {
  const collectionAddress = getAddress(params.collectionAddress);
  const tokenId = params.tokenId?.[0] ? BigInt(params.tokenId?.[0]) : undefined;

  if (req.method == "POST") {
    const frameRequest: FrameRequest = await req.json();

    // Interact button
    if (frameRequest.untrustedData.buttonIndex == 1) {
      const artworkState = await getArtworkState({ collectionAddress, tokenId });

      switch (artworkState) {
        case "auction":
          return Response.redirect(
            `${process.env.NEXT_PUBLIC_URL}/superrare/auction/${collectionAddress}/${tokenId?.toString()}`,
            302
          );
        case "limited-mint":
          return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/superrare/limited-mint/${collectionAddress}`, 302);
        case "buy-now":
          return Response.redirect(
            `${process.env.NEXT_PUBLIC_URL}/superrare/buy-now/${collectionAddress}/${tokenId?.toString()}`,
            302
          );
        case "fallback":
          if (tokenId != undefined) {
            return Response.redirect(
              `${process.env.NEXT_PUBLIC_URL}/superrare/fallback/${collectionAddress}/${tokenId.toString()}`,
              302
            );
          } else {
            // Push fallback through limited mint if no tokenId, since it handles fetching tokenId and redirecting
            return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/superrare/limited-mint/${collectionAddress}`, 302);
          }
      }
    }
  }

  return frameResponseWrapper({
    req,
    postUrl: `${process.env.NEXT_PUBLIC_URL}/superrare/router/${collectionAddress}/${tokenId ? tokenId.toString() : ""}`,
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}/superrare/router/${collectionAddress}/image?t=${Date.now()}${tokenId != undefined ? `&tokenId=${tokenId.toString()}` : ""}`,
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: "Continue",
        action: "post",
      },
    ],
  });
}

export const GET = response;
export const POST = response;
