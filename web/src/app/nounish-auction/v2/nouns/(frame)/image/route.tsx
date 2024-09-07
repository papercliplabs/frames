import { formatNumber, formatTimeLeft } from "@/utils/format";
import { formatEther } from "viem";
import { getCurrentAuction } from "@/common/nouns/data/getCurrentAuction";
import { getNoun } from "@/common/nouns/data/getNoun";
import { bigIntMax } from "@/common/utils/bigInt";
import { getUser } from "@/common/data/getUser";
import { generateImageResponse } from "@/utils/generateImage/generateImage";

const COLORS_FOR_BACKGROUND_ATTRIBUTE = [
  { background: "#d5d7e1", primary: "#151c3b", secondary: "#79809c" },
  { background: "#e1d7d5", primary: "#221b1a", secondary: "#8F7E7C" },
];

export async function GET(): Promise<Response> {
  const auction = await getCurrentAuction();
  const noun = await getNoun({ id: auction.nounId });
  const bidder = await getUser({ address: auction.highestBidderAddress, resolverTypes: ["ens", "farcaster"] });

  const colors = COLORS_FOR_BACKGROUND_ATTRIBUTE[noun.seeds.background % 2];

  const timeNowS = BigInt(Math.floor(Date.now() / 1000));
  const timeRemaining = bigIntMax(auction.endTime - timeNowS, BigInt(0));
  const timeRemainingFormatted = formatTimeLeft(Number(timeRemaining));

  const rowEntries: { name: string; value: string }[] = [
    { name: "Current bid", value: formatNumber(formatEther(auction.highestBidAmount), 6) + " ETH" },
    { name: "Time left", value: timeRemainingFormatted },
    { name: "Highest bidder", value: bidder.name },
  ];

  return generateImageResponse({
    frameSize: { width: 1200, height: 1200 },
    backgroundColor: { r: 0xff, g: 0xff, b: 0xff },
    fontTypes: ["londrina", "pt-root-ui"],
    layers: [
      {
        type: "dynamic",
        src: (
          <div tw="flex flex-col w-full h-full justify-center items-center" style={{ color: colors.primary }}>
            <span
              tw="w-full h-[54%] shrink-0 flex justify-center items-end"
              style={{ backgroundColor: colors.background }}
            >
              <img src={noun.imgSrc} width={600} height={600} alt={`#${noun.id}`} />
            </span>
            <span tw="bg-white w-full h-[46%] p-[80px] py-[70px] flex flex-col">
              <div tw="flex text-[120px] pb-[24px]">{`Noun ${noun.id}`}</div>
              <span tw="text-[52px] flex flex-col font-bold" style={{ fontFamily: "pt-root-ui" }}>
                {rowEntries.map((entry, i) => (
                  <span tw="flex flex-row justify-between pt-[24px]" key={i}>
                    <span tw="font-medium" style={{ color: colors.secondary }}>
                      {entry.name}
                    </span>
                    <span>{entry.value}</span>
                  </span>
                ))}
              </span>
            </span>
          </div>
        ),
        size: { width: 1200, height: 1200 },
      },
      {
        type: "static",
        src: "/images/paperclip-icon.png",
        size: { width: 80, height: 80 },
        position: { left: 40, top: 40 },
      },
    ],
  });
}

export const dynamic = "force-dynamic";
