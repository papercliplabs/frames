import { NextRequest, NextResponse } from "next/server";
import { FrameButtonInfo, generateFrameMetadata } from "@/utils/metadata";
import { SupportedMintCollection, collectionConfigs } from "../collectionConfig";
import { getAddress } from "viem";
import { FrameRequest, validateFrameAndGetPayload } from "@/utils/farcaster";
import { track } from "@vercel/analytics/server";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";

export async function GET(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
    const config = collectionConfigs[params.collection as SupportedMintCollection];

    if (!config) {
        console.error("No collection config found - ", params.collection);
    }

    return new NextResponse(
        generateFrameMetadata({
            image: config.homePageImage,
            buttonInfo: [{ title: "Free Mint!", action: "post" }],
            postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}`,
            ogTitle: config.collectionName,
            ogDescription: config.collectionDescription,
        })
    );
}

export async function POST(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
    const config = collectionConfigs[params.collection as SupportedMintCollection];

    if (!config) {
        console.error("No collection config found - ", params.collection);
        return Response.error();
    }

    const request: FrameRequest = await req.json();
    const payload = await validateFrameAndGetPayload(request);

    if (!payload.valid) {
        console.error("Invalid frame - ", request);
        return Response.error();
    }

    const verifiedAddress = payload.action?.interactor?.verifications[0];
    const soldOut = await isNftSoldOut(config.client, config.collectionAddress);

    let mintAndConditionResults: number[] = [];
    let mintOrConditionResults: number[] = [];

    let mintAndConditionsMet = false;
    let mintOrConditionsMet = false;

    let alreadyMinted = true;

    if (verifiedAddress && !soldOut) {
        const userAddress = getAddress(verifiedAddress);
        const castHash = payload.action?.cast?.hash;
        const userId = payload.action?.interactor?.fid;

        // Do this very first, to avoid race condition with mint + refresh
        alreadyMinted = await isNftBalanceAboveThreshold(config.client, config.collectionAddress, userAddress, 0);

        // Don't bother checking if already minted, doesn't matter
        if (!alreadyMinted) {
            mintAndConditionsMet = true;
            mintOrConditionsMet = config.mintOrConditions.length == 0 ? true : false;

            if (!castHash || !userId) {
                console.error("NO cast hash or user id, should not be possible - ", castHash, userId);
                return Response.error();
            }
            for (const condition of config.mintAndConditions) {
                const satisfied = await condition.check(userAddress, userId, castHash);
                mintAndConditionResults.push(satisfied ? 1 : 0);
                mintAndConditionsMet = mintAndConditionsMet && satisfied;
            }

            for (const condition of config.mintOrConditions) {
                const satisfied = await condition.check(userAddress, userId, castHash);
                mintOrConditionResults.push(satisfied ? 1 : 0);
                mintOrConditionsMet = mintOrConditionsMet || satisfied;
            }
        }
    }

    const mintConditionsMet = mintAndConditionsMet && mintOrConditionsMet;

    // Logging params:
    const username = payload?.action?.interactor?.username;
    const fid = payload?.action?.interactor?.fid;

    const {
        image,
        postUrl,
        buttonInfo,
    }: {
        image: string;
        postUrl: string;
        buttonInfo: [FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?];
    } = await (async () => {
        if (!verifiedAddress) {
            console.log("NOT VERIFIED ADDRESS", username, fid);
            await track(`mint-${params.collection}-not-verified-address`);
            return {
                image: config.noAddressImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/terminal-failed`,
                buttonInfo: [{ title: config.learnMoreName, action: "post_redirect" }],
            };
        } else if (soldOut) {
            console.log("SOLD OUT", username, fid);
            await track(`mint-${params.collection}-sold-out`);
            return {
                image: config.soldOutImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/terminal-failed`,
                buttonInfo: [{ title: config.learnMoreName, action: "post_redirect" }],
            };
        } else if (alreadyMinted) {
            // Already Minted
            console.log("ALREADY MINTED", username, fid);
            await track(`mint-${params.collection}-already-minted`);
            return {
                image: config.alreadyMintedImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/terminal-failed`,
                buttonInfo: [{ title: config.learnMoreName, action: "post_redirect" }],
            };
        } else if (!mintConditionsMet) {
            console.log("CONDITIONS NOT MET", username, fid, mintAndConditionResults, mintOrConditionResults);
            // Mint conditions not met
            await track(`mint-${params.collection}-conditions-not-met`);
            const urlParams = new URLSearchParams([
                ["mintAndConditionResults", mintAndConditionResults.toString()],
                ["mintOrConditionResults", mintOrConditionResults.toString()],
                ["rnd", Math.random().toString()],
            ]);
            return {
                image: `${process.env.NEXT_PUBLIC_URL}/mint/${
                    params.collection
                }/img/conditions-not-met?${urlParams.toString()}`,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}`,
                buttonInfo: [{ title: "Refresh", action: "post" }],
            };
        } else {
            // Mint
            await track(`mint-${params.collection}-minting`);
            const mintResp = await config.mintCallback(request); // just says success of fail for now...
            console.log("MINTING", username, fid, mintResp);
            const hash = "0x00"; // TODO: currently the syndicate api doesn't return
            return {
                image: config.successfulMintImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/successfully-minted/${hash}`,
                buttonInfo: [
                    // { title: "Txn Hash", action: "post_redirect" }, // Disabled for now
                    { title: config.learnMoreName, action: "post_redirect" },
                ],
            };
        }
    })();

    return new NextResponse(
        generateFrameMetadata({
            image,
            buttonInfo,
            postUrl,
            ogTitle: config.collectionName,
            ogDescription: config.collectionDescription,
        })
    );
}

export const dynamic = "force-dynamic";
