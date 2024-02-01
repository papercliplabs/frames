import { FrameRequest } from "./farcaster";

export async function mintNftWithSyndicate(request: FrameRequest) {
    const syndicateMintRes = await fetch("https://frame.syndicate.io/api/mint", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${process.env.SYNDICATE_API_KEY}`,
        },
        body: JSON.stringify({
            frameTrustedData: request.trustedData.messageBytes, // You can also get this data from req.body.trustedData.messageBytes
        }),
    });

    const mintData = await syndicateMintRes.json();

    return mintData; // just success
}
