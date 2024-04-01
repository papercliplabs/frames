import { Address, getAddress } from "viem";
import { ConditionsNotMetComponentProps, MintConfig } from "../configs";
import { ReactElement } from "react";
import { isNftSoldOut } from "../commonChecks/nftSoldOut";
import { basePublicClient } from "@/utils/wallet";
import { isNftBalanceAboveThreshold } from "../commonChecks/nftBalance";
import { doesUserHaveActiveBadge, isChannelFollowedByUser } from "../commonChecks/farcaster";
import { mintNftWithSyndicateV2 } from "@/utils/syndicate";
import { FrameRequest, FrameValidationData } from "@coinbase/onchainkit";
import { promiseTimeout } from "@/utils/promiseTimeout";

const CLIENT = basePublicClient;
const COLLECTION_ADDRESS = getAddress("0xb16894a681b77258ced6C8c5FD3627537724b64a");

async function mint(request: FrameRequest, address: Address) {
  // console.log("WOULD MINT");
  return mintNftWithSyndicateV2(request, process.env.BEANS_BASED_BEANS_API_KEY!, COLLECTION_ADDRESS);
}

async function isBeansChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return true; //await promiseTimeout(isChannelFollowedByUser("beans", userId), 2000, false);
}

async function isBaseChannelFollowedByUser(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return true; //await promiseTimeout(isChannelFollowedByUser("base", userId), 2000, false);
}

async function activeBadge(userAddress: Address, userId: number, castHash: string): Promise<boolean> {
  return doesUserHaveActiveBadge(userId, []);
}

const checkConfigs = [
  { name: "Follow /beans channel", check: isBeansChannelFollowedByUser },
  { name: "Follow /base channel", check: isBaseChannelFollowedByUser },
  { name: "Active badge", check: activeBadge },
];

async function mintConditionsCheck(
  castHash: string,
  userFid: number,
  userAddress: Address,
  payload: FrameValidationData
): Promise<{ passed: boolean; checkPayload: URLSearchParams }> {
  // let checkResults = (
  //     await Promise.all(checkConfigs.map((config) => config.check(userAddress, userFid, castHash)))
  // ).map((res) => (res ? 1 : 0));
  // const checkPassCount = checkResults.reduce((acc, res) => acc + res, 0 as number);

  const active = await activeBadge(userAddress, userFid, castHash);
  const urlParams = new URLSearchParams({ checkResults: ["1", "1", active ? "1" : "0"].toString() });

  return { passed: active, checkPayload: urlParams };
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
    <div tw="flex w-full h-full flex-col relative">
      <img
        src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/base-grant/missing-conditions-base.png`}
        style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 1200 }}
      />
      <div tw="flex flex-col absolute top-[607px] left-[251px]">
        {mintConditions.map((condition, i) => {
          return (
            <div tw="flex w-[36px] h-[36px] pb-[106.54px]" key={i}>
              {condition.passed ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_URL}/images/mint/beans/base-grant/condition-met-icon.png`}
                  className="w-full h-full"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const beansBaseGrantConfig: MintConfig<any> = {
  images: {
    home: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/base-grant/home.jpeg`,
      aspectRatio: "1:1",
    },
    mintedOut: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/base-grant/minted-out.png`,
      aspectRatio: "1:1",
    },
    alreadyMinted: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/base-grant/already-minted.png`,
      aspectRatio: "1:1",
    },
    noAddress: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/base-grant/no-address.png`,
      aspectRatio: "1:1",
    },
    successfulMint: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/mint/beans/base-grant/mint-successful.png`,
      aspectRatio: "1:1",
    },
  },
  conditionsNotMetComponent: MintConditionsNotMetComponent,
  conditionsNotMetAspectRatio: "1:1",
  decisionLogic: {
    mintedOutCheck: async () => true, //isNftSoldOut(CLIENT, COLLECTION_ADDRESS),
    alreadyMintedCheck: (address) => isNftBalanceAboveThreshold(CLIENT, COLLECTION_ADDRESS, address, 0),
    mintConditionsCheck,
  },
  mint,
  learnMoreButtonConfig: {
    label: "BEANSDAO",
    redirectUrl: "https://beans.wtf",
  },
  fonts: [],
  composeToGetRequest: true,
};
