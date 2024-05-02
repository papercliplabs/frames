import { FrameMetadata, getFrameHtmlResponse } from "@coinbase/onchainkit/frame";
import { detect } from "detect-browser";

type FrameResponseWrapperParams = {
  req: Request;
  browserRedirectUrl?: string;
} & Parameters<typeof getFrameHtmlResponse>[0];

export default function frameResponseWrapper({
  req,
  browserRedirectUrl,
  ...getFrameHtmlResponseParams
}: FrameResponseWrapperParams): Response {
  // Handle redirect if clicked on frame
  const browser = detect(req.headers.get("user-agent") ?? "");
  if (browser?.name && browserRedirectUrl) {
    return Response.redirect(browserRedirectUrl);
  }

  return new Response(getFrameHtmlResponse(getFrameHtmlResponseParams));
}
