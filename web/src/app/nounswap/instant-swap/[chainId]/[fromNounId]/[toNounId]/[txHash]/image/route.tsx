import { CHAIN_FOR_ID } from "@/app/nounswap/config";
import { getNoun } from "@/common/nouns/data/getNoun";
import ServerImage from "@/components/ServerImage";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { transform } from "next/dist/build/swc";

export async function GET(
  req: Request,
  { params }: { params: { chainId: string; fromNounId: string; toNounId: string; txHash: string } }
): Promise<Response> {
  const chain = CHAIN_FOR_ID[parseInt(params.chainId)];
  if (!chain) {
    console.error("Invalid chainId", params.chainId);
    return Response.error();
  }

  const fromNounId = BigInt(params.fromNounId);
  const toNounId = BigInt(params.toNounId);

  const [fromNoun, toNoun] = await Promise.all([getNoun({ id: fromNounId }), getNoun({ id: toNounId })]);

  return generateImageResponse({
    frameSize: { width: 1200, height: 1200 },
    backgroundColor: "#000000",
    fontTypes: ["londrina"],
    layers: [
      {
        type: "static",
        src: "/images/nounswap/instant-swap-background.png",
        size: { width: 1200, height: 1200 },
      },
      {
        type: "dynamic",
        src: (
          <div tw="flex relative">
            <img
              src={fromNoun.imgSrc}
              width={380}
              height={380}
              tw="absolute w-[380px] h-[380px] rounded-[36px] top-[340px] left-[132px] opacity-60"
              style={{ transform: "rotate(-15deg)" }}
              alt=""
            />
            <div
              tw="flex absolute left-[65px] top-[350px] rounded-full bg-white shadow-lg px-10 text-[60px]"
              style={{ transform: "rotate(-15deg)" }}
            >
              {fromNoun.id}
            </div>
            <img
              src={toNoun.imgSrc}
              width={496}
              height={496}
              tw="absolute w-[496px] h-[496px] top-[227px] left-[412px]  rounded-[50px] border-[#181818] border-[16px]"
              alt=""
            />
            <div tw="flex absolute left-[400px] top-[213px] rounded-full bg-white shadow-lg px-10 text-[60px]">
              {toNoun.id}
            </div>
          </div>
        ),
        size: { width: 1200, height: 1200 },
      },
      {
        type: "static",
        src: "/images/nounswap/swap-icon.png",
        size: { width: 112, height: 112 },
        position: {
          left: 828,
          top: 211,
        },
      },
    ],
  });
}
