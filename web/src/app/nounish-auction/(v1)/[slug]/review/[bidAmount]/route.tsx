import { NextRequest, NextResponse } from "next/server";
import { getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { SupportedNounishAuctionSlug, nounishAuctionConfigs } from "../../../configs";
import { detect } from "detect-browser";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";

// Only get request, since we just redirect to here, and this is terminal
async function response(slug: string, bidAmount: string): Promise<Response> {
  const config = nounishAuctionConfigs[slug as SupportedNounishAuctionSlug];
  if (!config) {
    console.error("No auction config found - ", slug);
    return Response.error();
  }

  // Frame validation
  const data = await customUnstableCache(config.getAuctionData, ["nounish-auction", slug], {
    revalidate: 2,
  })();

  const transactionFlowSearchParams = new URLSearchParams({ successMessage: "Your bid was successfully submitted!" });

  return new NextResponse(
    getFrameHtmlResponse({
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/${slug}/review/${bidAmount}/image?t=${Date.now()}`,
        aspectRatio: "1:1",
      },
      buttons: [
        {
          label: "Back",
          action: "post",
          target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/${slug}`,
        },
        {
          label: "Submit Bid",
          action: "tx",
          target: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/${slug}/txn/bid/${data.nounId}/${bidAmount}`,
          postUrl: `${process.env.NEXT_PUBLIC_URL}/transaction-flow/${
            config.transactionFlowSlug
          }?${transactionFlowSearchParams.toString()}`,
        },
      ],
      state: { testing: 1 },
    })
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string; bidAmount: string } }
): Promise<Response> {
  return await response(params.slug, params.bidAmount);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; bidAmount: string } }
): Promise<Response> {
  return await response(params.slug, params.bidAmount);
}

export const dynamic = "force-dynamic";
