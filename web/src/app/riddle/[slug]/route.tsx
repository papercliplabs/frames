import { NextRequest, NextResponse } from "next/server";
import { isAllowedCaster, restrictedFrameResponse } from "@/utils/restrictedFrame";
import { extractComposableQueryParams, getComposeResponse } from "@/utils/composableParams";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { SupportedRiddleSlug, riddleConfigs } from "../configs";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    const config = riddleConfigs[params.slug as SupportedRiddleSlug];

    if (!config) {
        console.error(`Config error - slug=${params.slug}`);
        return Response.error();
    }

    return new NextResponse(
        getFrameHtmlResponse({
            image: config.images.home,
            buttons: [{ label: "View Riddle", action: "post" }],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/riddle/${params.slug}?${req.nextUrl.searchParams.toString()}`,
        })
    );
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    const config = riddleConfigs[params.slug as SupportedRiddleSlug];

    if (!config) {
        console.error(`Config error - slug=${params.slug}`);
        return Response.error();
    }

    const { composeFrameUrl } = extractComposableQueryParams(req.nextUrl.searchParams);

    const frameRequest: FrameRequest = await req.json();
    const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

    if (!frameValidationResponse.isValid) {
        console.error(`Frame invalid - frameRequest=${frameRequest}`);
        return Response.error();
    }

    const framePayload = frameValidationResponse.message;
    const input = framePayload.input;

    if (!isAllowedCaster(framePayload, config.allowedCasterFids)) {
        return restrictedFrameResponse();
    }

    let searchParams = req.nextUrl.searchParams;
    let riddleId = framePayload.button == 2 ? undefined : searchParams.get("id"); // Ignore it if they hit new riddle (2)
    const firstTime = riddleId == null;

    const riddleAndAnswer = await config.getRiddle(riddleId ? Number(riddleId) : undefined);

    if (!riddleAndAnswer) {
        console.error(`Failed to get riddle`);
        return Response.error();
    }

    riddleId = riddleAndAnswer.id.toString();
    searchParams.set("id", riddleId);

    const correct = input.toLowerCase() == riddleAndAnswer.answer.toLowerCase();

    return new NextResponse(
        correct
            ? composeFrameUrl
                ? await getComposeResponse(composeFrameUrl, frameRequest)
                : getFrameHtmlResponse({
                      image: config.images.correct,
                      buttons: [{ ...config.redirectInfo, action: "link" }],
                  })
            : getFrameHtmlResponse({
                  image: {
                      src: `${process.env.NEXT_PUBLIC_URL}/riddle/${
                          params.slug
                      }/img/riddle?${req.nextUrl.searchParams.toString()}`,
                      aspectRatio: config.images.riddle.aspectRatio,
                  },
                  buttons: [
                      { label: "Submit", action: "post" },
                      { label: "New riddle", action: "post" },
                  ],
                  input: { text: firstTime ? "Enter 1 word answer" : "Incorrect, try again" },
                  postUrl: `${process.env.NEXT_PUBLIC_URL}/riddle/${params.slug}?${searchParams.toString()}`,
              })
    );
}

export const dynamic = "force-dynamic";
