import { FrameRequest } from "./farcaster";

export function extractComposableQueryParams(searchParams: URLSearchParams): {
    composing: boolean;
    composeFrameUrl?: string;
    composeFrameButtonLabel?: string;
} {
    let url = searchParams.get("compose-frame-url") ?? undefined;
    const label = searchParams.get("compose-frame-button-label") ?? undefined;
    const composing = searchParams.get("composing") ?? undefined;

    if (url != undefined && url[0] == "/") {
        // Expand
        url = `${process.env.NEXT_PUBLIC_URL}${url}`;
    }

    searchParams.delete("composing");
    return {
        composing: composing != undefined,
        composeFrameUrl: url,
        composeFrameButtonLabel: url != undefined ? label : undefined,
    };
}

export async function getComposeResponse(url: string, request: FrameRequest): Promise<string> {
    const searchParams = new URL(url).searchParams;
    searchParams.append("composing", "1");
    const resp = await fetch(url.split("?")[0] + `?${searchParams.toString()}`, {
        method: "POST",
        body: JSON.stringify(request),
    });
    return await resp.text();
}
