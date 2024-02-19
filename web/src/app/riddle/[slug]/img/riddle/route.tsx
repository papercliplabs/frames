import { NextRequest } from "next/server";
import { baseImage } from "@/utils/baseImg";
import { SupportedRiddleSlug, riddleConfigs } from "@/app/riddle/configs";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
    const config = riddleConfigs[params.slug as SupportedRiddleSlug];

    if (!config) {
        console.error("No collection config found - ", params.slug);
        return Response.error();
    }

    const riddleId = req.nextUrl.searchParams.get("id");

    if (!riddleId) {
        console.error("No riddle id - ", riddleId);
        return Response.error();
    }

    const riddleAndAnswer = await config.getRiddle(Number(riddleId));
    if (!riddleAndAnswer) {
        console.error(`No riddle - id=${riddleId}`);
        return Response.error();
    }

    return await baseImage({
        content: (
            <div tw="flex w-full h-full relative">
                <img
                    src={config.images.riddle.src}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                />
                <config.riddleContent riddle={riddleAndAnswer.riddle} />
            </div>
        ),
        aspectRatio: config.images.riddle.aspectRatio,
        fontTypes: config.fonts,
    });
}
