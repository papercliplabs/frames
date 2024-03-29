import { Address, getAddress } from "viem";
import { ConditionsNotMetComponentProps, MintConfig } from "../configs";
import { ReactElement } from "react";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";
import { basePublicClient } from "@/utils/wallet";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { mintNftWithSyndicate } from "@/utils/syndicate";
import { FrameRequest, FrameValidationData } from "@coinbase/onchainkit";

const CLIENT = basePublicClient;
const COLLECTION_ADDRESS = getAddress("0x6703342631d23a0f2E6d3f35d34f3e765325341B");

async function mint(request: FrameRequest, address: Address) {
  return mintNftWithSyndicate(request, process.env.NOUNS_DENVER_SYNDICATE_API_KEY!);
}

async function mintConditionsCheck(
  castHash: string,
  userFid: number,
  userAddress: Address,
  payload: FrameValidationData
): Promise<{ passed: boolean; checkPayload: URLSearchParams }> {
  const urlParams = new URLSearchParams();
  return { passed: true, checkPayload: urlParams };
}

function MintConditionsNotMetComponent({ checkPayload }: ConditionsNotMetComponentProps): ReactElement {
  return <div tw="flex w-full h-full p-[30px] bg-[#609CFF]">INVALID STATE</div>;
}

export const nounsDenverConfig: MintConfig<any> = {
  images: {
    home: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/common/home.png`,
      aspectRatio: "1:1",
    },
    mintedOut: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/nouns-denver/minted-out.png`,
      aspectRatio: "1:1",
    },
    alreadyMinted: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/nouns-denver/already-minted.png`,
      aspectRatio: "1:1",
    },
    noAddress: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/nouns-denver/no-address.png`,
      aspectRatio: "1:1",
    },
    successfulMint: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/nouns-denver/successful-mint.png`,
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
    label: "Nouns Denver",
    redirectUrl: "https://warpcast.com/toadyhawk.eth/0x66ea0477",
  },
  fonts: ["druk"],
};
