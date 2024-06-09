import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<Response> {
  const didApprove = req.nextUrl.searchParams.get("did-approve") != null;

  return generateImageResponse({
    frameSize: {
      width: 1200,
      height: 1200,
    },
    backgroundColor: "black",
    fontTypes: ["graphik"],
    layers: [
      {
        type: "dynamic",
        src: (
          <div tw="relative w-full h-full bg-black text-white text-[200px] flex items-center justify-center flex-col p-8">
            <span>TESTING :)</span>
            {didApprove && (
              <div tw="absolute bottom-8 left-8 text-[50px] w-full bg-slate-200 opacity-50 rounded-lg flex justify-center items-center text-center p-4">
                Approved!
              </div>
            )}
          </div>
        ),
        size: { width: 1200, height: 1200 },
      },
    ],
  });
}
