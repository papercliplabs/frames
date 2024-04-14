import generateLayeredImage from "@/utils/generateLayeredImage";

const SCALER = 2;

// TODO(spennp): undo this, although we should add a landing page, or a redirect to paperclip.xyz
export default async function Page() {
  return (
    <>
      <img
        src={await generateLayeredImage({
          frameSize: {
            width: 600 * SCALER,
            height: 600 * SCALER,
          },
          backgroundColor: { r: 0xa1, g: 0xd2, b: 0xf1 },
          layers: [
            {
              type: "static",
              src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/test/tester.gif",
              size: { width: 300 * SCALER, height: 300 * SCALER },
              position: { left: 150 * SCALER, top: 195 * SCALER },
              animated: true,
            },
            {
              type: "dynamic",
              src: (
                <div
                  tw="flex flex-col items-center justify-center w-full h-full text-[80px] p-12 text-center"
                  style={{ gap: "100px", backgroundColor: "#a1d2f1" }}
                >
                  <span>Hello from Paperclip Labs</span>
                  <div tw="flex flex-col text-[36px] text-center items-center" style={{ fontFamily: "pt-root-ui" }}>
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
                width: 600 * SCALER,
                height: 200 * SCALER,
              },
              position: { left: 0, top: 0 },
            },
            {
              type: "static",
              src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/test/test_animated_gif.gif",
              size: { width: 100 * SCALER, height: 100 * SCALER },
              position: { left: 0, top: 0 },
              animated: true,
            },
            {
              type: "static",
              src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/test/test_animated_gif.gif",
              size: { width: 100 * SCALER, height: 100 * SCALER },
              position: { left: 500 * SCALER, top: 0 },
              animated: true,
            },
            {
              type: "static",
              src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/paperclip-icon.png",
              size: { width: 50 * SCALER, height: 50 * SCALER },
              position: { left: 530 * SCALER, top: 530 * SCALER },
            },
            {
              type: "static",
              src: "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/test/test_overlay_gif.gif",
              size: { width: 600 * SCALER, height: 400 * SCALER },
              position: { left: 0, top: 200 * SCALER },
              animated: true,
            },
          ],
        })}
      />
    </>
  );
}
