/** @jsxImportSource frog/jsx */
import { Button, Frog } from "frog";
import { handle } from "frog/next";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { SUPERRARE_BASE_URL, getSuperrareLiveAuctionDetails } from "@/utils/superrare";
import { getDefaultSquareImageOptions } from "@/utils/imageOptions";
import { detect } from "detect-browser";

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
        image: auction ? (
            <div tw="flex flex-col w-full h-full p-[80px] text-[48px] items-center justify-between text-[#FFFFFF] bg-[#0A0A0A] ">
                <span>
                    Live auction —{" "}
                    {auction.status == "not-started"
                        ? `Starts in ${auction.timeFormatted}`
                        : auction.status == "underway"
                        ? `${auction.timeFormatted} left`
                        : "Auction ended"}
                </span>
                <div tw="flex flex-row justify-start w-full ">
                    <img src={auction.imageSrc} width={520} height={520} tw="rounded-[32px]" />
                    <div tw="flex flex-col justify-end items-start pl-[80px] ">
                        <div tw="flex flex-col">
                            <span tw="text-[#6B6B6B] pb-[8px]">
                                {auction.status == "finished" ? "Winning Bid" : "Current bid"}
                            </span>
                            <span>{auction.highestBidFormatted}</span>
                        </div>
                        <div tw="flex flex-col pt-[80px] ">
                            <span tw="text-[#6B6B6B] pb-[8px]">
                                {auction.status == "finished" ? "Winner" : "Highest Bidder"}
                            </span>
                            <div tw="flex flex-row justify-start items-center ">
                                {auction.highestBidderAvatarSrc && (
                                    <img
                                        src={auction.highestBidderAvatarSrc}
                                        width={80}
                                        height={80}
                                        tw="rounded-full mr-[24px]"
                                    />
                                )}
                                <span tw="text-ellipsis overflow-hidden whitespace-nowrap min-w-0">
                                    {auction.highestBidderName ?? "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <span tw="flex w-full justify-start text-[#6B6B6B]">
                    {auction.title} by {auction.creatorName}
                </span>
            </div>
        ) : (
            <div tw="flex flex-col w-full h-full text-[#FFFFFF] bg-[#0A0A0A] justify-center items-center text-[48px]">
                <span>API ERROR</span>
                <span>missing auction details</span>
            </div>
        ),
        imageOptions: await getDefaultSquareImageOptions(["inter"]),
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
