import { FrameRequest } from "@coinbase/onchainkit";
import { Address } from "viem";

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

export async function mintNftWithSyndicateV2(request: FrameRequest, apiKey: string, contractAddress: Address) {
  const syndicateMintRes = await fetch("https://frame.syndicate.io/api/v2/sendTransaction", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      frameTrustedData: request.trustedData.messageBytes,
      contractAddress: contractAddress,
      functionSignature: "mint(address)",
      args: { 0: "{frame-user}" },
    }),
  });

  const mintData = await syndicateMintRes.json();

  return mintData;
}

export async function mintNftWithSyndicateWithMetadata(request: FrameRequest, apiKey: string, metadataUri: string) {
  const syndicateMintRes = await fetch("https://frame.syndicate.io/api/mint", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      frameTrustedData: request.trustedData.messageBytes,
      args: ["{frame-user}", metadataUri],
    }),
  });

  const mintData = await syndicateMintRes.json();

  return mintData;
}
