// xp = SCALER * level ^ EXPONENT
const EXPONENT = 1.1;
const SCALER = 100.0;

export interface LevelStatus {
  level: number;
  levelProgressPct: number; // in [0, 1)
}

export function totalXpToLevelStatus(totalXp: number): LevelStatus {
  const level = xpToLevel(totalXp);

  const currentLevelXpRequirement = levelToXp(level);
  const nextLevelXpRequirement = levelToXp(level + 1);
  const levelProgressPct = (totalXp - currentLevelXpRequirement) / (nextLevelXpRequirement - currentLevelXpRequirement);

  return { level, levelProgressPct };
}

function levelToXp(level: number): number {
  return SCALER * Math.pow(level, EXPONENT);
}

function xpToLevel(xp: number): number {
  return Math.floor(Math.pow((1 / SCALER) * xp, 1 / EXPONENT));
}
