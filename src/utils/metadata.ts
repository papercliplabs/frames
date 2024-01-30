import type { Metadata } from "next";

interface FrameButtonInfo {
    name: string;
    action: "post" | "post_redirect";
}

interface FrameMetadataGenerationParameters {
    type: "metadata" | "string";
    image: string;
    buttonInfo: FrameButtonInfo[];
    postUrl: string;
    ogTitle?: string;
    ogDesc?: string;
}

export function generateFrameMetadata({
    type,
    image,
    buttonInfo,
    postUrl,
    ogTitle,
    ogDesc,
}: FrameMetadataGenerationParameters): Metadata | string {
    let farcasterMetadata: Record<string, string> = {
        "fc:frame": "vNext",
        "fc:frame:image": image,
        "fc:frame:post_url": postUrl,
    };

    buttonInfo.forEach((info, i) => {
        farcasterMetadata[`fc:frame:button:${i + 1}`] = info.name;
        farcasterMetadata[`fc:frame:button:${i + 1}:action`] = info.action;
    });

    switch (type) {
        case "metadata":
            return {
                openGraph: {
                    images: [image],
                    title: ogTitle ?? "title",
                    description: ogDesc ?? "desc",
                },
                other: {
                    ...farcasterMetadata,
                },
            } as Metadata;
        case "string":
            const farcasterMetadataString = Object.entries(farcasterMetadata).reduce((acc, entry) => {
                return acc + `<meta property="${entry[0]}" content="${entry[1]}" />\n`;
            }, "");
            return `
<!DOCTYPE html>
<html>
    <head>
        <meta property="og:image" content="${image}" />
        <meta property="og:title" content="${ogTitle ?? "title"}" />
        <meta property="og:description" content="${ogDesc ?? "desc"}" />
        ${farcasterMetadataString}
    </head>
</html>`;
        default:
            console.error("TYPE NOT SUPPORTED: ", type);
            return "";
    }
}
