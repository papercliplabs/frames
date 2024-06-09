import { mainnetPublicClient, sepoliaPublicClient } from "@/common/utils/walletClients";
import { Address, Client, getAddress } from "viem";
import { mainnet, sepolia } from "viem/chains";

// Config to sepolia for dev
// const SUPERRARE_CHAIN_ID = mainnet.id;
const SUPERRARE_CHAIN_ID = sepolia.id;

interface SuperrareConfig {
  client: Client;
  superrareNetworkFeePercent: bigint;
  superrareBaseUrl: string;
  addresses: {
    superrareBazaar: Address; // proxy
    superrareMinter: Address; // proxy
  };
}

const CHAIN_CONFIGS: Record<number, SuperrareConfig> = {
  [mainnet.id]: {
    client: mainnetPublicClient,
    superrareNetworkFeePercent: BigInt(3),
    superrareBaseUrl: "https://superrare.com",
    addresses: {
      superrareBazaar: getAddress("0x6d7c44773c52d396f43c2d511b81aa168e9a7a42"),
      superrareMinter: getAddress("0x5fa112efed8297bec0010b312208d223e0ce891e"),
    },
  },
  [sepolia.id]: {
    client: sepoliaPublicClient,
    superrareNetworkFeePercent: BigInt(3),
    superrareBaseUrl: "https://superrare.com",
    addresses: {
      superrareBazaar: getAddress("0xC8Edc7049b233641ad3723D6C60019D1c8771612"),
      superrareMinter: getAddress("0xC8Edc7049b233641ad3723D6C60019D1c8771612"), // UNKNOWN right now
    },
  },
};

export const SUPERRARE_CHAIN_CONFIG = CHAIN_CONFIGS[SUPERRARE_CHAIN_ID]!;
