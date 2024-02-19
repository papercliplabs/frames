import { NextRequest } from "next/server";
import { baseImage } from "@/utils/baseImg";
import { SupportedMintCollection, mintConfigs } from "@/app/mint/configs";

export async function GET(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
    const config = mintConfigs[params.collection as SupportedMintCollection];

    if (!config) {
        console.error("No collection config found - ", params.collection);
        return Response.error();
    }

    return await baseImage({
        content: <config.conditionsNotMetComponent checkPayload={req.nextUrl.searchParams} />,
        aspectRatio: config.conditionsNotMetAspectRatio,
        fontTypes: config.fonts,
    });
}
