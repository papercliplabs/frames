/** @jsxImportSource frog/jsx */
import { Button, Frog } from "frog";
import { handle } from "frog/next";
import { TEST_IMAGE } from "@/app/page";
import generateLayeredImage from "@/utils/generateLayeredImage";

const app = new Frog({
  basePath: "/test-frog",
  verify: false,
});

app.frame("/", async (c) => {
  return c.res({
    image: "/img?t=1",
    imageAspectRatio: "1:1",
    intents: [<Button key={1}>Refresh</Button>],
  });
});

app.hono.get("/img", async (c) => {
  const resp = await generateLayeredImage({
    frameSize: {
      width: 600,
      height: 600,
    },
    backgroundColor: { r: 0xa1, g: 0xd2, b: 0xf1 },
    layers: [
      {
        type: "static",
        src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/test/tester.gif",
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
            <span>Hello from Paperclip Labs!</span>
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
        src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/test/test_animated_gif.gif",
        size: { width: 100, height: 100 },
        position: { left: 0, top: 0 },
        animated: true,
      },
      {
        type: "static",
        src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/test/test_animated_gif.gif",
        size: { width: 100, height: 100 },
        position: { left: 500, top: 0 },
        animated: true,
      },
      {
        type: "static",
        src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/paperclip-icon.png",
        size: { width: 50, height: 50 },
        position: { left: 530, top: 530 },
      },
      {
        type: "static",
        src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/test/test_overlay_gif.gif",
        size: { width: 600, height: 400 },
        position: { left: 0, top: 200 },
        animated: true,
      },
    ],
  });
  return new Response(Buffer.from(resp.replace("data:image/gif;base64,", ""), "base64"), {
    headers: { "content-type": "image/gif", "Cache-Control": "max-age=0, must-revalidate" },
  });
});

export const GET = handle(app);
export const POST = handle(app);
