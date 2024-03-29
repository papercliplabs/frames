import { SpinToWinConfig } from "../configs";
import { supabase } from "@/supabase/supabase";
import { getUserInfo } from "@/utils/farcaster";
import { FrameImageMetadata, FrameValidationData } from "@coinbase/onchainkit";

const MAX_NUMBER_OF_SPINS = 100;

// rndThreshold's should be monotonically increasing, with the last one ending with 1.0.
// item n will be selected if spinConfig[n-1].rndThreshold <= rndNumber < spinConfig[n].rndThreshold
// for the first item, 0 is used as the lower bound
const spinConfig: { winAmount: number; rndThreshold: number; imageData: FrameImageMetadata }[] = [
  {
    winAmount: 1000.0,
    rndThreshold: 0.0665,
    imageData: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/outcomes/00-win-1000.gif`,
      aspectRatio: "1:1",
    },
  },
  {
    winAmount: 100.0,
    rndThreshold: 0.1995,
    imageData: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/outcomes/01-win-100.gif`,
      aspectRatio: "1:1",
    },
  },
  {
    winAmount: 0.0,
    rndThreshold: 0.3325,
    imageData: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/outcomes/02-loss.gif`,
      aspectRatio: "1:1",
    },
  },
  {
    winAmount: 250.0,
    rndThreshold: 0.4655,
    imageData: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/outcomes/03-win-250.gif`,
      aspectRatio: "1:1",
    },
  },
  {
    winAmount: 500.0,
    rndThreshold: 0.5985,
    imageData: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/outcomes/04-win-500.gif`,
      aspectRatio: "1:1",
    },
  },
  {
    winAmount: 250.0,
    rndThreshold: 0.7315,
    imageData: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/outcomes/05-win-250.gif`,
      aspectRatio: "1:1",
    },
  },
  {
    winAmount: 0.0,
    rndThreshold: 0.8645,
    imageData: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/outcomes/06-loss.gif`,
      aspectRatio: "1:1",
    },
  },
  {
    winAmount: 100.0,
    rndThreshold: 1.0, // Very slightly higher probability due to rounding
    imageData: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/outcomes/07-win-100.gif`,
      aspectRatio: "1:1",
    },
  },
];

async function isSoldOut(): Promise<boolean> {
  const { data, error } = await supabase.from("degen-price-winners").select("id");

  if (error) {
    throw error;
  }

  return data.length >= MAX_NUMBER_OF_SPINS;
}

async function didAlreadySpin(fid: number): Promise<boolean> {
  const { data, error } = await supabase.from("degen-price-winners").select("*").eq("fid", fid);

  if (error) {
    throw error;
  }

  return data.length != 0;
}

function getRandomOutcome() {
  const rnd = Math.random();

  // Linear search
  let outcome = spinConfig[0];
  for (let i = 0; i < spinConfig.length; i++) {
    if (spinConfig[i].rndThreshold > rnd) {
      outcome = spinConfig[i];
      break;
    }
  }

  return outcome;
}

async function runSpin(frameData: FrameValidationData): Promise<FrameImageMetadata> {
  const outcome = getRandomOutcome();

  // Store outcome
  const userInfo = await getUserInfo(frameData.interactor.fid);
  const { error } = await supabase
    .from("degen-price-winners")
    .insert([{ username: userInfo.username, fid: userInfo.fid, amount: outcome.winAmount }])
    .select();
  if (error) {
    throw error;
  }

  return outcome.imageData;
}

export const degenPricesSlugConfig: SpinToWinConfig = {
  isSoldOut,
  didAlreadySpin,
  runSpin,
  images: {
    home: { src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/home.png`, aspectRatio: "1:1" },
    soldOut: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/sold-out.png`,
      aspectRatio: "1:1",
    },
    alreadySpun: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/spin-to-win/degen-prices/already-spun.png`,
      aspectRatio: "1:1",
    },
  },
  externalLinkConfig: {
    title: "Go to /degenprice",
    href: "https://warpcast.com/~/channel/degenprice",
  },
};
