import { getTrainer } from "./trainer";
import { getPersistentData, setPersistentData } from "./internal/persistentData";

export type Action = "feed" | "water" | "train";

interface TakeActionParams {
  fid: number;
  action: Action;
}

interface ActionResult {
  success: boolean;
  xpGained?: number;
}

export async function takeAction({ fid, action }: TakeActionParams): Promise<ActionResult> {
  switch (action) {
    case "feed":
      return feed(fid);
    case "water":
      return water(fid);
    case "train":
      return train(fid);
  }
}

async function feed(fid: number): Promise<ActionResult> {
  const trainer = await getTrainer({ fid });
  if (trainer.feedBoost) {
    return { success: false };
  } else {
    let { data } = await getPersistentData({ fid });
    data.lastFeedTime = Math.floor(Date.now() / 1000);
    await setPersistentData({ data });
    return { success: true };
  }
}

async function water(fid: number): Promise<ActionResult> {
  const trainer = await getTrainer({ fid });
  if (trainer.waterBoost) {
    return { success: false };
  } else {
    let { data } = await getPersistentData({ fid });
    data.lastWaterTime = Math.floor(Date.now() / 1000);
    await setPersistentData({ data });
    return { success: true };
  }
}

async function train(fid: number): Promise<ActionResult> {
  const trainer = await getTrainer({ fid });
  if (trainer.permittedToTrain) {
    let { data } = await getPersistentData({ fid });
    data.lastTrainTime = Math.floor(Date.now() / 1000);

    const feedBoostPct = trainer.feedBoost ? 25 : 0;
    const waterBoostPct = trainer.waterBoost ? 25 : 0;
    const beanOwnerPct = trainer.ownedBeanIds.length > 0 ? 100 : 0;
    const xpMultiplier = (100 + feedBoostPct + waterBoostPct + beanOwnerPct) / 100;

    const baseXpGain = 50 + Math.random() * 50; // Number in [50, 100)
    const finalXpGain = Math.ceil(baseXpGain * xpMultiplier);
    data.xp += finalXpGain;

    await setPersistentData({ data });
    return { success: true, xpGained: finalXpGain };
  } else {
    return { success: false };
  }
}
