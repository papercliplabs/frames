import { ReactElement } from "react";
import { AuctionStatusProps } from "./AuctionStatusProps";

export default function NounAuctionStatus({
    id,
    imgSrc,
    timeRemaining,
    bid,
    bidder,
    collectionName,
    backgroundColor,
    baseTextColor,
    highlightTextColor,
}: AuctionStatusProps): ReactElement {
    return (
        <div
            tw="flex w-full h-full justify-center items-center text-[64px]"
            style={{ backgroundColor: backgroundColor ?? "white", color: baseTextColor ?? "black" }}
        >
            <div
                tw="absolute top-[10px] left-0 w-[1200px] flex items-center justify-center text-center text-[32px]"
                className="top-1/2 translate-x-1/2"
            >
                Made with ❤️ by Paperclip Labs
            </div>
            <img
                src={imgSrc ?? ""}
                width={420}
                height={420}
                alt={`#${id}`}
                tw="shrink-0 rounded-[50px] border-[3px] border-white/30"
            />
            <div tw="flex flex-col max-w-[700px] pl-[64px] ">
                <span tw="pb-[56px]">
                    {collectionName}
                    {id}
                </span>
                <span tw="flex flex-row pb-[56px]">
                    <span tw="flex flex-col pr-[60px]">
                        <span tw="text-[36px] opacity-70">Current bid</span>
                        <span tw="text-[52px]">Ξ{bid}</span>
                    </span>
                    <span tw="flex flex-col">
                        <span tw="text-[36px] opacity-70">Auction ends in</span>
                        <span tw="text-[52px]">{timeRemaining}</span>
                    </span>
                </span>
                <span tw="flex flex-col">
                    <span tw="text-[36px] opacity-70">Highest bidder</span>
                    <span tw="text-[52px]">{bidder}</span>
                </span>
            </div>
        </div>
    );
}
