import { NextRequest, NextResponse } from "next/server";
import { FrameButtonInfo, generateFrameMetadata } from "@/utils/metadata";
import { getAddress } from "viem";
import { FrameRequest, validateFrameAndGetPayload } from "@/utils/farcaster";
import { SupportedMintCollection, mintConfigs } from "../configs";
import { extractComposableQueryParams, getComposeResponse } from "@/utils/composableParams";
import { track } from "@vercel/analytics/server";
import { isAllowedCaster, restrictedFrameResponse } from "@/utils/restrictedFrame";

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

    if (!isAllowedCaster(payload, config.allowedCasterFids)) {
        return restrictedFrameResponse();
    }

    let image = config.imgSrcs.home;
    let buttonInfo: [FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?] = [
        {
            title: config.learnMoreButtonConfig.label,
            action: "link",
            redirectUrl: config.learnMoreButtonConfig.redirectUrl,
        },
    ];

    await track("mint-interaction", {
        dao: params.collection,
    });

    // Logging params:
    const username = payload?.action?.interactor?.username;
    const fid = payload?.action?.interactor?.fid;

    // See README for flow chart diagram of this logic
    const mintedOut = await config.decisionLogic.mintedOutCheck();
    if (mintedOut) {
        console.log("MINTED OUT", username, fid);
        image = config.imgSrcs.mintedOut;
    } else {
        let verifiedAddress = payload.action?.interactor?.verifications[0];
        if (verifiedAddress == undefined) {
            console.log("NOT VERIFIED ADDRESS", username, fid);
            image = config.imgSrcs.noAddress;
        } else {
            const alreadyMinted = await config.decisionLogic.alreadyMintedCheck(getAddress(verifiedAddress));
            if (alreadyMinted) {
                console.log("ALREADY MINTED", username, fid);
                image = config.imgSrcs.alreadyMinted;
            } else {
                const { passed: mintConditionsMet, checkPayload } = await config.decisionLogic.mintConditionsCheck(
                    castHash,
                    userFid,
                    getAddress(verifiedAddress),
                    payload
                );
                if (!mintConditionsMet) {
                    console.log("MINT CONDITIONS NOT MET", username, fid, checkPayload);
                    const urlParams = checkPayload;
                    image = `${process.env.NEXT_PUBLIC_URL}/mint/${
                        params.collection
                    }/img/conditions-not-met?${urlParams.toString()}`;
                    buttonInfo = [{ title: "Refresh", action: "post" }];
                } else {
                    if (composeFrameUrl && !composing) {
                        console.log("COMPOSING", username, fid);
                        const composeResponse = await getComposeResponse(composeFrameUrl, request);
                        return new NextResponse(composeResponse);
                    } else {
                        // Mint
                        const resp = await config.mint(request, getAddress(verifiedAddress));
                        console.log("MINTING", username, fid, resp);
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
