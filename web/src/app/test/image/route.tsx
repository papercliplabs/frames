import { NextRequest } from "next/server";
import { generateLayeredImageResponse } from "@/utils/generateLayeredImage";
import { localImageUrl } from "@/utils/urlHelpers";

export async function GET(req: NextRequest): Promise<Response> {
  return generateLayeredImageResponse({
    frameSize: {
      width: 600,
      height: 600,
    },
    backgroundColor: { r: 0xa1, g: 0xd2, b: 0xf1 },
    layers: [
      {
        type: "static",
        src: localImageUrl("/test/tester.gif"),
        size: { width: 300, height: 300 },
        position: { left: 150, top: 195 },
        animated: true,
      },
      {
        type: "dynamic",
        src: (
          <div
            tw="flex flex-col items-center justify-center w-full h-full text-[40px] p-6 text-center"
            style={{ gap: "50px", backgroundColor: "#a1d2f1" }}
          >
            <span>Hello from Paperclip Labs</span>
            <div tw="flex flex-col text-[18px] text-center items-center" style={{ fontFamily: "pt-root-ui" }}>
              Some radical frame content is coming!
              <br />
              This image was dynamically generated in our frame server.
              <br />
              Supporting any combinations of gifs, static images, and dynamic images, in any position or size.
            </div>
          </div>
        ),
        fontTypes: ["londrina", "pt-root-ui"],
        size: {
          width: 600,
          height: 200,
        },
        position: { left: 0, top: 0 },
      },
      {
        type: "static",
        src: localImageUrl("/test/test_animated_gif.gif"),
        size: { width: 100, height: 100 },
        position: { left: 0, top: 0 },
        animated: true,
      },
      {
        type: "static",
        src: localImageUrl("/test/test_animated_gif.gif"),
        size: { width: 100, height: 100 },
        position: { left: 500, top: 0 },
        animated: true,
      },
      {
        type: "static",
        src: localImageUrl("/paperclip-icon.png"),
        size: { width: 50, height: 50 },
        position: { left: 530, top: 530 },
      },
      {
        type: "static",
        src: localImageUrl("/test/test_overlay_gif.gif"),
        size: { width: 600, height: 400 },
        position: { left: 0, top: 200 },
        animated: true,
      },
    ],
  });
}
