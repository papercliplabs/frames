import { NextRequest, NextResponse } from "next/server";
import { generateFrameMetadata } from "@/utils/metadata";
import { SupportedCarouselSlugs, carouselConfigs } from "../../configs";
import { getButtonInfoWithActionForCarouselItem } from "../../carouselUtils";
import { FrameRequest, validateFrameAndGetPayload } from "@/utils/farcaster";
import { isAllowedCaster, restrictedFrameResponse } from "@/utils/restrictedFrame";
import { extractComposableQueryParams } from "@/utils/composableParams";

export async function GET(req: NextRequest, { params }: { params: { slug: string; page: string } }): Promise<Response> {
    const config = carouselConfigs[params.slug as SupportedCarouselSlugs];
    const page = Math.floor(Number(params.page));

    if (!config || page >= config.itemConfigs.length || page < 0) {
        console.error(`Config error - slug=${params.slug} page=${page}`);
        return Response.error();
    }

    return new NextResponse(
        generateFrameMetadata({
            image: config.itemConfigs[page].imgSrc,
            buttonInfo: getButtonInfoWithActionForCarouselItem(config, page),
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
    const request: FrameRequest = await req.json();
    const payload = await validateFrameAndGetPayload(request);

    const { composeFrameUrl, composeFrameButtonLabel } = extractComposableQueryParams(req.nextUrl.searchParams);

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

    const carouselAction = getButtonInfoWithActionForCarouselItem(config, page, composeFrameButtonLabel)[buttonIndex]
        ?.carouselAction;

    if (carouselAction == "compose") {
        const lastItem = page == config.itemConfigs.length - 1;
        const originalComposeUrl = config.itemConfigs[page].composeButtonConfig?.postUrl; // Has to exist if override doesn't, since action is from this frame
        return Response.redirect(lastItem ? composeFrameUrl ?? originalComposeUrl! : originalComposeUrl!);
    }

    const newPage = carouselAction == "next" ? page + 1 : carouselAction == "prev" ? page - 1 : page;

    return new NextResponse(
        generateFrameMetadata({
            image: config.itemConfigs[newPage].imgSrc,
            buttonInfo: getButtonInfoWithActionForCarouselItem(config, newPage, composeFrameButtonLabel),
            postUrl: `${process.env.NEXT_PUBLIC_URL}/carousel/${
                params.slug
            }/${newPage}?${req.nextUrl.searchParams.toString()}`,
        })
    );
}

export const dynamic = "force-dynamic";
