import { baseImage } from "@/utils/baseImg";
import { NextRequest } from "next/server";
import { twMerge } from "tailwind-merge";

export async function GET(req: NextRequest): Promise<Response> {
    return await baseImage({
        content: (
            <div tw={twMerge("flex w-full h-full justify-center items-center bg-gray-200 text-gray-900 text-[64px]")}>
                Welcome to the jungle
            </div>
        ),
        fontType: "londrina",
    });
}

export const dynamic = "force-dynamic";
