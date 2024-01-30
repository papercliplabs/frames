import { NextRequest, NextResponse } from "next/server";
import { basePublicClient } from "@/utils/wallet";
import { generateFrameMetadata } from "@/utils/metadata";
import { getNounBuilderAuctionDetails } from "@/utils/nouns";
import { URLSearchParams } from "url";

const AUCTION_ADDRESS = "0x0aa23a7e112889c965010558803813710becf263";
const TOKEN_ADDRESS = "0x220e41499CF4d93a3629a5509410CBf9E6E0B109";

export async function POST(req: NextRequest): Promise<Response> {
    const { nounId, nounImgSrc, timeRemaining, bidFormatted, bidder } = await getNounBuilderAuctionDetails({
        client: basePublicClient,
        auctionAddress: AUCTION_ADDRESS,
        tokenAddress: TOKEN_ADDRESS,
    });

    const params = new URLSearchParams([
        ["id", nounId.toString()],
        ["nounImgSrc", nounImgSrc],
        ["time", timeRemaining],
        ["bid", bidFormatted],
        ["bidder", bidder],
    ]);

    return new NextResponse(
        generateFrameMetadata({
            type: "string",
            image: `${process.env.NEXT_PUBLIC_URL}/yellow-collective/auction/api/img/status?${params.toString()}`,
            buttonNames: ["Refresh"],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/yellow-collective/auction/api/`,
        }) as string
    );
}

export const dynamic = "force-dynamic";
