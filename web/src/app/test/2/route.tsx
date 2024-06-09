import { localImageUrl, relativeEndpointUrl } from "@/utils/urlHelpers";
import { frameResponse } from "@/common/utils/frameResponse";
import { baseSepolia } from "viem/chains";

export async function GET(req: Request): Promise<Response> {
  return frameResponse({
    req,
    image: {
      src: localImageUrl("/frame-restricted.png"),
      aspectRatio: "1:1",
    },
    buttons: [{ label: "Continue", action: "post" }],
  });
}

export async function POST(req: Request): Promise<Response> {
  return frameResponse({
    req,
    image: {
      src: localImageUrl("/purple-auction-house.png"),
      aspectRatio: "1:1",
    },
    buttons: [{ label: "WAHOOO", action: "post" }],
  });
}
