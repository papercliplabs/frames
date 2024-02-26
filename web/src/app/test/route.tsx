import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { getFrameHtmlResponse, FrameRequest } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    return new NextResponse(
        getFrameHtmlResponse({
            image: `${process.env.NEXT_PUBLIC_URL}/images/nouns-auction-house.png`,
            buttons: [
                {
                    label: "View auction!",
                    action: "post",
                },
                {
                    label: "MINT",
                    action: "mint",
                    target: "eip155:8453:0xc871de363cf7401c53cdad42242df03b5805e0f8:1",
                },
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/test?t=${Date.now()}`,
        })
    );
}

export async function POST(req: NextRequest, { params }: { params: { dao: string } }): Promise<Response> {
    const frameRequest: FrameRequest = await req.json();
    const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

    if (!frameValidationResponse.isValid) {
        console.error(`Frame invalid - frameRequest=${frameRequest}`);
        return Response.error();
    }

    const framePayload = frameValidationResponse.message;

    console.log("HERE");

    return new NextResponse(
        getFrameHtmlResponse({
            image: `${process.env.NEXT_PUBLIC_URL}/images/nouns-auction-house.png`,
            buttons: [
                {
                    label: "MINT",
                    action: "mint",
                    target: "eip155:8453:0x8a51aaa938500156fd310ab0541d2cdbd8cf67c7:1",
                },
            ],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/test?t=${Date.now()}`,
        })
    );
}
