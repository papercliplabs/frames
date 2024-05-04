import { Address, Client } from "viem";

export interface GetNounishAuctionDataParams {
  client: Client;
  auctionAddress: Address;
  tokenAddress: Address;
}

export interface NounishAuctionData {
  nounId: number;
  nounImgSrc: string;
  attributes: Record<string, string>;
  timeRemaining: string;
  bid: string;
  bidder: string;
  nextBidMin: string;
  requiresSettlement: boolean;
}

export interface ColorConfig {
  background: { primary: string; secondary: string };
  text: { primary: string; secondary: string };
}
