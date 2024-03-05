import { NextRequest } from "next/server";
import { SupportedNounishAuctionSlug, nounishAuctionConfigs } from "../../configs";
import { ImageResponse } from "next/og";
import { getDefaultSquareImageOptions } from "@/utils/imageOptions";
import { unstable_cache } from "next/cache";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    const config = nounishAuctionConfigs[params.slug as SupportedNounishAuctionSlug];
    if (!config) {
        console.error("No auction config found - ", params.slug);
        return Response.error();
    }

    const data = await unstable_cache(config.getAuctionData, ["nounish-auction", params.slug], {
        revalidate: 2,
    })();

    return new ImageResponse(
        <config.auctionStatusComponent {...data} />,
        await getDefaultSquareImageOptions(config.fonts)
    );
}

export const dynamic = "force-dynamic";
