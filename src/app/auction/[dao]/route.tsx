import { NextRequest, NextResponse } from "next/server";
import { generateFrameMetadata, FrameButtonInfo } from "@/utils/metadata";
import { track } from "@vercel/analytics/server";
import { SupportedAuctionDao, auctionConfigs } from "../daoConfig";
import { extractComposableQueryParams } from "@/utils/composableParams";

export async function GET(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    const config = auctionConfigs[params.dao as SupportedAuctionDao];

    if (!config) {
        console.error("No auction config found - ", params.dao);
    }

    return new NextResponse(
        generateFrameMetadata({
            image: config.firstPageImage,
            buttonInfo: [{ title: "View auction!", action: "post" }],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}?${req.nextUrl.searchParams.toString()}`,
            ogTitle: config.title,
            ogDescription: config.description,
        })
    );
}

export async function POST(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    const config = auctionConfigs[params.dao as SupportedAuctionDao];
    const { composeFrameUrl, composeFrameButtonLabel } = extractComposableQueryParams(req.nextUrl.searchParams);

    if (!config) {
        console.error("No auction config found - ", params.dao);
    }

    try {
        const reqJson = await req.json();
        const buttonIndex = reqJson["untrustedData"]["buttonIndex"];

        if (buttonIndex == 3 && composeFrameUrl && composeFrameButtonLabel) {
            return Response.redirect(composeFrameUrl);
        }
    } catch {}

    await track("nouns-auction-refresh", {
        dao: params.dao,
    });

    const composeButton: FrameButtonInfo | undefined =
        composeFrameUrl && composeFrameButtonLabel ? { title: composeFrameButtonLabel, action: "post" } : undefined;

    // Hack to prevent image caching
    const rnd = Math.random();

    return new NextResponse(
        generateFrameMetadata({
            image: `${process.env.NEXT_PUBLIC_URL}/auction/${
                params.dao
            }/img/status?${req.nextUrl.searchParams.toString()}&rnd=${rnd}`,
            buttonInfo: [
                { title: "Refresh", action: "post" },
                { title: "Bid", action: "link", redirectUrl: config.auctionUrl },
                composeButton,
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}?${req.nextUrl.searchParams.toString()}`,
            ogTitle: config.title,
            ogDescription: config.description,
        })
    );
}

export const dynamic = "force-dynamic";
