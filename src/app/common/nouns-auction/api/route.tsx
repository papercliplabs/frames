import { NextRequest, NextResponse } from "next/server";
import { generateFrameMetadata } from "@/utils/metadata";
import { nounsDaoConfigs, SupportedNounsDao } from "@/utils/nouns";
import { URLSearchParams } from "url";
import { track } from "@vercel/analytics/server";
import { permanentRedirect, redirect } from "next/navigation";

export async function POST(req: NextRequest): Promise<Response> {
    const dao = req.nextUrl.searchParams.get("dao");

    const config = dao ? nounsDaoConfigs[dao as SupportedNounsDao] : undefined;

    if (!config) {
        console.error("NO CONFIG FOR DAO: ", dao);
        return new NextResponse("Error");
    }

    try {
        const reqJson = await req.json();
        const buttonIndex = reqJson["untrustedData"]["buttonIndex"];

        if (buttonIndex == 2) {
            return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/redirects/${config.auctionUrl}`, 302);
        }
    } catch {}

    const { nounId, nounImgSrc, timeRemaining, bidFormatted, bidder } = await config.getAuctionDetails();

    const params = new URLSearchParams([
        ["id", nounId.toString()],
        ["nounImgSrc", nounImgSrc],
        ["time", timeRemaining],
        ["bid", bidFormatted],
        ["bidder", bidder],
        ["collectionName", config.collectionName],
        ["fontType", config.fontType],
        ["backgroundColor", config.backgroundColor],
        ["textColor", config.textColor],
    ]);

    await track("nouns-auction-refresh", {
        dao: dao,
    });

    return new NextResponse(
        generateFrameMetadata({
            type: "string",
            image: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api/img/status?${params.toString()}`,
            buttonInfo: [
                { name: "Refresh", action: "post" },
                { name: "Bid", action: "post_redirect" },
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=${dao}`,
        }) as string
    );
}

export const dynamic = "force-dynamic";
