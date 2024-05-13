import { getPersistentData } from "./internal/persistentData";
import { LevelStatus, totalXpToLevelStatus } from "../utils/level";
import { FEED_BOOST_TIME_S, TRAIN_COOLDOWN_TIME_S, WATER_BOOST_TIME_S } from "../utils/constants";
import { getUserInfo } from "@/utils/farcaster";
import { getBeanIdForAddress } from "./internal/getBeanIdForAddress";
import { Address } from "viem";
import { getCurrentAuction } from "@/common/beans/data/getCurrentAuction";
import { Bean, getBean } from "@/common/beans/data/getBean";

interface GetTrainerProps {
  fid: number;
}

export interface Trainer {
  fid: number;
  username: string;

  levelStatus: LevelStatus;

  feedBoost: boolean;
  waterBoost: boolean;
  permittedToTrain: boolean;
  ownsBean: boolean;

  firstTime: boolean;

  bean: Bean;
}

export async function getTrainer({ fid }: GetTrainerProps): Promise<Trainer> {
  const [{ data: persistentData, newEntry: firstTime }, userInfo] = await Promise.all([
    getPersistentData({ fid }),
    getUserInfo(fid),
  ]);

  const levelStatus = totalXpToLevelStatus(persistentData.xp);

  const timeNowS = Math.floor(Date.now() / 1000);

  const feedBoost = timeNowS - persistentData.lastFeedTime < FEED_BOOST_TIME_S;
  const waterBoost = timeNowS - persistentData.lastWaterTime < WATER_BOOST_TIME_S;
  const permittedToTrain = timeNowS - persistentData.lastTrainTime > TRAIN_COOLDOWN_TIME_S;

  // Check if the user owns a bean, we just take the first one found
  const userVerifiedAddresses = userInfo.verified_addresses.eth_addresses as Address[];
  const beanIds = await Promise.all(
    userVerifiedAddresses.map((address) => getBeanIdForAddress({ ownerAddress: address }))
  );

  let beanId: bigint | undefined;
  let ownsBean = true;
  for (let id of beanIds) {
    if (id != undefined) {
      beanId = id;
      break;
    }
  }

  // If not, use the current auction bean
  if (!beanId) {
    ownsBean = false;
    const currentAuction = await getCurrentAuction();
    beanId = currentAuction.beanId;
  }

  const bean = await getBean({ beanId });

  return {
    fid,
    username: userInfo.username,
    levelStatus,

    feedBoost,
    waterBoost,
    permittedToTrain,
    ownsBean,

    firstTime,

    bean,
  };
}
