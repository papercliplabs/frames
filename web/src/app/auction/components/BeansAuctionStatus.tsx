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
            tw="flex w-full h-full justify-center items-center text-[64px] px-[135px] py-[85px]"
            style={{ backgroundColor: backgroundColor ?? "white", color: baseTextColor ?? "black" }}
        >
            <div
                tw="absolute top-[10px] left-0 w-[1200px] flex items-center justify-center text-center text-[24px]"
                className="top-1/2 translate-x-1/2"
            >
                Made with 🤍 by Paperclip Labs
            </div>
            <img src={imgSrc ?? ""} width={460} height={460} alt={`#${id}`} tw="shrink-0 rounded-[42px]" />
            <div tw="flex flex-col max-w-[700px] pl-[96px] text-[27px]">
                <span tw="pb-[44px] text-[47px]">
                    {collectionName}
                    {id}
                </span>
                <span tw="flex flex-col pb-[32px]">
                    <span style={{ color: highlightTextColor ?? "white" }}>CURRENT BID</span>
                    <span>Ξ {bid}</span>
                </span>
                <span tw="flex flex-col pb-[32px]">
                    <span style={{ color: highlightTextColor ?? "white" }}>AUCTION ENDS IN</span>
                    <span>{timeRemaining}</span>
                </span>
                <span tw="flex flex-col">
                    <span style={{ color: highlightTextColor ?? "white" }}>HIGHEST BIDDER</span>
                    <span>{bidder}</span>
                </span>
            </div>
        </div>
    );
}
