import { formatNumber, truncateString } from "@/utils/format";
import { formatEther } from "viem";
import { getCurrentAuctionDataCached } from "../../data/getCurrentAuctionData";
import ServerImage from "@/components/ServerImage";
import { localImageUrl } from "@/utils/urlHelpers";
import sharp, { Sharp } from "sharp";
import "@/common/utils/bigIntPolyfill";
import { generateImageResponse } from "@/utils/generateImage/generateImage";
import { sendAnalyticsEvent } from "@/common/utils/analytics";

export async function GET(req: Request): Promise<Response> {
  const auctionData = await getCurrentAuctionDataCached();
  const backgroundImage = formBackgroundImage(auctionData.artworkImageSrc);

  sendAnalyticsEvent("image_regeneration", { app: "nounish-auction/v2/vrbs" });

  return generateImageResponse({
    frameSize: { width: 1200, height: 1200 },
    backgroundColor: { r: 0xff, g: 0xff, b: 0xff },
    fontTypes: ["roboto", "roboto-mono"],
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
                <span tw="text-[150px] leading-[150px] text-[#138756]">{auctionData.tokenId}</span>
              </div>
              <div tw="flex flex-row border-[4px] border-[#138756] rounded-[30px] h-[192px]">
                <div
                  tw="flex flex-col h-full flex-1 border-r-[4px] border-[#138756] justify-center items-center"
                  style={{ gap: "24px" }}
                >
                  <span tw="text-[#71717A] text-[32px]" style={{ fontFamily: "roboto-mono", whiteSpace: "pre" }}>
                    Current Bid
                  </span>
                  <span tw="text-[56px]">Ξ {formatNumber(formatEther(auctionData.highestBid), 4)}</span>
                </div>
                <div tw="flex flex-col h-full flex-1 justify-center items-center" style={{ gap: "24px" }}>
                  <span tw="text-[#71717A] text-[32px]" style={{ fontFamily: "roboto-mono" }}>
                    Auction ends in
                  </span>
                  <span tw="text-[56px]">{auctionData.timeRemainingFormatted}</span>
                </div>
              </div>

              <span
                tw="flex justify-center text-[#151C3B] text-[40px]"
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
            <div tw="absolute text-[28px] flex top-[570px] right-[340px] py-1 px-[14px] bg-white/90 h-[40px] justify-end items-center rounded-full">
              {truncateString(auctionData.artist.name, 18)}
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

export const dynamic = "force-dynamic";
