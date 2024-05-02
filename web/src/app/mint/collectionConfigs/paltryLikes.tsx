import { Address, getAddress } from "viem";
import { ConditionsNotMetComponentProps, MintConfig } from "../configs";
import { ReactElement } from "react";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";
import { basePublicClient } from "@/utils/wallet";
import { mintNftWithSyndicate } from "@/utils/syndicate";
import { FrameRequest, FrameValidationData } from "@coinbase/onchainkit/frame";
import { isCastLikedByUser } from "../commonChecks/farcaster";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";

const CLIENT = basePublicClient;
const COLLECTION_ADDRESS = getAddress("0x3A9e5d3b873EB4a7109dE9ccF0B1ae2D35d8e6BD");

async function mint(request: FrameRequest, address: Address) {
  return mintNftWithSyndicate(request, process.env.PALTRY_LIKES_SYNDICATE_API_KEY!);
}

async function mintConditionsCheck(
  castHash: string,
  userFid: number,
  userAddress: Address,
  payload: FrameValidationData
): Promise<{ passed: boolean; checkPayload: URLSearchParams }> {
  const liked = await isCastLikedByUser(userAddress, userFid, "0x4aed023b2b2a29f6c20331ad2a758d44a2b9ccaf");
  return { passed: liked, checkPayload: new URLSearchParams() };
}

function MintConditionsNotMetComponent({ checkPayload }: ConditionsNotMetComponentProps): ReactElement {
  return (
    <div tw="flex w-full h-full relative">
      <img
        src={`${process.env.NEXT_PUBLIC_URL}/images/mint/paltry-likes/missing-conditions.png`}
        style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 1200 }}
      />
    </div>
  );
}

export const paltryLikesConfig: MintConfig<any> = {
  images: {
    home: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/paltry-likes/home.gif`,
      aspectRatio: "1:1",
    },
    mintedOut: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/paltry-likes/sold-out.gif`,
      aspectRatio: "1:1",
    },
    alreadyMinted: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/paltry-likes/already-minted.gif`,
      aspectRatio: "1:1",
    },
    noAddress: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/paltry-likes/no-address.gif`,
      aspectRatio: "1:1",
    },
    successfulMint: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/paltry-likes/mint-successful.gif`,
      aspectRatio: "1:1",
    },
  },
  conditionsNotMetComponent: MintConditionsNotMetComponent,
  conditionsNotMetAspectRatio: "1:1",
  decisionLogic: {
    mintedOutCheck: () => isNftSoldOut(CLIENT, COLLECTION_ADDRESS),
    alreadyMintedCheck: (address) => isNftBalanceAboveThreshold(CLIENT, COLLECTION_ADDRESS, address, 0),
    mintConditionsCheck,
  },
  mint,
  learnMoreButtonConfig: {
    label: "Wake's Cast",
    redirectUrl: "https://warpcast.com/wake/0x4aed023b",
  },
  fonts: ["graphik", "graphikBold"],
};
