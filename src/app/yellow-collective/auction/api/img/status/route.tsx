import { baseImage } from "@/utils/baseImg";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export async function GET(req: NextRequest): Promise<Response> {
    const nounId = req.nextUrl.searchParams.get("id");
    const nounImgSrc = req.nextUrl.searchParams.get("nounImgSrc");
    const timeRemaining = req.nextUrl.searchParams.get("time");
    const bid = req.nextUrl.searchParams.get("bid");
    const bidder = req.nextUrl.searchParams.get("bidder");

    return await baseImage({
        content: (
            <div tw={twMerge("flex w-full h-full justify-center items-center bg-[#FBCB07] text-gray-900 text-[64px]")}>
                <img
                    src={nounImgSrc ?? ""}
                    width={420}
                    height={420}
                    alt={`Noun ${nounId}`}
                    tw="shrink-0 rounded-[50px]"
                />
                <div tw="flex flex-col max-w-[800px] pl-[64px] ">
                    <span tw="pb-[56px]">Collective Noun {nounId}</span>
                    <span tw="flex flex-row pb-[56px]">
                        <span tw="flex flex-col pr-[60px]">
                            <span tw="text-[36px] text-black opacity-70">Current bid</span>
                            <span tw="text-[52px]">Ξ{bid}</span>
                        </span>
                        <span tw="flex flex-col">
                            <span tw="text-[36px] text-black opacity-70">Auction ends in</span>
                            <span tw="text-[52px]">{timeRemaining}</span>
                        </span>
                    </span>
                    <span tw="flex flex-col">
                        <span tw="text-[36px] text-black opacity-70">Highest bidder</span>
                        <span tw="text-[52px]">{bidder}</span>
                    </span>
                </div>
            </div>
        ),
        fontType: "pally",
    });
}

export const dynamic = "force-dynamic";
