import { ImageResponseOptions } from "next/server";

export type FontType =
  | "londrina"
  | "pt-root-ui"
  | "pally"
  | "druk"
  | "graphik"
  | "inter"
  | "noto"
  | "roboto"
  | "roboto-mono"
  | "arial-narrow"
  | "helvetica-neue";

interface FontConfig {
  path: string;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
}

const fontConfigs: Record<FontType, FontConfig[]> = {
  londrina: [
    {
      path: "fonts/LondrinaSolid-NNS.ttf",
      weight: 400,
      style: "normal",
    },
  ],
  "pt-root-ui": [
    {
      path: "fonts/pt-root-ui_regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      path: "fonts/pt-root-ui_medium.ttf",
      weight: 500,
      style: "normal",
    },
    {
      path: "fonts/pt-root-ui_bold.ttf",
      weight: 700,
      style: "normal",
    },
  ],
  pally: [
    {
      path: "fonts/Pally-Medium.ttf",
      weight: 500,
      style: "normal",
    },
    {
      path: "fonts/Pally-Bold.ttf",
      weight: 700,
      style: "normal",
    },
  ],
  druk: [
    {
      path: "fonts/Druk-Wide-Medium.ttf",
      weight: 500,
      style: "normal",
    },
  ],
  graphik: [
    {
      path: "fonts/GraphikRegular.otf",
      weight: 400,
      style: "normal",
    },
    {
      path: "fonts/GraphikBold.otf",
      weight: 700,
      style: "normal",
    },
  ],
  inter: [
    {
      path: "fonts/Inter-Regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      path: "fonts/Inter-Bold.ttf",
      weight: 700,
      style: "normal",
    },
  ],
  noto: [
    {
      path: "fonts/noto/Sans-Regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      path: "fonts/noto/Sans_SemiCondensed-Italic.ttf",
      weight: 400,
      style: "italic",
    },
  ],
  roboto: [
    {
      path: "fonts/roboto/regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      path: "fonts/roboto/medium.ttf",
      weight: 500,
      style: "normal",
    },
    {
      path: "fonts/roboto/bold.ttf",
      weight: 700,
      style: "normal",
    },
  ],
  "roboto-mono": [
    {
      path: "fonts/roboto-mono/regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      path: "fonts/roboto-mono/medium.ttf",
      weight: 500,
      style: "normal",
    },
    {
      path: "fonts/roboto-mono/bold.ttf",
      weight: 700,
      style: "normal",
    },
  ],
  "arial-narrow": [
    {
      path: "fonts/arial-narrow-2/regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      path: "fonts/arial-narrow-2/bold.ttf",
      weight: 700,
      style: "normal",
    },
  ],
  "helvetica-neue": [
    {
      path: "fonts/helvetica-neue/regular.ttf",
      weight: 400,
      style: "normal",
    },
    {
      path: "fonts/helvetica-neue/bold.ttf",
      weight: 700,
      style: "normal",
    },
  ],
};

export const allFonts = Object.keys(fontConfigs);

export async function getFontOptionsFromFontTypes(fontTypes: FontType[]): Promise<ImageResponseOptions["fonts"]> {
  const fetches = [];

  for (let type of fontTypes) {
    for (let config of fontConfigs[type]) {
      fetches.push(
        fetch(new URL(`${process.env.NEXT_PUBLIC_URL}/${config.path}`, import.meta.url), {
          cache: "force-cache",
        }).then((res) => res.arrayBuffer())
      );
    }
  }

  const resp = await Promise.all(fetches);

  const fonts: ImageResponseOptions["fonts"] = [];
  let i = 0;
  for (let type of fontTypes) {
    for (let config of fontConfigs[type]) {
      fonts.push({
        name: type,
        data: resp[i],
        weight: config.weight,
        style: config.style,
      });
      i += 1;
    }
  }

  return fonts;
}

export async function getDefaultSquareImageOptions(
  fontTypes: FontType[],
  size: number = 1200
): Promise<ImageResponseOptions> {
  return {
    width: size,
    height: size,
    headers: {
      "cache-control": "max-age=0, must-revalidate", // MUST be lower case, otherwise doesn't work in ImageResponse
    },
    fonts: await getFontOptionsFromFontTypes(fontTypes),
  };
}
