import { NextRequest, NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";
import { SupportedAuctionDao, auctionConfigs } from "../daoConfig";
import { extractComposableQueryParams, getComposeResponse } from "@/utils/composableParams";
import { FrameButtonMetadata, FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit";

async function response(dao: string, searchParams: URLSearchParams, request?: FrameRequest): Promise<Response> {
    const config = auctionConfigs[dao as SupportedAuctionDao];
    const { composeFrameUrl, composeFrameButtonLabel, composing } = extractComposableQueryParams(searchParams);

    if (!config) {
        console.error("No auction config found - ", dao);
        return Response.error();
    }

    if (request) {
        try {
            const buttonIndex = request["untrustedData"]["buttonIndex"];

            if (buttonIndex == 3 && composeFrameUrl && composeFrameButtonLabel && !composing) {
                const composeResponse = await getComposeResponse(composeFrameUrl, request);
                return new NextResponse(composeResponse);
            }
        } catch {}
    }

    await track("nouns-auction-refresh", {
        dao: dao,
    });

    const composeButton: FrameButtonMetadata | undefined =
        composeFrameUrl && composeFrameButtonLabel ? { label: composeFrameButtonLabel, action: "post" } : undefined;

    searchParams.set("t", Date.now().toString());

    return new NextResponse(
        getFrameHtmlResponse({
            image: `${process.env.NEXT_PUBLIC_URL}/auction/${dao}/img/status?t=${Date.now()}`,
            buttons: [
                { label: "Refresh", action: "post" },
                { label: "Auction", action: "link", target: config.auctionUrl },
                ...(composeButton ? [composeButton] : []),
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/${dao}?${searchParams.toString()}`,
            ogTitle: config.title,
            ogDescription: config.description,
        })
    );
}

export async function GET(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    return await response(params.dao, req.nextUrl.searchParams, undefined);
}

export async function POST(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    return await response(params.dao, req.nextUrl.searchParams, await req.json());
}

export const dynamic = "force-dynamic";
