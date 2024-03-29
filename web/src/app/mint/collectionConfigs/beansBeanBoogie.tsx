import { Address, getAddress } from "viem";
import { ConditionsNotMetComponentProps, MintConfig } from "../configs";
import { ReactElement } from "react";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";
import { basePublicClient } from "@/utils/wallet";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import {
  doesUserHaveActiveBadge,
  isCastLikedByUser,
  isChannelFollowedByUser,
  isUserFollowedByUser,
} from "../commonChecks/farcaster";
import { mintNftWithSyndicate } from "@/utils/syndicate";
import { FrameRequest, FrameValidationData } from "@coinbase/onchainkit";

const CLIENT = basePublicClient;
const COLLECTION_ADDRESS = getAddress("0xB687d8D882ca5c765D09b19D090E019C227c89E3");

async function mint(request: FrameRequest, address: Address) {
  // console.log("WOULD MINT");
  return mintNftWithSyndicate(request, process.env.BEANS_BEAN_BOOGIE_SYNDICATE_API_KEY!);
}

async function isBeansChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return true; //isChannelFollowedByUser("beans", userId);
}

async function isFollowingJack(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return isUserFollowedByUser(3362, userId);
}

async function isFollowingBodegacatceo(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return isUserFollowedByUser(11555, userId);
}

async function isFollowingPaperclipLabs(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return isUserFollowedByUser(318911, userId);
}

async function activeBadgeOrSpecialUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return doesUserHaveActiveBadge(userId, [1551, 2750, 3009, 2813, 4110]);
}

const checkConfigs = [
  { name: "Like this cast", check: isCastLikedByUser },
  { name: "Follow /beans channel", check: isBeansChannelFollowedByUser },
  { name: "Follow @maschka", check: isFollowingJack },
  { name: "Follow @bodegacatceo", check: isFollowingBodegacatceo },
  { name: "Follow @papercliplabs", check: isFollowingPaperclipLabs },
  { name: "Active badge", check: activeBadgeOrSpecialUser },
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
          src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/bean-boogie/condition-met-icon.png`}
          width="62.8px"
          height="62.8px"
          tw="mb-[42px]"
        />
      ) : (
        <img
          src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/bean-boogie/condition-not-met-icon.png`}
          width="62.8px"
          height="62.8px"
          tw="mb-[42px]"
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
        src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/bean-boogie/missing-conditions-template.png`}
        style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 1200 }}
      />
      <div tw="flex flex-col absolute top-[486px] left-[236px]">
        {mintConditions.map((condition, i) => {
          return <ConditionIcon met={condition.passed} key={i} />;
        })}
      </div>
    </div>
  );
}

export const beansBeanBoogieConfig: MintConfig<any> = {
  images: {
    home: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/bean-boogie/home.png`,
      aspectRatio: "1:1",
    },
    mintedOut: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/bean-boogie/minted-out.png`,
      aspectRatio: "1:1",
    },
    alreadyMinted: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/bean-boogie/already-minted.png`,
      aspectRatio: "1:1",
    },
    noAddress: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/bean-boogie/no-address.png`,
      aspectRatio: "1:1",
    },
    successfulMint: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/bean-boogie/mint-successful.gif`,
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
    label: "BEANSDAO",
    redirectUrl: "https://beans.wtf",
  },
  fonts: ["graphik", "graphikBold"],
  composeToGetRequest: true,
  allowedCasterFids: [3362, 1555, 18655, 318911],
};
