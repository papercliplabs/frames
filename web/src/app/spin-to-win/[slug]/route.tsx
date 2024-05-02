import { SupportedSpinToWinSlug, spinToWinConfigs } from "../configs";
import { NextRequest, NextResponse } from "next/server";
import { FrameRequest, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { getFrameMessageWithNeynarApiKey } from "@/utils/farcaster";

export async function GET(req: NextRequest, { params }: { params: { slug: string; page: string } }): Promise<Response> {
  const config = spinToWinConfigs[params.slug as SupportedSpinToWinSlug];

  if (!config) {
    console.error(`Config error - slug=${params.slug}`);
    return Response.error();
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image: config.images.home,
      buttons: [{ label: "Spin", action: "post" }],
      postUrl: `${process.env.NEXT_PUBLIC_URL}/spin-to-win/${params.slug}?t=${Date.now()}`,
    })
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; page: string } }
): Promise<Response> {
  const config = spinToWinConfigs[params.slug as SupportedSpinToWinSlug];

  if (!config) {
    console.error(`Config error - slug=${params.slug}`);
    return Response.error();
  }

  const frameRequest: FrameRequest = await req.json();

  const frameValidationResponse = await getFrameMessageWithNeynarApiKey(frameRequest);

  if (!frameValidationResponse.isValid) {
    console.error("Invalid frame request - ", frameRequest);
    return Response.error();
  }

  const payload = frameValidationResponse.message;

  let image = config.images.home;

  if (await config.isSoldOut()) {
    image = config.images.soldOut;
  } else if (await config.didAlreadySpin(payload.interactor.fid)) {
    image = config.images.alreadySpun;
  } else {
    image = await config.runSpin(payload);
  }

  return new NextResponse(
    getFrameHtmlResponse({
      image: image,
      buttons: [{ label: config.externalLinkConfig.title, action: "link", target: config.externalLinkConfig.href }],
      postUrl: `${process.env.NEXT_PUBLIC_URL}/spin-to-win/${params.slug}?t=${Date.now()}`,
    })
  );
}
