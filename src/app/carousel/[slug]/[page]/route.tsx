import { NextRequest, NextResponse } from "next/server";
import { generateFrameMetadata } from "@/utils/metadata";
import { SupportedCarouselSlugs, carouselConfigs } from "../../configs";
import { getButtonInfoWithActionForCarouselItem } from "../../carouselUtils";
import { FrameRequest, validateFrameAndGetPayload } from "@/utils/farcaster";
import { isAllowedCaster, restrictedFrameResponse } from "@/utils/restrictedFrame";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    const config = carouselConfigs[params.slug as SupportedCarouselSlugs];

    if (!config) {
        console.error(`Config error - slug=${params.slug}`);
        return Response.error();
    }

    const itemConfig = config.itemConfigs[0]; // Always start at page 0

    return new NextResponse(
        generateFrameMetadata({
            image: itemConfig.imgSrc,
            buttonInfo: getButtonInfoWithActionForCarouselItem(config, 0),
            postUrl: `${process.env.NEXT_PUBLIC_URL}/carousel/${params.slug}/0?${req.nextUrl.searchParams.toString()}`,
        })
    );
}

export async function POST(
    req: NextRequest,
    { params }: { params: { slug: string; page: number } }
): Promise<Response> {
    const request: FrameRequest = await req.json();
    const payload = await validateFrameAndGetPayload(request);

    const completionComposePostUrlOverride = req.nextUrl.searchParams.get("completion-compose-url") ?? undefined;
    const completionComposeLabelOverride =
        completionComposePostUrlOverride != undefined
            ? req.nextUrl.searchParams.get("completion-compose-label") ?? undefined
            : undefined; // Ignore if we don't also have the url

    if (!payload.valid) {
        console.error("Invalid frame - ", request);
        return Response.error();
    }

    const buttonIndex = (payload.action as any)["tapped_button"]["index"] - 1; // Button numbers are base 1 indexed...
    const config = carouselConfigs[params.slug as SupportedCarouselSlugs];
    const page = Math.floor(Number(params.page));

    if (!config || buttonIndex == undefined || page == undefined || page >= config.itemConfigs.length || page < 0) {
        console.error(`Config, page or request error - slug=${params.slug}, page=${page}, buttonIndex=${buttonIndex}`);
        return Response.error();
    }

    if (!isAllowedCaster(payload, config.allowedCasterFids)) {
        return restrictedFrameResponse();
    }

    const carouselAction = getButtonInfoWithActionForCarouselItem(config, page, completionComposeLabelOverride)[
        buttonIndex
    ]?.carouselAction;

    if (carouselAction == "compose") {
        const lastItem = page == config.itemConfigs.length - 1;
        const originalComposeUrl = config.itemConfigs[page].composeButtonConfig?.postUrl; // Has to exist if override doesn't, since action is from this frame
        return Response.redirect(
            lastItem ? completionComposePostUrlOverride ?? originalComposeUrl! : originalComposeUrl!
        );
    }

    const newPage = carouselAction == "next" ? page + 1 : carouselAction == "prev" ? page - 1 : page;

    return new NextResponse(
        generateFrameMetadata({
            image: config.itemConfigs[newPage].imgSrc,
            buttonInfo: getButtonInfoWithActionForCarouselItem(config, newPage, completionComposeLabelOverride),
            postUrl: `${process.env.NEXT_PUBLIC_URL}/carousel/${
                params.slug
            }/${newPage}?${req.nextUrl.searchParams.toString()}`,
        })
    );
}

export const dynamic = "force-dynamic";
