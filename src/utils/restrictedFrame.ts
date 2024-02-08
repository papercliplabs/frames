import { NextResponse } from "next/server";
import { generateFrameMetadata } from "./metadata";
import { ValidateFrameActionResponse } from "@neynar/nodejs-sdk/build/neynar-api/v2";

export function restrictedFrameResponse(): NextResponse {
    return new NextResponse(
        generateFrameMetadata({
            image: `${process.env.NEXT_PUBLIC_URL}/images/frame-restricted.png`,
            buttonInfo: [{ action: "link", title: "Paperclip Labs", redirectUrl: "https://paperclip.xyz" }],
            postUrl: "",
        })
    );
}

export function isAllowedCaster(payload: ValidateFrameActionResponse, allowedCasterFids?: number[]): boolean {
    const authorFid = payload.action?.cast?.author?.fid;
    return allowedCasterFids == undefined || (authorFid != undefined && !allowedCasterFids.includes(authorFid));
}
