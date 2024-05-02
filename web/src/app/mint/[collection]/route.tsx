import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "viem";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";
import { SupportedMintCollection, mintConfigs } from "../configs";
import { extractComposableQueryParams, getComposeResponse } from "@/utils/composableParams";
import { track } from "@vercel/analytics/server";
import { isAllowedCaster, restrictedFrameResponse } from "@/utils/restrictedFrame";
import { FrameButtonMetadata, FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";

export async function GET(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
  const config = mintConfigs[params.collection as SupportedMintCollection];

  if (!config) {
    console.error("No collection config found - ", params.collection);
    return Response.error();
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image: config.images.home,
      buttons: [{ label: "Free Mint!", action: "post" }],
      postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}?${req.nextUrl.searchParams.toString()}`,
    })
  );
}

export async function POST(req: NextRequest, { params }: { params: { collection: string } }): Promise<Response> {
  const config = mintConfigs[params.collection as SupportedMintCollection];
  let { composeFrameUrl, composing } = extractComposableQueryParams(req.nextUrl.searchParams);
  composeFrameUrl = composeFrameUrl?.split(" ")[0];

  const frameRequest: FrameRequest = await req.json();
  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

  if (!frameValidationResponse.isValid) {
    console.error("Invalid frame request - ", frameRequest);
    return Response.error();
  }

  const framePayload = frameValidationResponse.message;

  const castHash = framePayload.raw.action?.cast?.hash;
  const userFid = framePayload.raw.action?.interactor?.fid;

  if (!config || castHash == undefined || userFid == undefined) {
    console.error(`Error: collection=${params.collection} config=${config} castHash=${castHash} userFid=${userFid}`);
    return Response.error();
  }

  if (!isAllowedCaster(framePayload, config.allowedCasterFids)) {
    return restrictedFrameResponse();
  }

  let image = config.images.home;
  let buttons: [FrameButtonMetadata, ...FrameButtonMetadata[]] = [
    {
      label: config.learnMoreButtonConfig.label,
      action: "link",
      target: config.learnMoreButtonConfig.redirectUrl,
    },
  ];

  await track("mint-interaction", {
    dao: params.collection,
  });

  // Logging params:
  const username = framePayload.raw.action?.interactor?.username;
  const fid = framePayload.interactor.fid;

  // See README for flow chart diagram of this logic
  const mintedOut = await config.decisionLogic.mintedOutCheck();
  if (mintedOut) {
    console.log("MINTED OUT", username, fid);
    image = config.images.mintedOut;
  } else {
    let verifiedAddress = framePayload.interactor.verified_accounts[0];
    if (verifiedAddress == undefined) {
      console.log("NOT VERIFIED ADDRESS", username, fid);
      image = config.images.noAddress;
    } else {
      const alreadyMinted = await config.decisionLogic.alreadyMintedCheck(getAddress(verifiedAddress));
      if (alreadyMinted) {
        console.log("ALREADY MINTED", username, fid);
        image = config.images.alreadyMinted;
      } else {
        const { passed: mintConditionsMet, checkPayload } = await config.decisionLogic.mintConditionsCheck(
          castHash,
          userFid,
          getAddress(verifiedAddress),
          framePayload
        );
        if (!mintConditionsMet) {
          console.log("MINT CONDITIONS NOT MET", username, fid, checkPayload);
          const urlParams = checkPayload;
          image = {
            src: `${process.env.NEXT_PUBLIC_URL}/mint/${
              params.collection
            }/img/conditions-not-met?${urlParams.toString()}`,
            aspectRatio: config.conditionsNotMetAspectRatio,
          };
          buttons = [{ label: "Refresh", action: "post" }];
        } else {
          if (composeFrameUrl && !composing) {
            console.log("COMPOSING", username, fid);
            if (config.composeToGetRequest) {
              return Response.redirect(composeFrameUrl);
            } else {
              const composeResponse = await getComposeResponse(composeFrameUrl, frameRequest);
              return new NextResponse(composeResponse);
            }
          } else {
            // Mint
            const resp = await config.mint(frameRequest, getAddress(verifiedAddress));
            console.log("MINTING", username, fid, resp);
            image = config.images.successfulMint;
          }
        }
      }
    }
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image,
      buttons,
      postUrl: `${process.env.NEXT_PUBLIC_URL}/mint/${params.collection}?${req.nextUrl.searchParams.toString()}`,
    })
  );
}

export const dynamic = "force-dynamic";
