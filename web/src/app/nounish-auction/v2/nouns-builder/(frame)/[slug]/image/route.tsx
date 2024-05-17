import { SupportedNounsBuilderDao, nounsBuilderAuctionConfigs } from "../../../configs";
import { getCurrentAuction } from "@/common/nounsBuilder/data/getCurrentAuction";
import { getToken } from "@/common/nounsBuilder/data/getToken";

export async function GET(req: Request, { params }: { params: { slug: string } }): Promise<Response> {
  const config = nounsBuilderAuctionConfigs[params.slug as SupportedNounsBuilderDao];

  if (!config) {
    console.error("No auction config found - ", params.slug);
    return Response.error();
  }

  const auction = await getCurrentAuction({ client: config.client, collectionAddress: config.collectionAddress });
  const token = await getToken({
    client: config.client,
    collectionAddress: config.collectionAddress,
    tokenId: auction.tokenId,
  });

  return config.imageResponse(token, auction);
}
