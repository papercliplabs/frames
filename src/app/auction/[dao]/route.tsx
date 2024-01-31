import { NextRequest, NextResponse } from "next/server";
import { generateFrameMetadata } from "@/utils/metadata";
import { track } from "@vercel/analytics/server";
import { SupportedAuctionDao, auctionConfigs } from "../daoConfig";
import { getAuctionDetails } from "../getAuctionDetails";

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

        await track("auction-bid", {
            dao: params.dao,
        });

        if (buttonIndex == 2) {
            return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/redirects/${config.auctionUrl}`, 302);
        }
    } catch {}

    const { nounId, nounImgSrc, timeRemaining, bidFormatted, bidder } = await getAuctionDetails({
        client: config.client,
        auctionAddress: config.auctionAddress,
        tokenAddress: config.tokenAddress,
        type: config.daoType,
    });

    const urlParams = new URLSearchParams([
        ["id", nounId.toString()],
        ["nounImgSrc", nounImgSrc],
        ["time", timeRemaining],
        ["bid", bidFormatted],
        ["bidder", bidder],
        ["collectionName", config.tokenNamePrefix],
        ["fontType", config.style.fontType],
        ["backgroundColor", config.style.backgroundColor],
        ["textColor", config.style.textColor],
    ]);

    await track("nouns-auction-refresh", {
        dao: params.dao,
    });

    return new NextResponse(
        generateFrameMetadata({
            image: `${process.env.NEXT_PUBLIC_URL}/auction/${params.dao}/img/status?${urlParams.toString()}`,
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
