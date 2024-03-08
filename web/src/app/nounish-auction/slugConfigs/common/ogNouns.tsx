// import { formatEther } from "viem";
// import { readContract } from "viem/actions";
// import { ImageData, getNounData } from "@nouns/assets";
// import { buildSVG } from "@nouns/sdk";
// import { getWalletName } from "@/utils/wallet";
// import { formatNumber, formatTimeLeft } from "@/utils/format";
// import { GetNounishAuctionDataParams, NounishAuctionData } from "./types";
// import { auctionAbi } from "@/abis/ogNouns/auction";
// import { tokenAbi } from "@/abis/ogNouns/token";

// export type Colors = {
//     background: string;
//     primary: string;
//     secondary: string;
// };

// export type OgNounsAuctionData = NounishAuctionData & {
//     namePrefix: string;
//     colors: Colors;
// };

// const { palette } = ImageData; // Used with `buildSVG``

// export async function getOgNounsAuctionData({
//     client,
//     auctionAddress,
//     tokenAddress,
// }: GetNounishAuctionDataParams): Promise<NounishAuctionData> {
//     const [nounId, currentBid, startTime, endTime, currentBidder, settled] = await readContract(client, {
//         address: auctionAddress,
//         abi: auctionAbi,
//         functionName: "auction",
//     });

//     const [background, body, accessory, head, glasses] = await readContract(client, {
//         address: tokenAddress,
//         abi: tokenAbi,
//         functionName: "seeds",
//         args: [nounId],
//     });

//     const { parts, background: bg } = getNounData({ background, body, accessory, head, glasses });
//     const svgBinary = buildSVG(parts, palette, bg);
//     const svgBase64 = btoa(svgBinary);

//     const now = Date.now() / 1000;
//     const timeRemainingFormatter = formatTimeLeft(settled ? 0 : Math.max(Number(endTime.toString()) - now, 0));
//     const currentBidFormatted = formatNumber(formatEther(currentBid), 4);
//     const bidder = await getWalletName({ address: currentBidder });

//     return {
//         nounId: Number(nounId.toString()),
//         nounImgSrc: `data:image/svg+xml;base64,${svgBase64}`,
//         timeRemaining: timeRemainingFormatter,
//         bid: currentBidFormatted,
//         bidder,
//         attributes: {
//             background: background.toString(),
//             body: body.toString(),
//             accessory: accessory.toString(),
//             head: head.toString(),
//             glasses: glasses.toString(),
//         },
//     };
// }

// export function NounAuctionStatus({
//     nounId,
//     nounImgSrc,
//     timeRemaining,
//     bid,
//     bidder,
//     namePrefix,
//     colors,
// }: OgNounsAuctionData) {
//     const rowEntries: { name: string; value: string }[] = [
//         { name: "Current bid", value: bid },
//         { name: "Time left", value: timeRemaining },
//         { name: "Highest bid", value: bidder },
//     ];

//     return (
//         <div
//             tw="flex flex-col w-full h-full justify-center items-center w-[1200px] h-[1200px]"
//             style={{ color: colors.primary }}
//         >
//             <span
//                 tw="w-full h-[54%] shrink-0 flex justify-center items-end"
//                 style={{ backgroundColor: colors.background }}
//             >
//                 <img src={nounImgSrc ?? ""} width={600} height={600} alt={`#${nounId}`} />
//             </span>
//             <span tw="bg-white w-full h-[46%] p-[80px] py-[70px] flex flex-col">
//                 <span tw="text-[120px] pb-[24px]">
//                     {namePrefix} {nounId}
//                 </span>
//                 <span tw="text-[52px] flex flex-col font-bold" style={{ fontFamily: "pt-root-ui" }}>
//                     {rowEntries.map((entry, i) => (
//                         <span tw="flex flex-row justify-between pt-[24px]" key={i}>
//                             <span tw="font-medium" style={{ color: colors.secondary }}>
//                                 {entry.name}
//                             </span>
//                             <span>{entry.value}</span>
//                         </span>
//                     ))}
//                 </span>
//             </span>
//         </div>
//     );
// }
