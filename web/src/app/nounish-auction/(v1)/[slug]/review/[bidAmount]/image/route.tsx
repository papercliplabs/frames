import { NextRequest } from "next/server";
import { SupportedNounishAuctionSlug, nounishAuctionConfigs } from "../../../../configs";
import { ImageResponse } from "next/og";
import { getDefaultSquareImageOptions } from "@/utils/imageOptions";
import { formatEther } from "viem";
import { formatNumber } from "@/utils/format";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; bidAmount: string } }
): Promise<Response> {
  const config = nounishAuctionConfigs[params.slug as SupportedNounishAuctionSlug];
  if (!config) {
    console.error("No auction config found - ", params.slug);
    return Response.error();
  }

  const data = await customUnstableCache(config.getAuctionData, ["nounish-auction", params.slug], {
    revalidate: 2,
  })();

  const bidAmountFormatted = formatNumber(formatEther(BigInt(params.bidAmount)), 4);
  return new ImageResponse(
    <config.reviewBidComponent {...data} newBidAmount={bidAmountFormatted} />,
    await getDefaultSquareImageOptions(config.fonts)
  );
}

export const dynamic = "force-dynamic";
