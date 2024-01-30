import { NextRequest, NextResponse } from "next/server";
import { getEnsName, readContract } from "viem/actions";
import { formatEther } from "viem";
import { getWalletName, publicClient } from "@/utils/wallet";
import { formatNumber, formatTimeLeft } from "@/utils/format";

export async function GET(req: NextRequest): Promise<Response> {
    const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:image" content="${process.env.NEXT_PUBLIC_URL}/api/nouns-auction/img/home" />
        <meta property="og:title" content="Nouns Auction Status" />
        <meta property="og:description" content="Farcaster frame to get the nouns auction status" />

        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/nouns-auction/img/home" />
        <meta property="fc:frame:button:1" content="View auction status" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/nouns-auction" />
      </head>
    </html>`;

    return new NextResponse(content);
}

export async function POST(req: NextRequest): Promise<Response> {
    const abi = [
        {
            inputs: [],
            name: "auction",
            outputs: [
                { internalType: "uint256", name: "nounId", type: "uint256" },
                { internalType: "uint256", name: "amount", type: "uint256" },
                { internalType: "uint256", name: "startTime", type: "uint256" },
                { internalType: "uint256", name: "endTime", type: "uint256" },
                { internalType: "address payable", name: "bidder", type: "address" },
                { internalType: "bool", name: "settled", type: "bool" },
            ],
            stateMutability: "view",
            type: "function",
        },
    ] as const;

    const [nounId, currentBid, startTime, endTime, currentBidder, settled] = await readContract(publicClient, {
        address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
        abi,
        functionName: "auction",
    });

    const now = Date.now() / 1000;
    const remaining = formatTimeLeft(settled ? 0 : Number(endTime.toString()) - now);
    const currentBidFormatted = formatNumber(formatEther(currentBid), 4);

    const bidder = await getWalletName({ address: currentBidder });

    const content = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_URL}/api/nouns-auction/img/status?id=${nounId}&time=${remaining}&bid=${currentBidFormatted}&bidder=${bidder}" />
      <meta property="fc:frame:button:1" content="Refresh" />
      <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_URL}/api/nouns-auction" />
    </head>
  </html>`;

    return new NextResponse(content);
}

export const dynamic = "force-dynamic";
