import { FrameRequest } from "./farcaster";

export async function mintNftWithSyndicate(request: FrameRequest, apiKey: string) {
    const syndicateMintRes = await fetch("https://frame.syndicate.io/api/mint", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            frameTrustedData: request.trustedData.messageBytes,
        }),
    });

    const mintData = await syndicateMintRes.json();

    return mintData; // just success
}
