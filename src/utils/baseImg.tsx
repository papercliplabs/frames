import { ImageResponse } from "next/og";
import { ReactElement } from "react";

export type FontType = "londrina" | "pally" | "inter" | "druk";

interface BaseImageParameters {
    content: ReactElement;
    fontType: FontType;
}

const fontLookup: Record<FontType, string> = {
    londrina: "fonts/LondrinaSolid-NNS.ttf",
    pally: "fonts/Pally-Bold.ttf",
    inter: "fonts/Inter-Bold.ttf",
    druk: "fonts/Druk-Wide-Medium.ttf",
};

export async function baseImage({ content, fontType }: BaseImageParameters): Promise<ImageResponse> {
    const fontUrl = fontLookup[fontType];

    let fonts = undefined;
    if (fontUrl) {
        const fontArrayBuffer = await fetch(new URL(`${process.env.NEXT_PUBLIC_URL}/${fontUrl}`, import.meta.url)).then(
            (res) => res.arrayBuffer()
        );
        fonts = [
            {
                name: "pal",
                data: fontArrayBuffer,
                style: "normal",
            },
        ];
    }

    return new ImageResponse(content, {
        width: 1200,
        height: 630,
        fonts: fonts as any,
    });
}
