import { ImageResponse } from "next/og";
import { ReactElement } from "react";

export type FontType = "londrina" | "pally" | "inter" | "druk" | "graphik" | "graphikBold";

interface BaseImageParameters {
    content: ReactElement;
    fontTypes: FontType[];
}

const fontLookup: Record<FontType, { path: string; style: string }> = {
    londrina: { path: "fonts/LondrinaSolid-NNS.ttf", style: "normal" },
    pally: { path: "fonts/Pally-Bold.ttf", style: "normal" },
    inter: { path: "fonts/Inter-Bold.ttf", style: "normal" },
    druk: { path: "fonts/Druk-Wide-Medium.ttf", style: "normal" },
    graphik: { path: "fonts/GraphikRegular.otf", style: "normal" },
    graphikBold: { path: "fonts/GraphikBold.otf", style: "bold" },
};

export async function baseImage({ content, fontTypes }: BaseImageParameters): Promise<ImageResponse> {
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

    return new ImageResponse(content, {
        width: 1200,
        height: 630,
        fonts: fonts as any,
    });
}
