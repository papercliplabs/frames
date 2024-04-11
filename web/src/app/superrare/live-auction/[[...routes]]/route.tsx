/** @jsxImportSource frog/jsx */
import { Button, Frog } from "frog";
import { handle } from "frog/next";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { getSuperrareLiveAuctionDetails } from "@/data/superrare/queries/getSuperrareLiveAuctionDetails";
import { getDefaultSquareImageOptions } from "@/utils/imageOptions";
import { detect } from "detect-browser";
import { SUPERRARE_BASE_URL } from "../../constants";
import ServerImage from "@/components/ServerImage";
import { Readable } from "stream";
import generateLayeredImage from "@/utils/generateLayeredImage";

const app = new Frog({
  basePath: "/superrare/live-auction",
  verify: false,
});

app.frame("/:utid", async (c) => {
  const utid = c.req.param("utid");
  const auction = await getSuperrareLiveAuctionDetails(utid);

  // Handle redirect if clicked on frame
  const browser = detect(c.req.header("user-agent") ?? "");
  if (browser?.name) {
    return Response.redirect(auction?.link ?? SUPERRARE_BASE_URL);
  }

  return c.res({
    image: await generateLayeredImage(),
    // image: auction ? (
    //   <div tw="flex flex-col w-[600px] h-[600px] p-[40px] text-[24px] items-center justify-between text-[#FFFFFF] bg-[#0A0A0A]">
    //     <div tw="flex">
    //       Live auction —{" "}
    //       {auction.status == "not-started"
    //         ? `Starts in ${auction.timeFormatted}`
    //         : auction.status == "underway"
    //           ? `${auction.timeFormatted} left`
    //           : "Auction ended"}
    //     </div>
    //     <div tw="flex flex-row justify-start w-full bg-red-500">
    //       <img src={await generateLayeredImage()} width={200} height={200} alt="" />
    //       <ServerImage
    //         src={auction.imageSrc + ".png"}
    //         width={260}
    //         height={260}
    //         tw="rounded-[16px]"
    //         style={{ objectFit: "cover" }}
    //         alt=""
    //       />
    //       <div tw="flex flex-col justify-end items-start pl-[40px] ">
    //         <div tw="flex flex-col">
    //           <div tw="text-[#6B6B6B] pb-[4px] flex">
    //             {auction.status == "finished" ? "Winning Bid" : "Current bid"}
    //           </div>
    //           <div tw="flex">{auction.highestBidFormatted}</div>
    //         </div>
    //         <div tw="flex flex-col pt-[40px] ">
    //           <div tw="text-[#6B6B6B] pb-[4px] flex">{auction.status == "finished" ? "Winner" : "Highest Bidder"}</div>
    //           <div tw="flex flex-row justify-start items-center ">
    //             {auction.highestBidderAvatarSrc && (
    //               <ServerImage
    //                 src={auction.highestBidderAvatarSrc}
    //                 width={40}
    //                 height={40}
    //                 tw="rounded-full mr-[6px]"
    //                 alt=""
    //               />
    //             )}
    //             <div tw="flex overflow-hidden min-w-0">{auction.highestBidderName ?? "N/A"}</div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div tw="text-[#6B6B6B] w-full" style={{ overflowWrap: "break-word" }}>
    //       {`${auction.title} by ${auction.creatorName}`}
    //     </div>
    //   </div>
    // ) : (
    //   <div tw="flex flex-col w-[600px] h-[600px] text-[#FFFFFF] bg-[#0A0A0A] justify-center items-center text-[24px] ">
    //     <div>No auction data found</div>
    //   </div>
    // ),
    imageOptions: await getDefaultSquareImageOptions(["inter"], 600),
    imageAspectRatio: "1:1",
    intents: [
      <Button key={1}>Refresh</Button>,
      ...(auction
        ? [
            <Button.Link href={auction.link} key={2}>
              Bid
            </Button.Link>,
          ]
        : []),
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
