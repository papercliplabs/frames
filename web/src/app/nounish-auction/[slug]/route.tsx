import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit";
import { SupportedNounishAuctionSlug, nounishAuctionConfigs } from "../configs";
import { unstable_cache } from "next/cache";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { parseEther } from "viem";
import { detect } from "detect-browser";

async function response(req: NextRequest, slug: string, frameRequest?: FrameRequest): Promise<Response> {
    const config = nounishAuctionConfigs[slug as SupportedNounishAuctionSlug];

    if (!config) {
        console.error("No auction config found - ", slug);
        return Response.error();
    }

    // Handle redirect if clicked on frame
    const browser = detect(req.headers.get("user-agent") ?? "");
    if (browser?.name) {
        return Response.redirect(config.auctionUrl);
    }

    const data = await unstable_cache(config.getAuctionData, ["nounish-auction", slug], {
        revalidate: 2,
    })();

    // GET request frameRequest will be undefined, so this will be the placeholder
    // Warpcast caches the input text, and there is not way to bust it
    let inputText = "Enter ETH bid amount";
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
                }
            } catch {
                // Nothing, invalid bid
            }
        }

        inputText = `Invalid, bid ${data.nextBidMin} ETH or more`;
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
    return await response(req, params.slug, undefined);
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    return await response(req, params.slug, await req.json());
}

export const dynamic = "force-dynamic";
