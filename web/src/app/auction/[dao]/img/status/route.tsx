import { NextRequest } from "next/server";
import { baseImage } from "@/utils/baseImg";
import { auctionConfigs, SupportedAuctionDao } from "@/app/auction/daoConfig";
import { unstable_cache } from "next/cache";

export async function GET(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    const config = auctionConfigs[params.dao as SupportedAuctionDao];

    if (!config) {
        console.error("No auction config found - ", params.dao);
    }

    const { nounId, nounImgSrc, timeRemaining, bidFormatted, bidder, dynamicTextColor } = await unstable_cache(
        () =>
            config.getAuctionDetails({
                client: config.client,
                auctionAddress: config.auctionAddress,
                tokenAddress: config.tokenAddress,
            }),
        ["get-auction-details"],
        {
            revalidate: 2,
        }
    )();

    return await baseImage({
        content: (
            <config.auctionStatusComponent
                id={nounId.toString()}
                imgSrc={nounImgSrc}
                timeRemaining={timeRemaining}
                bid={bidFormatted}
                bidder={bidder}
                collectionName={config.tokenNamePrefix}
                backgroundColor={config.style.backgroundColor}
                baseTextColor={config.style.textColor}
                highlightTextColor={dynamicTextColor ?? config.style.textColor}
            />
        ),
        fontTypes: [config.style.fontType],
    });
}
