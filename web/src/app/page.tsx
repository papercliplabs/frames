import generateLayeredImage from "@/utils/generateLayeredImage";

export const TEST_IMAGE = generateLayeredImage({
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

// TODO(spennp): undo this, although we should add a landing page, or a redirect to paperclip.xyz
export default async function Page() {
  return (
    <>
      <img
        src={await generateLayeredImage({
          frameSize: {
            width: 600,
            height: 600,
          },
          backgroundColor: { r: 0xa1, g: 0xd2, b: 0xf1 },
          layers: [
            {
              type: "static",
              src: "https://ipfs.pixura.io/ipfs/QmTxjmwmqg5nYVyzFYnmGk3eCkKtokoMHbiWgJzBrYJd4H/Anim060424thumb.gif",
              size: { width: 300, height: 300 },
              position: { left: 150, top: 195 },
              animated: true,
            },
          ],
        })}
      />
    </>
  );
}
