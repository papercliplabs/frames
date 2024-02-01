import { NextRequest } from "next/server";
import { collectionConfigs, SupportedMintCollection } from "../../collectionConfig";

export async function POST(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
    const config = collectionConfigs[params.collection as SupportedMintCollection];

    if (!config) {
        console.error("No collection config found - ", params.collection);
    }

    return Response.redirect(`${process.env.NEXT_PUBLIC_URL}/redirects/${config.learnMoreUrl}`, 302);
}

export const dynamic = "force-dynamic";
