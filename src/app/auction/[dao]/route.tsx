import { NextRequest, NextResponse } from "next/server";
import { generateFrameMetadata } from "@/utils/metadata";
import { track } from "@vercel/analytics/server";
import { SupportedAuctionDao, auctionConfigs } from "../daoConfig";

export async function GET(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    const config = auctionConfigs[params.dao as SupportedAuctionDao];

    if (!config) {
        console.error("No auction config found - ", params.dao);
    }

    return new NextResponse(
        generateFrameMetadata({
            image: config.firstPageImage,
            buttonInfo: [{ title: "View auction!", action: "post" }],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}`,
            ogTitle: config.title,
            ogDescription: config.description,
        })
    );
}

export async function POST(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    const config = auctionConfigs[params.dao as SupportedAuctionDao];

    if (!config) {
        console.error("No auction config found - ", params.dao);
    }

    try {
        const reqJson = await req.json();
        const buttonIndex = reqJson["untrustedData"]["buttonIndex"];

        if (buttonIndex == 2) {
            await track("auction-bid", {
                dao: params.dao,
            });
            return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/redirects/${config.auctionUrl}`, 302);
        }
    } catch {}

    await track("nouns-auction-refresh", {
        dao: params.dao,
    });

    // Hack to prevent image caching
    const rnd = Math.random();

    return new NextResponse(
        generateFrameMetadata({
            image: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}/img/status?${rnd}`,
            buttonInfo: [
                { title: "Refresh", action: "post" },
                { title: "Bid", action: "post_redirect" },
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}`,
            ogTitle: config.title,
            ogDescription: config.description,
        })
    );
}

export const dynamic = "force-dynamic";
