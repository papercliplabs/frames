import { getPersistentData, setPersistentData } from "./internal/persistentData";
import { LevelStatus, totalXpToLevelStatus } from "../utils/level";
import { FEED_BOOST_TIME_S, TRAIN_COOLDOWN_TIME_S, WATER_BOOST_TIME_S } from "../utils/constants";
import { getUserInfo } from "@/utils/farcaster";
import { getBeanIdsForAddress } from "./internal/getBeanIdForAddress";
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
  ownedBeanIds: bigint[];

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
  const ownedBeanIds = (
    await Promise.all(userVerifiedAddresses.map((address) => getBeanIdsForAddress({ ownerAddress: address })))
  ).flat();

  const ownsBean = ownedBeanIds.length > 0;

  const preferredBeanId = persistentData.preferredBeanId ? BigInt(persistentData.preferredBeanId) : undefined;

  let beanId: bigint;
  if (preferredBeanId != undefined && ownedBeanIds.includes(preferredBeanId)) {
    beanId = preferredBeanId;
  }

  if (preferredBeanId == BigInt(-1) || ownedBeanIds.length == 0) {
    // If they don't own a bean, or configured preferred to -1 which means use the auction bean
    const currentAuction = await getCurrentAuction();
    beanId = currentAuction.beanId;
  } else if (preferredBeanId != undefined && ownedBeanIds.includes(preferredBeanId)) {
    // If they own their configured preferred bean
    beanId = preferredBeanId;
  } else {
    // Otherwise, just take the first one
    beanId = ownedBeanIds[0];
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

    ownedBeanIds,

    firstTime,

    bean,
  };
}

interface SetPreferredBeanId {
  fid: number;
  preferredBeanId: bigint;
}

export async function setPreferredBeanId({ fid, preferredBeanId }: SetPreferredBeanId): Promise<boolean> {
  const [trainer, { data }] = await Promise.all([getTrainer({ fid }), getPersistentData({ fid })]);

  // -1 used for the auction bean
  if (trainer.ownedBeanIds.includes(preferredBeanId) || preferredBeanId == BigInt(-1)) {
    data.preferredBeanId = Number(preferredBeanId);
    await setPersistentData({ data });

    return true;
  } else {
    // unowned
    return false;
  }
}
