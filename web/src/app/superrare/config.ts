import { mainnetPublicClient, sepoliaPublicClient } from "@/common/utils/walletClients";
import { Address, Client, getAddress } from "viem";
import { mainnet, sepolia } from "viem/chains";

// Config to sepolia for dev
// const SUPERRARE_CHAIN_ID = mainnet.id;
const SUPERRARE_CHAIN_ID = sepolia.id;

// TODO(delete): RARE mint on sepolia - 0x72F2FBB0F991470661351fC5F6F8eb10b3Bcd4d7

interface SuperrareConfig {
  client: Client;
  superrareNetworkFeePercent: bigint;
  superrareBaseUrl: string;
  addresses: {
    superrareBazaar: Address; // proxy
    superrareMinter: Address; // proxy
    rareToken: Address;
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
      rareToken: getAddress("0xba5bde662c17e2adff1075610382b9b691296350"),
    },
  },
  [sepolia.id]: {
    client: sepoliaPublicClient,
    superrareNetworkFeePercent: BigInt(3),
    superrareBaseUrl: "https://superrare.com",
    addresses: {
      superrareBazaar: getAddress("0xC8Edc7049b233641ad3723D6C60019D1c8771612"),
      superrareMinter: getAddress("0xd28Dc0B89104d7BBd902F338a0193fF063617ccE"),
      rareToken: getAddress("0x197FaeF3f59eC80113e773Bb6206a17d183F97CB"),
    },
  },
};

export const SUPERRARE_CHAIN_CONFIG = CHAIN_CONFIGS[SUPERRARE_CHAIN_ID]!;
