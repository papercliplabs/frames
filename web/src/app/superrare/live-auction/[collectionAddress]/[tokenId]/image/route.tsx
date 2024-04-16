import { NextRequest } from "next/server";
import { generateLayeredImageResponse } from "@/utils/generateLayeredImage";
import { getSuperrareLiveAuctionDetails } from "@/data/superrare/queries/getSuperrareLiveAuctionDetails";
import ServerImage from "@/components/ServerImage";

export async function GET(
  req: NextRequest,
  { params }: { params: { collectionAddress: string; tokenId: string } }
): Promise<Response> {
  const utid = params.collectionAddress.toLowerCase() + "-" + params.tokenId;
  const auction = await getSuperrareLiveAuctionDetails(utid);

  return generateLayeredImageResponse({
    frameSize: {
      width: 600,
      height: 600,
    },
    backgroundColor: { r: 0xa, g: 0xa, b: 0xa },
    layers: auction
      ? [
          {
            type: "static",
            src: auction.imageSrc,
            size: { width: 260, height: 260 },
            position: { left: 40, top: 168 },
            // animated: true,
            borderRadius: 20,
          },
          {
            type: "dynamic",
            src: (
              <div tw="flex flex-col w-[600px] h-[600px] p-[40px] text-[24px] items-center justify-between text-[#FFFFFF]">
                <div tw="flex">
                  Live auction —{" "}
                  {auction.status == "not-started"
                    ? `Starts in ${auction.timeFormatted}`
                    : auction.status == "underway"
                      ? `${auction.timeFormatted} left`
                      : "Auction ended"}
                </div>

                <div tw="flex flex-col justify-end items-start pl-[220px] h-[260px]">
                  <div tw="flex flex-col">
                    <div tw="text-[#6B6B6B] pb-[4px] flex">
                      {auction.status == "finished" ? "Winning Bid" : "Current bid"}
                    </div>
                    <div tw="flex">{auction.highestBidFormatted}</div>
                  </div>
                  <div tw="flex flex-col pt-[40px] ">
                    <div tw="text-[#6B6B6B] pb-[4px] flex">
                      {auction.status == "finished" ? "Winner" : "Highest Bidder"}
                    </div>
                    <div tw="flex flex-row justify-start items-center ">
                      {auction.highestBidderAvatarSrc && (
                        <ServerImage
                          src={auction.highestBidderAvatarSrc}
                          width={40}
                          height={40}
                          tw="rounded-full mr-[6px]"
                          alt=""
                        />
                      )}
                      <div tw="flex overflow-hidden min-w-0">{auction.highestBidderName ?? "N/A"}</div>
                    </div>
                  </div>
                </div>
                <div tw="text-[#6B6B6B] w-full" style={{ overflowWrap: "break-word" }}>
                  {`${auction.title} by ${auction.creatorName}`}
                </div>
              </div>
            ),
            fontTypes: ["inter"],
            size: {
              width: 600,
              height: 600,
            },
          },
        ]
      : [
          {
            type: "dynamic",
            src: (
              <div tw="flex flex-col w-full h-full text-[#FFFFFF] justify-center items-center text-[24px] ">
                <div>No auction data found</div>
              </div>
            ),
            fontTypes: ["inter"],
            size: {
              width: 600,
              height: 600,
            },
          },
        ],
  });
}
