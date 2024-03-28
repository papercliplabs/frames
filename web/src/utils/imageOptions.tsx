import { ImageResponseOptions } from "next/server";

export type FontType = "londrina" | "pt-root-ui" | "pally" | "druk" | "graphik" | "inter";

interface FontConfig {
    path: string;
    weight: number;
    style: string;
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
};

export const allFonts = Object.keys(fontConfigs);

export async function getDefaultSquareImageOptions(fontTypes: FontType[]): Promise<ImageResponseOptions> {
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

    const fonts = [];
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

    return {
        width: 1200,
        height: 1200,
        headers: {
            "Cache-Control": "max-age=0, must-revalidate",
        },
        fonts: fonts as any,
    };
}
