import { NextRequest } from "next/server";
import { baseImage } from "@/utils/baseImg";
import { collectionConfigs, SupportedMintCollection } from "@/app/mint/collectionConfig";
import MintConditionsNotMet from "@/components/MintConditionsNotMet";

export async function GET(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
    const mintAndConditionResults: boolean[] | undefined = req.nextUrl.searchParams
        .get("mintAndConditionResults")
        ?.split(",") // ["0", "1", ...]
        .map((entry) => (entry == "1" ? true : false));

    const mintOrConditionResults: boolean[] | undefined = req.nextUrl.searchParams
        .get("mintOrConditionResults")
        ?.split(",") // ["0", "1", ...]
        .map((entry) => (entry == "1" ? true : false));

    if (mintAndConditionResults == undefined || mintOrConditionResults == undefined) {
        console.error("Mint conditions undefined - ", mintAndConditionResults, mintOrConditionResults);
        return Response.error();
    }

    const config = collectionConfigs[params.collection as SupportedMintCollection];

    if (!config) {
        console.error("No collection config found - ", params.collection);
        return Response.error();
    }

    const andConditions = config.mintAndConditions.map((condition, i) => {
        return { name: condition.name, description: condition.description, met: mintAndConditionResults[i] ?? false };
    });

    const orConditions = config.mintOrConditions.map((condition, i) => {
        return { name: condition.name, description: condition.description, met: mintOrConditionResults[i] ?? false };
    });

    return await baseImage({
        content: (
            <MintConditionsNotMet
                andConditions={andConditions}
                orConditions={orConditions}
                backgroundColor={config.style.backgroundColor}
                fontColor={config.style.fontColor}
                icon={config.conditionsNotMetIcon}
            />
        ),
        fontType: config.style.font,
    });
}

export const dynamic = "force-dynamic";
