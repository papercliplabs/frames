import { NextRequest, NextResponse } from "next/server";
import { SupportedAuctionDao, auctionConfigs } from "../daoConfig";
import { getFrameHtmlResponse } from "@coinbase/onchainkit/frame";

async function response(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
  const dao = params.dao;

  const config = auctionConfigs[dao as SupportedAuctionDao];

  if (!config) {
    console.error("No auction config found - ", dao);
    return Response.error();
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v0/${dao}/img/status?t=${Date.now()}`,
      buttons: [
        { label: "Refresh", action: "post" },
        { label: "Auction", action: "link", target: config.auctionUrl },
      ],
      postUrl: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/v0/${dao}`,
      ogTitle: config.title,
      ogDescription: config.description,
    })
  );
}

export const GET = response;
export const POST = response;

export const dynamic = "force-dynamic";
