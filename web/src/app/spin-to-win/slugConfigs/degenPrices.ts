/** @jsxImportSource frog/jsx */
import { FrameContext } from "frog";
import { SpinToWinConfig } from "../configs";
import { supabase } from "@/supabase/supabase";
import { getUserInfo } from "@/utils/farcaster";
import { revalidateTag, unstable_cache } from "next/cache";
import { FrameImageData } from "@/utils/types";

const MAX_NUMBER_OF_SPINS = 50;

// rndThreshold's should be monotonically increasing, with the last one ending with 1.0.
// item n will be selected if spinConfig[n-1].rndThreshold <= rndNumber < spinConfig[n].rndThreshold
// for the first item, 0 is used as the lower bound
const spinConfig: { winAmount: number; rndThreshold: number; imageData: FrameImageData }[] = [
    {
        winAmount: 1000.0,
        rndThreshold: 0.0665,
        imageData: { image: "/images/spin-to-win/degen-prices/outcomes/00-win-1000.gif", imageAspectRatio: "1:1" },
    },
    {
        winAmount: 100.0,
        rndThreshold: 0.1995,
        imageData: { image: "/images/spin-to-win/degen-prices/outcomes/01-win-100.gif", imageAspectRatio: "1:1" },
    },
    {
        winAmount: 0.0,
        rndThreshold: 0.3325,
        imageData: { image: "/images/spin-to-win/degen-prices/outcomes/02-loss.gif", imageAspectRatio: "1:1" },
    },
    {
        winAmount: 250.0,
        rndThreshold: 0.4655,
        imageData: { image: "/images/spin-to-win/degen-prices/outcomes/03-win-250.gif", imageAspectRatio: "1:1" },
    },
    {
        winAmount: 500.0,
        rndThreshold: 0.5985,
        imageData: { image: "/images/spin-to-win/degen-prices/outcomes/04-win-500.gif", imageAspectRatio: "1:1" },
    },
    {
        winAmount: 250.0,
        rndThreshold: 0.7315,
        imageData: { image: "/images/spin-to-win/degen-prices/outcomes/05-win-250.gif", imageAspectRatio: "1:1" },
    },
    {
        winAmount: 0.0,
        rndThreshold: 0.8645,
        imageData: { image: "/images/spin-to-win/degen-prices/outcomes/06-loss.gif", imageAspectRatio: "1:1" },
    },
    {
        winAmount: 100.0,
        rndThreshold: 1.0, // Very slightly higher probability due to rounding
        imageData: { image: "/images/spin-to-win/degen-prices/outcomes/07-win-100.gif", imageAspectRatio: "1:1" },
    },
];

async function isSoldOut(): Promise<boolean> {
    const numSpins = 0; // TODO: get from database
    return numSpins >= MAX_NUMBER_OF_SPINS;
}

async function didAlreadySpin(fid: number): Promise<boolean> {
    const { data, error } = await unstable_cache(
        async (fid) => {
            return await supabase.from("degen-price-winners").select("*").eq("fid", fid);
        },
        ["get-price-winners"],
        {
            tags: [`get-price-winners-${fid}`],
        }
    )(fid);

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

async function runSpin(frameData: Exclude<FrameContext["frameData"], undefined>): Promise<FrameImageData> {
    const outcome = getRandomOutcome();

    // Store outcome
    const userInfo = await getUserInfo(frameData.fid);
    const { error } = await supabase
        .from("degen-price-winners")
        .insert([{ username: userInfo.username, fid: userInfo.fid, amount: outcome.winAmount }])
        .select();
    if (error) {
        throw error;
    }

    await revalidateTag(`get-price-winners-${userInfo.fid}`);

    return outcome.imageData;
}

export const degenPricesSlugConfig: SpinToWinConfig = {
    isSoldOut,
    didAlreadySpin,
    runSpin,
    images: {
        home: { image: "/images/spin-to-win/degen-prices/home.png", imageAspectRatio: "1:1" },
        soldOut: { image: "/images/spin-to-win/degen-prices/sold-out.png", imageAspectRatio: "1:1" },
        alreadySpun: { image: "/images/spin-to-win/degen-prices/already-spun.png", imageAspectRatio: "1:1" },
    },
    externalLinkConfig: {
        title: "View /degenprice",
        href: "https://warpcast.com/~/channel/degenprice",
    },
};
