import { NextRequest, NextResponse } from "next/server";
import { SupportedCarouselSlugs, carouselConfigs } from "@/app/carousel/configs";
import { getButtonsWithActionForCarouselItem } from "@/app/carousel/carouselUtils";
import { isAllowedCaster, restrictedFrameResponse } from "@/utils/restrictedFrame";
import { extractComposableQueryParams, getComposeResponse } from "@/utils/composableParams";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";

export async function GET(req: NextRequest, { params }: { params: { slug: string; page: string } }): Promise<Response> {
    const config = carouselConfigs[params.slug as SupportedCarouselSlugs];
    const page = Math.floor(Number(params.page));

    if (!config || page >= config.itemConfigs.length || page < 0) {
        console.error(`Config error - slug=${params.slug} page=${page}`);
        return Response.error();
    }

    return new NextResponse(
        getFrameHtmlResponse({
            image: config.itemConfigs[page].imgSrc,
            buttons: getButtonsWithActionForCarouselItem(config, page),
            postUrl: `${process.env.NEXT_PUBLIC_URL}/carousel/${params.slug}/${
                params.page
            }?${req.nextUrl.searchParams.toString()}`,
        })
    );
}

export async function POST(
    req: NextRequest,
    { params }: { params: { slug: string; page: string } }
): Promise<Response> {
    const config = carouselConfigs[params.slug as SupportedCarouselSlugs];

    const frameRequest: FrameRequest = await req.json();

    const { composeFrameUrl, composeFrameButtonLabel, composing } = extractComposableQueryParams(
        req.nextUrl.searchParams
    );

    let buttonIndex = frameRequest.untrustedData.buttonIndex - 1;
    if (config.allowedCasterFids) {
        // Need to validate
        const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

        if (!frameValidationResponse.isValid) {
            console.error("Invalid frame request - ", frameRequest);
            return Response.error();
        }

        const framePayload = frameValidationResponse.message;

        if (!isAllowedCaster(framePayload, config.allowedCasterFids)) {
            return restrictedFrameResponse();
        }

        buttonIndex = framePayload.button - 1; // Button numbers are base 1 indexed...
    }

    const page = Math.floor(Number(params.page));

    if (!config || page == undefined || page >= config.itemConfigs.length || page < 0) {
        console.error(`Config or page error - slug=${params.slug}, page=${page}, buttonIndex=${buttonIndex}`);
        return Response.error();
    }

    let carouselAction = getButtonsWithActionForCarouselItem(config, page, composeFrameButtonLabel)?.[buttonIndex]
        ?.carouselAction;

    if (composing) {
        // Ignore when composing
        carouselAction = undefined;
    }

    if (carouselAction == "compose") {
        const lastItem = page == config.itemConfigs.length - 1;
        const originalComposeUrl = config.itemConfigs[page].composeButtonConfig?.postUrl; // Has to exist if override doesn't, since action is from this frame
        const url = lastItem ? composeFrameUrl ?? originalComposeUrl! : originalComposeUrl!;
        const composeResponse = await getComposeResponse(url, frameRequest);
        return new NextResponse(composeResponse);
    }

    const newPage = carouselAction == "next" ? page + 1 : carouselAction == "prev" ? page - 1 : page;

    return new NextResponse(
        getFrameHtmlResponse({
            image: config.itemConfigs[newPage].imgSrc,
            buttons: getButtonsWithActionForCarouselItem(config, newPage, composeFrameButtonLabel),
            postUrl: `${process.env.NEXT_PUBLIC_URL}/carousel/${
                params.slug
            }/${newPage}?${req.nextUrl.searchParams.toString()}`,
        })
    );
}

export const dynamic = "force-dynamic";
