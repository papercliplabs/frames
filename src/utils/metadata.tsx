export interface FrameButtonInfo {
    title: string;
    action: "post" | "post_redirect";
}

export interface GenerateFrameMetadataParams {
    image: string;
    buttonInfo: [FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?, FrameButtonInfo?];
    postUrl: string;
    ogTitle?: string;
    ogDescription?: string;
}

export function generateFrameMetadata({
    image,
    buttonInfo,
    postUrl,
    ogTitle,
    ogDescription,
}: GenerateFrameMetadataParams) {
    let metadata: Record<string, string> = {
        "og:image": image,
        "og:title": ogTitle ?? "title",
        "og:description": ogDescription ?? "desc",

        "fc:frame": "vNext",
        "fc:frame:image": image,
        "fc:frame:post_url": postUrl,
    };

    buttonInfo.forEach((info, i) => {
        if (info) {
            metadata[`fc:frame:button:${i + 1}`] = info.title;
            metadata[`fc:frame:button:${i + 1}:action`] = info.action;
        }
    });

    const metadataAsString = Object.entries(metadata).reduce((acc, entry) => {
        return acc + `\t<meta property="${entry[0]}" content="${entry[1]}" />\n`;
    }, "");

    return `
<!DOCTYPE html>
<html>
    <head>
${metadataAsString}
    </head>
</html>
    `;
}
