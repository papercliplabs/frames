import { NextRequest, NextResponse } from "next/server";
import { FrameButtonInfo, generateFrameMetadata } from "@/utils/metadata";
import { SupportedMintCollection, collectionConfigs } from "../collectionConfig";
import { getAddress } from "viem";
import { FrameRequest, validateFrameAndGetPayload } from "@/utils/farcaster";
import { mintNftWithSyndicate } from "@/utils/syndicate";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";
import { track } from "@vercel/analytics/server";

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

    let verifiedAddress = payload.action?.interactor?.verifications[0];

    let mintAndConditionResults: number[] = [];
    let mintOrConditionResults: number[] = [];

    let mintAndConditionsMet = false;
    let mintOrConditionsMet = false;
    let alreadyMinted = true;

    if (verifiedAddress) {
        const userAddress = getAddress(verifiedAddress);
        const castHash = payload.action?.cast?.hash;
        const userId = payload.action?.interactor?.fid;

        mintAndConditionsMet = true;
        mintOrConditionsMet = config.mintOrConditions.length == 0 ? true : false;

        // Do this very first, to avoid race condition with mint + refresh
        alreadyMinted = await isNftBalanceAboveThreshold(config.client, config.collectionAddress, userAddress, 0);

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

    const mintConditionsMet = mintAndConditionsMet && mintOrConditionsMet;

    const soldOut = await isNftSoldOut(config.client, config.collectionAddress);

    const username = payload?.action?.interactor?.username;

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
            console.log("NOT VERIFIED ADDRESS", username);
            await track("mint-yellow-collective-not-verified-address");
            return {
                image: config.noAddressImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/terminal-failed`,
                buttonInfo: [{ title: config.learnMoreName, action: "post_redirect" }],
            };
        } else if (soldOut) {
            console.log("SOLD OUT", username);
            await track("mint-yellow-collective-sold-out");
            return {
                image: config.soldOutImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/terminal-failed`,
                buttonInfo: [{ title: config.learnMoreName, action: "post_redirect" }],
            };
        } else if (alreadyMinted && config.oneMintPerAddress) {
            // Already Minted
            console.log("ALREADY MINTED", username);
            await track("mint-yellow-collective-already-minted");
            return {
                image: config.alreadyMintedImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/terminal-failed`,
                buttonInfo: [{ title: config.learnMoreName, action: "post_redirect" }],
            };
        } else if (!mintConditionsMet) {
            console.log("CONDITIONS NOT MET", username, mintAndConditionResults, mintOrConditionResults);
            // Mint conditions not met
            await track("mint-yellow-collective-conditions-not-met");
            const urlParams = new URLSearchParams([
                ["mintAndConditionResults", mintAndConditionResults.toString()],
                ["mintOrConditionResults", mintOrConditionResults.toString()],
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
            await track("mint-yellow-collective-minting");
            const mintResp = await mintNftWithSyndicate(request); // just says success or fail for now...
            console.log("MINTING", username, mintResp);
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
