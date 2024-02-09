export function extractComposableQueryParams(searchParams: URLSearchParams): {
    composeFrameUrl?: string;
    composeFrameButtonLabel?: string;
} {
    let url = searchParams.get("compose-frame-url") ?? undefined;
    const label = searchParams.get("compose-frame-button-label") ?? undefined;

    if (url != undefined && url[0] == "/") {
        // Expand
        url = `${process.env.NEXT_PUBLIC_URL}${url}`;
    }

    return { composeFrameUrl: url, composeFrameButtonLabel: url != undefined ? label : undefined };
}
