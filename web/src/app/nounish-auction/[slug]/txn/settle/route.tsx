import { NextRequest } from "next/server";
import { nounishAuctionConfigs, SupportedNounishAuctionSlug } from "@/app/nounish-auction/configs";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    // Config
    const config = nounishAuctionConfigs[params.slug as SupportedNounishAuctionSlug];
    if (!config) {
        console.error("No auction config found - ", params.slug);
        return Response.error();
    }

    const txn = config.getSettleTransactionData();
    return Response.json(txn);
}

export const dynamic = "force-dynamic";
