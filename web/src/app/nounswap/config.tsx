import { Chain } from "viem";
import { mainnet, sepolia } from "viem/chains";

export const CHAIN_FOR_ID: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
};
