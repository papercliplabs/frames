import { Address, getAddress } from "viem";
import { ConditionsNotMetComponentProps, MintConfig } from "../configs";
import { ValidateFrameActionResponse } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { ReactElement } from "react";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";
import { basePublicClient } from "@/utils/wallet";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { isCastLikedByUser, isChannelFollowedByUser, isUserFollowedByUser } from "../commonChecks/farcaster";
import { mintNftWithSyndicateWithMetadata } from "@/utils/syndicate";
import { FrameRequest, FrameValidationData } from "@coinbase/onchainkit/frame";

const CLIENT = basePublicClient;
const COLLECTION_ADDRESS = getAddress("0x816d644efcD246ff4784B2477118170D24310F75");

type Rarity = "uncommon" | "rare" | "epic" | "legendary" | "mythic";

const metadataUris: Record<Rarity, string> = {
  uncommon: "ipfs://QmcvqhNyf7En2pw5RF6KfyK9E5nhBHG6DqaGujcbWUiCqN", // 40% [0, 0.4)
  rare: "ipfs://QmQFtQcCsFYXJEV3Qa5drJuQEdYUv9ZLLYYmjxQQmh2QRA", // 30% [0.4, 0.7)
  epic: "ipfs://QmYufPAfn4TECWKe9DCuS8ShGtVPNdc4iZjBAqCifgx9o5", // 15% [0.7, 0.85)
  legendary: "ipfs://QmaREZ4SEJZFw5mnkSTDJQE1inuDjSJ97R9ZvP5Bkhu4yE", // 10% [0.85, 0.95)
  mythic: "ipfs://QmZ67HHP8RvqbpvZKJWNngw8hp2w6oW3stQ6SXDDhPTNe5", // 5% [0.95, 1)
};

async function mint(request: FrameRequest, address: Address) {
  const rnd = Math.random();

  let rarity: Rarity = "uncommon";
  if (rnd >= 0.95) {
    rarity = "mythic";
  } else if (rnd >= 0.85) {
    rarity = "legendary";
  } else if (rnd >= 0.7) {
    rarity = "epic";
  } else if (rnd >= 0.4) {
    rarity = "rare";
  }

  const metadataUri = metadataUris[rarity];

  return mintNftWithSyndicateWithMetadata(
    request,
    process.env.MAINCHARACTERS_GENSLER_COIN_SYNDICATE_API_KEY!,
    metadataUri
  );
}

async function isMainCharactersChannelFollowedByUser(
  userAddress: Address,
  userId: number,
  castHash: string
): Promise<boolean> {
  return isChannelFollowedByUser("maincharacters", userId);
}

async function isFollowingMaincharacters(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return isUserFollowedByUser(263718, userId);
}

const checkConfigs = [
  { name: "Like this cast", check: isCastLikedByUser },
  { name: "Follow /maincharacters channel", check: isMainCharactersChannelFollowedByUser },
  { name: "Follow @maincharacters", check: isFollowingMaincharacters },
];

async function mintConditionsCheck(
  castHash: string,
  userFid: number,
  userAddress: Address,
  payload: FrameValidationData
): Promise<{ passed: boolean; checkPayload: URLSearchParams }> {
  let checkResults = (
    await Promise.all(checkConfigs.map((config) => config.check(userAddress, userFid, castHash)))
  ).map((res) => (res ? 1 : 0));
  const checkPassCount = checkResults.reduce((acc, res) => acc + res, 0 as number);

  const checkPass = checkConfigs.length == checkPassCount;
  const urlParams = new URLSearchParams([["checkResults", checkResults.toString()]]);

  return { passed: checkPass, checkPayload: urlParams };
}

function ConditionIcon({ met }: { met: boolean }) {
  return (
    <>
      {met ? (
        <img
          src={`${process.env.NEXT_PUBLIC_URL}/images/mint/maincharacters/common/met-icon.png`}
          width="60px"
          height="60px"
          tw="mb-12px"
        />
      ) : (
        <img
          src={`${process.env.NEXT_PUBLIC_URL}/images/mint/maincharacters/common/not-met-icon.png`}
          width="60px"
          height="60px"
          tw="mb-12px"
        />
      )}
    </>
  );
}

function MintConditionsNotMetComponent({ checkPayload }: ConditionsNotMetComponentProps): ReactElement {
  const mintConditions = checkPayload
    .get("checkResults")
    ?.split(",")
    .map((entry, i) => {
      return {
        name: checkConfigs[i].name,
        passed: entry == "1" ? true : false,
      };
    });

  if (mintConditions == undefined) {
    return <>Error deserializing</>;
  }

  return (
    <div tw="flex w-full h-full relative">
      <img
        src={`${process.env.NEXT_PUBLIC_URL}/images/mint/maincharacters/gensler-coin/conditions-not-met.png`}
        style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630 }}
      />
      <div tw="flex flex-col absolute top-[352px] left-[375px]">
        {mintConditions.map((condition, i) => {
          return <ConditionIcon met={condition.passed} key={i} />;
        })}
      </div>
    </div>
  );
}

export const mainCharactersGenslerCoinConfig: MintConfig<any> = {
  images: {
    home: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/maincharacters/gensler-coin/home.png`,
      aspectRatio: "1.91:1",
    },
    mintedOut: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/maincharacters/gensler-coin/sold-out.png`,
      aspectRatio: "1.91:1",
    },
    alreadyMinted: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/maincharacters/gensler-coin/already-minted.png`,
      aspectRatio: "1.91:1",
    },
    noAddress: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/maincharacters/gensler-coin/no-address.png`,
      aspectRatio: "1.91:1",
    },
    successfulMint: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/maincharacters/gensler-coin/mint-successful.png`,
      aspectRatio: "1.91:1",
    },
  },
  conditionsNotMetComponent: MintConditionsNotMetComponent,
  conditionsNotMetAspectRatio: "1.91:1",
  decisionLogic: {
    mintedOutCheck: () => isNftSoldOut(CLIENT, COLLECTION_ADDRESS),
    alreadyMintedCheck: (address) => isNftBalanceAboveThreshold(CLIENT, COLLECTION_ADDRESS, address, 0),
    mintConditionsCheck,
  },
  mint,
  learnMoreButtonConfig: {
    label: "maincharacters",
    redirectUrl: "https://maincharacters.app/gensler",
  },
  fonts: ["druk"],
};
