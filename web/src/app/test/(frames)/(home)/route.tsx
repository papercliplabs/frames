import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { NextRequest } from "next/server";

async function response(req: NextRequest): Promise<Response> {
  const isApproved = req.nextUrl.searchParams.get("approved") != undefined;

  return frameResponseWrapper({
    req,
    image: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/frame-restricted.png`,
      aspectRatio: "1:1",
    },
    buttons: [
      {
        label: isApproved ? "action" : "approve / action",
        action: "tx",
        target: relativeEndpointUrl(req, "/tx"),
        postUrl: `${process.env.NEXT_PUBLIC_URL}/test/router`,
      },
    ],
  });
}

export const GET = response;
export const POST = response;
