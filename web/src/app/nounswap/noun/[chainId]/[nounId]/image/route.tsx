import { CHAIN_FOR_ID } from "@/app/nounswap/config";
import { getNoun } from "@/common/nouns/data/getNoun";
import { trackEvent } from "@/common/utils/analytics";
import { generateImageResponse } from "@/utils/generateImage/generateImage";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string; nounId: string; txHash: string } }
): Promise<Response> {
  const chain = CHAIN_FOR_ID[parseInt(params.chainId)];
  if (!chain) {
    console.error("Invalid chainId", params.chainId);
    return Response.error();
  }

  const nounId = BigInt(params.nounId);
  const noun = await getNoun({ id: nounId });
  trackEvent("image_regeneration", { app: "nounswap/deposit" });

  return generateImageResponse({
    frameSize: { width: 1200, height: 1200 },
    backgroundColor: "#000000",
    fontTypes: ["londrina"],
    layers: [
      {
        type: "dynamic",
        src: (
          <div tw="flex relative w-full h-full">
            <img src={noun.imgSrc} width={1200} height={1200} tw="absolute w-[1200px] h-[1200px]" alt="" />
          </div>
        ),
        size: { width: 1200, height: 1200 },
      },
    ],
  });
}
