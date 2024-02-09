import { NextRequest, NextResponse } from "next/server";
import { FrameButtonInfo, generateFrameMetadata } from "@/utils/metadata";
import { getAddress } from "viem";
import { FrameRequest, validateFrameAndGetPayload } from "@/utils/farcaster";
import { SupportedMintCollection, mintConfigs } from "../configs";
import { extractComposableQueryParams, getComposeResponse } from "@/utils/composableParams";

export async function GET(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
    const config = mintConfigs[params.collection as SupportedMintCollection];

    if (!config) {
        console.error("No collection config found - ", params.collection);
        return Response.error();
    }

    return new NextResponse(
        generateFrameMetadata({
            image: config.imgSrcs.home,
            buttonInfo: [{ title: "Free Mint!", action: "post" }],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}?${req.nextUrl.searchParams.toString()}`,
        })
    );
}

export async function POST(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
    const config = mintConfigs[params.collection as SupportedMintCollection];
    const { composeFrameUrl, composing } = extractComposableQueryParams(req.nextUrl.searchParams);

    const request: FrameRequest = await req.json();
    const payload = await validateFrameAndGetPayload(request);

    const castHash = payload?.action?.cast?.hash;
    const userFid = payload?.action?.interactor?.fid;

    if (!config || !payload.valid || castHash == undefined || userFid == undefined) {
        console.error(
            `Error: collection=${params.collection} config=${config} valid=${payload.valid} castHash=${castHash} userFid=${userFid}`
        );
        return Response.error();
    }

    let image = config.imgSrcs.home;
    let buttonInfo: [FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?] = [
        {
            title: config.learnMoreButtonConfig.label,
            action: "link",
            redirectUrl: config.learnMoreButtonConfig.redirectUrl,
        },
    ];

    // See README for flow chart diagram of this logic
    const mintedOut = false; //await config.decisionLogic.mintedOutCheck();
    if (mintedOut) {
        image = config.imgSrcs.mintedOut;
    } else {
        let verifiedAddress = payload.action?.interactor?.verifications[0];
        if (verifiedAddress == undefined) {
            image = config.imgSrcs.noAddress;
        } else {
            const alreadyMinted = await config.decisionLogic.alreadyMintedCheck(getAddress(verifiedAddress));
            if (alreadyMinted) {
                image = config.imgSrcs.alreadyMinted;
            } else {
                const { passed: mintConditionsMet, checkPayload } = await config.decisionLogic.mintConditionsCheck(
                    castHash,
                    userFid,
                    getAddress(verifiedAddress),
                    payload
                );
                if (!mintConditionsMet && false) {
                    const urlParams = checkPayload;
                    urlParams.append("rnd", Math.random().toString());
                    image = `${process.env.NEXT_PUBLIC_URL}/mint/${
                        params.collection
                    }/img/conditions-not-met?${urlParams.toString()}`;
                    buttonInfo = [{ title: "Refresh", action: "post" }];
                } else {
                    if (composeFrameUrl && !composing) {
                        const composeResponse = await getComposeResponse(composeFrameUrl, request);
                        return new NextResponse(composeResponse);
                    } else {
                        // Mint
                        await config.mint(request, getAddress(verifiedAddress));
                        image = config.imgSrcs.successfulMint;
                    }
                }
            }
        }
    }

    return new NextResponse(
        generateFrameMetadata({
            image,
            buttonInfo,
            postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}?${req.nextUrl.searchParams.toString()}`,
        })
    );
}

export const dynamic = "force-dynamic";
