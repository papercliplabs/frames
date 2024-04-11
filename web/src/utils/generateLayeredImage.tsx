import sharp from "sharp";
import satori from "satori";
import path from "path";
import { paperclipIcon } from "./paperclip";

export type FontType = "londrina" | "pally" | "inter" | "druk" | "graphik" | "graphikBold";

const fontLookup: Record<FontType, { path: string; style: string }> = {
  londrina: { path: "fonts/LondrinaSolid-NNS.ttf", style: "normal" },
  pally: { path: "fonts/Pally-Bold.ttf", style: "normal" },
  inter: { path: "fonts/Inter-Bold.ttf", style: "normal" },
  druk: { path: "fonts/Druk-Wide-Medium.ttf", style: "normal" },
  graphik: { path: "fonts/GraphikRegular.otf", style: "normal" },
  graphikBold: { path: "fonts/GraphikBold.otf", style: "bold" },
};

export default async function generateLayeredImage() {
  const fontTypes: FontType[] = ["pally"];
  const fetches = fontTypes.map((type) =>
    fetch(new URL(`${process.env.NEXT_PUBLIC_URL}/${fontLookup[type].path}`, import.meta.url), {
      cache: "force-cache",
    }).then((res) => res.arrayBuffer())
  );
  const resp = await Promise.all(fetches);
  const fonts = fontTypes.map((type, i) => {
    return {
      name: type,
      data: resp[i],
      style: "normal",
    };
  });

  const svg = await satori(
    <div tw="flex w-full h-full  text-black">
      HELLO
      {paperclipIcon}
    </div>,
    {
      width: 600,
      height: 600,
      fonts: fonts as any,
    }
  );

  const tester = await sharp(
    "/Users/spencerperkins/Developer/Paperclip/frames/web/public/images/rsvp/nouns-denver/home.gif",
    {
      animated: true,
    }
  )
    .toFormat("png")
    .resize(600, 600)
    .composite([
      {
        input: await sharp(Buffer.from(svg)).png().toBuffer(),
        tile: true,
        // blend: "saturate",
      },
    ])
    .toBuffer();
  return `data:image/png;base64,${tester.toString("base64")}`;
}
