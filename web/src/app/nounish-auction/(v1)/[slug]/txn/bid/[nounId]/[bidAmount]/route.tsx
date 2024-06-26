import { NextRequest } from "next/server";
import { SupportedNounishAuctionSlug, nounishAuctionConfigs } from "../../../../../configs";
import { FrameRequest } from "@coinbase/onchainkit/frame";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; nounId: string; bidAmount: string } }
): Promise<Response> {
  const config = nounishAuctionConfigs[params.slug as SupportedNounishAuctionSlug];
  if (!config) {
    console.error("No config found - ", params.slug);
    return Response.error();
  }

  const frameRequest: FrameRequest = await req.json();
  console.log(
    `nounish-auction-bid - ${params.slug}, nounId=${params.nounId}, fid=${frameRequest.untrustedData.fid} bid=${params.bidAmount}`
  );

  const txn = config.getBidTransactionData(BigInt(params.nounId), BigInt(params.bidAmount));
  return Response.json(txn);
}

export const dynamic = "force-dynamic";
