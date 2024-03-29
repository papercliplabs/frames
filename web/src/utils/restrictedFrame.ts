import { NextResponse } from "next/server";
import { FrameValidationData, getFrameHtmlResponse } from "@coinbase/onchainkit";

export function restrictedFrameResponse(): NextResponse {
  return new NextResponse(
    getFrameHtmlResponse({
      image: `${process.env.NEXT_PUBLIC_URL}/images/frame-restricted.png`,
      buttons: [{ label: "Paperclip Labs", action: "link", target: "https://paperclip.xyz" }],
    })
  );
}

export function isAllowedCaster(payload: FrameValidationData, allowedCasterFids?: number[]): boolean {
  const casterFid = payload.raw.action?.cast?.author?.fid;
  return allowedCasterFids == undefined || (casterFid != undefined && allowedCasterFids.includes(casterFid));
}
