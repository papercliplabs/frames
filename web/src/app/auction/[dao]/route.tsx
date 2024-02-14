import { NextRequest, NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";
import { SupportedAuctionDao, auctionConfigs } from "../daoConfig";
import { extractComposableQueryParams, getComposeResponse } from "@/utils/composableParams";
import { FrameButtonMetadata, getFrameHtmlResponse } from "@coinbase/onchainkit";

export async function GET(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    const config = auctionConfigs[params.dao as SupportedAuctionDao];

    if (!config) {
        console.error("No auction config found - ", params.dao);
        return Response.error();
    }

    return new NextResponse(
        getFrameHtmlResponse({
            image: config.firstPageImage,
            buttons: [
                {
                    label: "View auction!",
                    action: "post",
                },
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}?${req.nextUrl.searchParams.toString()}`,
            ogTitle: config.title,
            ogDescription: config.description,
        })
    );
}

export async function POST(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    const config = auctionConfigs[params.dao as SupportedAuctionDao];
    const { composeFrameUrl, composeFrameButtonLabel, composing } = extractComposableQueryParams(
        req.nextUrl.searchParams
    );

    if (!config) {
        console.error("No auction config found - ", params.dao);
        return Response.error();
    }

    try {
        const request = await req.json();
        const buttonIndex = request["untrustedData"]["buttonIndex"];

        if (buttonIndex == 3 && composeFrameUrl && composeFrameButtonLabel && !composing) {
            const composeResponse = await getComposeResponse(composeFrameUrl, request);
            return new NextResponse(composeResponse);
        }
    } catch {}

    await track("nouns-auction-refresh", {
        dao: params.dao,
    });

    const composeButton: FrameButtonMetadata | undefined =
        composeFrameUrl && composeFrameButtonLabel ? { label: composeFrameButtonLabel, action: "post" } : undefined;

    return new NextResponse(
        getFrameHtmlResponse({
            image: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}/img/status?t=${Date.now()}`,
            buttons: [
                { label: "Refresh", action: "post" },
                { label: "Bid", action: "link", target: config.auctionUrl },
                ...(composeButton ? [composeButton] : []),
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}?${req.nextUrl.searchParams.toString()}`,
            ogTitle: config.title,
            ogDescription: config.description,
        })
    );
}
