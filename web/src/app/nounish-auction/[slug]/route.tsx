import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit";
import { SupportedNounishAuctionSlug, nounishAuctionConfigs } from "../configs";
import { unstable_cache } from "next/cache";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { parseEther } from "viem";

async function response(slug: string, frameRequest?: FrameRequest): Promise<Response> {
    const config = nounishAuctionConfigs[slug as SupportedNounishAuctionSlug];

    if (!config) {
        console.error("No auction config found - ", slug);
        return Response.error();
    }

    const data = await unstable_cache(config.getAuctionData, ["nounish-auction", slug], {
        revalidate: 2,
    })();

    let inputText = `Bid Ξ${data.nextBidMin} or more`;
    if (frameRequest && frameRequest.untrustedData.buttonIndex == 2) {
        const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);
        if (!frameValidationResponse.isValid) {
            console.error("Invalid frame request - ", frameRequest);
            return Response.error();
        }
        const payload = frameValidationResponse.message;

        // Trying to bid
        if (payload.button == 2) {
            try {
                const bidAmountInputParsed = parseEther(payload.input);
                if (bidAmountInputParsed >= parseEther(data.nextBidMin)) {
                    // Valid bid, so redirect to review page
                    return Response.redirect(
                        `${process.env.NEXT_PUBLIC_URL}/nounish-auction/${slug}/review/${bidAmountInputParsed}`
                    );
                } else {
                    inputText = "Error - " + inputText;
                }
            } catch (e) {
                inputText = "Error - " + inputText;
            }
        }
    }

    return new NextResponse(
        getFrameHtmlResponse({
            image: {
                src: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/${slug}/image?t=${Date.now()}`,
                aspectRatio: "1:1",
            },
            input: { text: inputText },
            buttons: [
                { label: "Refresh", action: "post" },
                {
                    label: "Review Bid",
                    action: "post",
                },

                { label: "Auction", action: "link", target: config.auctionUrl },
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/nounish-auction/${slug}`,
        })
    );
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    return await response(params.slug, undefined);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    return await response(params.slug, await req.json());
}

export const dynamic = "force-dynamic";
