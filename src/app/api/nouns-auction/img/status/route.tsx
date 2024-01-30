import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export const runtime = "edge";

export async function GET(req: NextRequest): Promise<Response> {
    const nounId = req.nextUrl.searchParams.get("id");
    const timeRemaining = req.nextUrl.searchParams.get("time");
    const bid = req.nextUrl.searchParams.get("bid");
    const bidder = req.nextUrl.searchParams.get("bidder");

    const interSemiBold = fetch(new URL("../LondrinaSolid-NNS.ttf", import.meta.url)).then((res) => res.arrayBuffer());

    return new ImageResponse(
        (
            <div tw={twMerge("flex w-full h-full justify-center items-center bg-gray-200 text-gray-900 text-[64px]")}>
                <img
                    src={`https://noun.pics/${nounId}`}
                    width={380}
                    height={380}
                    alt={`Noun ${nounId}`}
                    tw="shrink-0 rounded-[50px]"
                />
                <div tw="flex flex-col max-w-[800px] pl-[24px]">
                    <span>Noun {nounId}</span>
                    <span>Current Bid: Ξ{bid} </span>
                    <span>Auction ends in: {timeRemaining}</span>
                    <span>Highest bidder: {bidder}</span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Inter",
                    data: await interSemiBold,
                    style: "normal",
                    weight: 400,
                },
            ],
        }
    );
}

export const dynamic = "force-dynamic";
