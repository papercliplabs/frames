import { ImageLayer } from "@/utils/generateImage/types";
import { NounsBuilderAuction } from "@/common/nounsBuilder/data/getCurrentAuction";
import { formatEther } from "viem";
import { formatNumber, formatTimeLeft } from "@/utils/format";
import { bigIntMax } from "@/common/utils/bigInt";
import { getUser } from "@/common/data/getUser";
import { NounsBuilderToken } from "@/common/nounsBuilder/data/getToken";
import sharp from "sharp";
import { FontType } from "@/utils/imageOptions";
import { generateImageResponse } from "@/utils/generateImage/generateImage";

export const paperclipLogoLayer: ImageLayer = {
  type: "static",
  src: "/images/paperclip-icon.png",
  size: { width: 80, height: 80 },
  position: { left: 40, top: 40 },
};

export async function auctionDataLayer(
  token: NounsBuilderToken,
  auction: NounsBuilderAuction,
  style: {
    fontFamily: { title: FontType; body: FontType };
    color: { content: { primary: string; secondary: string }; background: string };
  }
): Promise<ImageLayer> {
  const timeNowS = BigInt(Math.floor(Date.now() / 1000));
  const timeRemaining = bigIntMax(auction.endTime - timeNowS, BigInt(0));
  const timeRemainingFormatted = formatTimeLeft(Number(timeRemaining));

  const bidder = await getUser({ address: auction.highestBidderAddress, resolverTypes: ["ens", "farcaster"] });

  const rowEntries: { name: string; value: string }[] = [
    { name: "Current bid", value: formatNumber(formatEther(auction.highestBidAmount), 6) + " ETH" },
    { name: "Time left", value: timeRemainingFormatted },
    { name: "Highest bid", value: bidder.name },
  ];

  return {
    type: "dynamic",
    src: (
      <div
        tw="w-full h-full flex flex-col p-[80px] bg-white"
        style={{
          gap: 80,
          color: style.color.content.primary,
          backgroundColor: style.color.background,
          fontFamily: style.fontFamily.body,
        }}
      >
        <div tw="text-[100px] font-bold" style={{ fontFamily: style.fontFamily.title }}>
          {token.name}
        </div>
        <span tw="text-[52px] flex flex-col font-bold grow justify-between">
          {rowEntries.map((entry, i) => (
            <span tw="flex flex-row justify-between pt-[24px]" key={i}>
              <span tw="font-medium" style={{ color: style.color.content.secondary }}>
                {entry.name}
              </span>
              <span tw="font-bold">{entry.value}</span>
            </span>
          ))}
        </span>
      </div>
    ),
    size: { height: 560, width: 1200 },
    position: { left: 0, top: 640 },
  };
}

export async function tokenBackgroundBlurLayer(token: NounsBuilderToken): Promise<ImageLayer> {
  const resp = await fetch(token.imgSrc);
  const buffer = Buffer.from(await resp.arrayBuffer());
  const sharpImage = sharp(buffer);
  sharpImage.resize(1200, 640).blur(80).jpeg({ force: true, quality: 40 });

  return {
    type: "sharp",
    src: sharpImage,
  };
}
