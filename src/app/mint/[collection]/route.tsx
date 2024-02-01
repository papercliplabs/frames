import { NextRequest, NextResponse } from "next/server";
import { FrameButtonInfo, generateFrameMetadata } from "@/utils/metadata";
import { SupportedMintCollection, collectionConfigs } from "../collectionConfig";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { FrameRequest, getFrameAccountAddress, getFrameMessage } from "@coinbase/onchainkit";
import { Address, getAddress } from "viem";

export async function GET(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
    const config = collectionConfigs[params.collection as SupportedMintCollection];

    if (!config) {
        console.error("No collection config found - ", params.collection);
    }

    return new NextResponse(
        generateFrameMetadata({
            image: config.homePageImage,
            buttonInfo: [{ title: "Mint!", action: "post" }],
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
    }

    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body);

    let accountAddress: Address | undefined = undefined;
    if (isValid) {
        // Step 5. Get from the message the Account Address of the user using the Frame
        const address = await getFrameAccountAddress(message, { NEYNAR_API_KEY: "NEYNAR_ONCHAIN_KIT" });
        accountAddress = address ? getAddress(address) : undefined;
    }

    if (!accountAddress) {
        // sorry, the message is not valid and it will be undefined
        console.error("NO ACCOUNT");
        return Response.error();
    }

    console.log("ACC ADDR", message, accountAddress);
    accountAddress = "0x5D802e2Fe48392c104Ce0401C7ECa8a4456f1F16"; // Toady for testing

    const castId = 0; // TODO

    let mintAndConditionResults: number[] = [];
    let mintAndConditionsMet = true;
    for (const condition of config.mintAndConditions) {
        const satisfied = await condition.check(accountAddress, castId);
        mintAndConditionResults.push(satisfied ? 1 : 0);
        mintAndConditionsMet = mintAndConditionsMet && satisfied;
    }

    let mintOrConditionResults: number[] = [];
    let mintOrConditionsMet = config.mintOrConditions.length == 0 ? true : false;
    for (const condition of config.mintOrConditions) {
        const satisfied = await condition.check(accountAddress, castId);
        mintOrConditionResults.push(satisfied ? 1 : 0);
        mintOrConditionsMet = mintAndConditionsMet || satisfied;
    }

    const mintConditionsMet = mintAndConditionsMet && mintOrConditionsMet;

    const alreadyMinted = false; //await isNftBalanceAboveThreshold(config.client, config.collectionAddress, accountAddress, 0);

    const {
        image,
        postUrl,
        buttonInfo,
    }: {
        image: string;
        postUrl: string;
        buttonInfo: [FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?];
    } = (() => {
        if (alreadyMinted && config.oneMintPerAddress) {
            // Already Minted
            return {
                image: config.alreadyMintedImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/already-minted`,
                buttonInfo: [{ title: config.learnMoreName, action: "post_redirect" }],
            };
        } else if (!mintConditionsMet) {
            // Mint conditions not met
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
            // TODO: trigger mint
            const hash = "0x00"; // TODO
            return {
                image: config.successfulMintImage,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}/successfully-minted/${hash}`,
                buttonInfo: [
                    { title: "Txn Hash", action: "post_redirect" },
                    { title: "Yellow 🟡", action: "post_redirect" },
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
