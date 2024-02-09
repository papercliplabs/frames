export function extractComposableQueryParams(searchParams: URLSearchParams): {
    composeFrameUrl?: string;
    composeFrameButtonLabel?: string;
} {
    const url = searchParams.get("compose-frame-url") ?? undefined;
    const label = searchParams.get("compose-frame-button-label") ?? undefined;

    return { composeFrameUrl: url, composeFrameButtonLabel: url != undefined ? label : undefined };
}
