import { truncateString } from "@/utils/format";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import "@/common/utils/bigIntPolyfill";

export async function GET(req: Request): Promise<Response> {
  return generateImageResponse({
    frameSize: { width: 600, height: 600 },
    backgroundColor: { r: 0x00, g: 0x00, b: 0x00 },
    fontTypes: ["roboto", "roboto-mono"],
    layers: [
      {
        type: "static",
        src: "/images/beanigotchi/animated/spinny.gif",
        size: { width: 600, height: 600 },
        animated: true,
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full flex">
            <div tw="absolute flex top-[10px] right-[340px] py-1 px-[14px] bg-white/90 h-[40px] justify-end items-center rounded-full">
              TESTING
            </div>
          </div>
        ),
        size: { width: 600, height: 600 },
      },
    ],
  });
}

export const dynamic = "force-dynamic";
