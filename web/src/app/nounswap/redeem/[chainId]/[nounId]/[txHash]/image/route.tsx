import { CHAIN_FOR_ID } from "@/app/nounswap/config";
import { getNoun } from "@/common/nouns/data/getNoun";
import { sendAnalyticsEvent } from "@/common/utils/analytics";
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
  sendAnalyticsEvent("image_regeneration", { app: "nounswap/redeem" });

  return generateImageResponse({
    frameSize: { width: 1200, height: 1200 },
    backgroundColor: "#000000",
    fontTypes: ["londrina"],
    layers: [
      {
        type: "static",
        src: "/images/nounswap/redeem/background.png",
        size: { width: 1200, height: 1200 },
      },
      {
        type: "dynamic",
        src: (
          <div tw="flex relative w-full h-full">
            <img
              src={noun.imgSrc}
              width={480}
              height={480}
              tw="absolute w-[480px] h-[480px] rounded-[50px] top-[178px] left-[359px]"
              alt=""
            />
            <div
              tw="flex absolute left-1/2 top-[618px] rounded-full bg-[#181818] p-2  "
              style={{ transform: "translate(-50%, 0)" }}
            >
              <div tw="flex px-10 rounded-full bg-white text-[60px]">{noun.id}</div>
            </div>
          </div>
        ),
        size: { width: 1200, height: 1200 },
      },
      {
        type: "static",
        src: "/images/nounswap/redeem/icon.png",
        size: { width: 112, height: 112 },
        position: {
          left: 760,
          top: 146,
        },
      },
    ],
  });
}
