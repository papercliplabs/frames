import { NextRequest } from "next/server";
import { FontType, baseImage } from "@/utils/baseImg";
import NounAuctionStatus from "@/components/NounAuctionStatus";

export async function GET(req: NextRequest): Promise<Response> {
    const nounId = req.nextUrl.searchParams.get("id");
    const nounImgSrc = req.nextUrl.searchParams.get("nounImgSrc");
    const timeRemaining = req.nextUrl.searchParams.get("time");
    const bid = req.nextUrl.searchParams.get("bid");
    const bidder = req.nextUrl.searchParams.get("bidder");
    const collectionName = req.nextUrl.searchParams.get("collectionName");
    const fontType = (req.nextUrl.searchParams.get("fontType") ?? "pally") as FontType;
    const backgroundColor = req.nextUrl.searchParams.get("backgroundColor");
    const textColor = req.nextUrl.searchParams.get("textColor");

    return await baseImage({
        content: (
            <NounAuctionStatus
                id={nounId}
                imgSrc={nounImgSrc}
                timeRemaining={timeRemaining}
                bid={bid}
                bidder={bidder}
                collectionName={collectionName}
                backgroundColor={backgroundColor}
                textColor={textColor}
            />
        ),
        fontType: fontType,
    });
}

export const dynamic = "force-dynamic";
