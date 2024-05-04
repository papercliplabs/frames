import { formatNumber, truncateString } from "@/utils/format";
import { formatEther, getAddress } from "viem";
import { getCurrentAuctionDataCached } from "../../data/getCurrentAuctionData";
import { generateLayeredImageResponse } from "@/utils/generateLayeredImage";
import ServerImage from "@/components/ServerImage";
import { localImageUrl } from "@/utils/urlHelpers";
import { SatoriOptions } from "satori";
import sharp, { Sharp } from "sharp";
import "@/utils/bigIntPolyfill";

export async function GET(req: Request): Promise<Response> {
  const auctionData = await getCurrentAuctionDataCached();
  const backgroundImage = formBackgroundImage(auctionData.artworkImageSrc);

  return generateLayeredImageResponse({
    frameSize: { width: 1200, height: 1200 },
    backgroundColor: { r: 0xff, g: 0xff, b: 0xff },
    fontTypes: ["roboto", "roboto-mono"],
    twConfig,
    layers: [
      {
        type: "sharp",
        src: backgroundImage,
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full flex flex-col p-[75px] bg-white bg-opacity-80 relative">
            <div tw="flex flex-col pt-[605px]" style={{ gap: "40px" }}>
              <div tw="flex flex-row w-full justify-center items-center " style={{ gap: "60px" }}>
                <ServerImage src={localImageUrl("/nounish-auction/vrbs/logo.png")} width={311} height={124} alt="Vrb" />
                <span tw="text-title text-content-primary">{auctionData.tokenId}</span>
              </div>
              <div tw="flex flex-row border-[4px] border-content-primary rounded-[30px] h-[192px]">
                <div
                  tw="flex flex-col h-full flex-1 border-r-[4px] border-content-primary justify-center items-center"
                  style={{ gap: "24px" }}
                >
                  <span tw="text-content-ternary text-caption" style={{ fontFamily: "roboto-mono", whiteSpace: "pre" }}>
                    Current Bid
                  </span>
                  <span tw="text-body-lg">Ξ {formatNumber(formatEther(auctionData.highestBid), 4)}</span>
                </div>
                <div tw="flex flex-col h-full flex-1 justify-center items-center" style={{ gap: "24px" }}>
                  <span tw="text-content-ternary text-caption" style={{ fontFamily: "roboto-mono" }}>
                    Auction ends in
                  </span>
                  <span tw="text-body-lg">{auctionData.timeRemainingFormatted}</span>
                </div>
              </div>

              <span
                tw="flex justify-center text-content-secondary text-body-sm"
                style={{ fontFamily: "roboto-mono", whiteSpace: "pre" }}
              >
                Highest bid by <span tw="font-medium">{truncateString(auctionData.highestBidder.name, 22)}</span>
              </span>
            </div>
          </div>
        ),
        size: { width: 1200, height: 1200 },
      },
      {
        type: "static",
        src: auctionData.artworkImageSrc,
        size: { width: 554, height: 554 },
        position: { left: 323, top: 72 },
        borderRadius: 16,
      },
      {
        type: "dynamic",
        src: (
          <div tw="w-full h-full flex">
            <div tw="absolute text-caption-sm flex top-[570px] right-[340px] py-1 px-[14px] bg-white/90 h-[40px] justify-end items-center rounded-full">
              {truncateString(auctionData.artist.name, 15)}
            </div>
          </div>
        ),
        size: { width: 1200, height: 1200 },
      },
    ],
  });
}

function formBackgroundImage(imgSrc: string): Sharp {
  const base64Encoded = imgSrc.split(";base64").pop();
  const sharpImage = sharp(Buffer.from(base64Encoded!, "base64"));
  sharpImage.resize(1200, 1200).blur(80).jpeg({ force: true, quality: 40 });

  return sharpImage;
}

const twConfig: SatoriOptions["tailwindConfig"] = {
  theme: {
    extend: {
      colors: {
        content: {
          primary: "#138756",
          secondary: "#151C3B",
          ternary: "#71717A",
        },
      },
      fontSize: {
        title: [
          "150px",
          {
            lineHeight: "150px",
            letterSpacing: "0px",
          },
        ],
        "body-lg": [
          "56px",
          {
            lineHeight: "56px",
            letterSpacing: "0px",
          },
        ],
        "body-sm": [
          "40px",
          {
            lineHeight: "48px",
            letterSpacing: "0px",
          },
        ],
        caption: [
          "32px",
          {
            lineHeight: "32px",
            letterSpacing: "0px",
          },
        ],
        "caption-sm": [
          "22px",
          {
            lineHeight: "22px",
            letterSpacing: "0px",
          },
        ],
      },
    },
  },
};

export const dynamic = "force-dynamic";
