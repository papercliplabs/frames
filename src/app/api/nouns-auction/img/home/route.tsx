import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export const runtime = "edge";

export async function GET(req: NextRequest): Promise<Response> {
    const interSemiBold = fetch(new URL("../LondrinaSolid-NNS.ttf", import.meta.url)).then((res) => res.arrayBuffer());

    return new ImageResponse(
        (
            <div
                tw={twMerge(
                    "flex w-full h-full justify-center items-center text-center bg-gray-200 text-gray-900 text-[60px] p-4"
                )}
            >
                View the current status of the Nouns auction!
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
