import { basePublicClient } from "@/utils/wallet";
import { getAddress } from "viem";

export const vrbsPublicClient = basePublicClient;

// Base multisig for now
export const PAPERCLIP_LABS_REFERRAL_ADDRESS = getAddress("0x1C937764e433878c6eB1820bC5a1A42c6f25dA81");
