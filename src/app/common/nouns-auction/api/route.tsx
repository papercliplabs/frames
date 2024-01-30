import { NextRequest, NextResponse } from "next/server";
import { basePublicClient } from "@/utils/wallet";
import { generateFrameMetadata } from "@/utils/metadata";
import { getNounBuilderAuctionDetails, nounsDaoConfigs, SupportedNounsDao } from "@/utils/nouns";
import { URLSearchParams } from "url";

export async function POST(req: NextRequest): Promise<Response> {
    const dao = req.nextUrl.searchParams.get("dao");

    const config = dao ? nounsDaoConfigs[dao as SupportedNounsDao] : undefined;

    if (!config) {
        console.error("NO CONFIG FOR DAO: ", dao);
        return new NextResponse("Error");
    }

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

    return new NextResponse(
        generateFrameMetadata({
            type: "string",
            image: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api/img/status?${params.toString()}`,
            buttonNames: ["Refresh"],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=${dao}`,
        }) as string
    );
}

export const dynamic = "force-dynamic";
