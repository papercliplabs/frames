import { Client, createPublicClient, http } from "viem";
import { base, baseSepolia, mainnet, optimism, sepolia, zora } from "viem/chains";

export const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
});

export const sepoliaPublicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const basePublicClient = createPublicClient({
  chain: base,
  transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
});

export const baseSepoliaPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const optimismClient = createPublicClient({
  chain: optimism,
  transport: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
});

export const zoraPublicClient = createPublicClient({
  chain: zora,
  transport: http(`https://rpc.zora.energy`),
});

const clients: Record<number, Client> = {
  [mainnet.id]: mainnetPublicClient,
  [sepolia.id]: sepoliaPublicClient,
  [base.id]: basePublicClient,
  [baseSepolia.id]: baseSepoliaPublicClient,
  [optimism.id]: optimismClient,
  [zora.id]: zoraPublicClient,
};

export function getClientForChainId(chainId: number): Client {
  const client = clients[chainId];
  if (!client) {
    throw new Error(`Client not found for chainId: ${chainId}`);
  }
  return client;
}
