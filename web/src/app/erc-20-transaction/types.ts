import { BigIntString } from "@/common/utils/bigInt";
import { Address } from "viem";

export interface Erc20TransactionInputState {
  chainId: number;
  tokenAddress: Address;
  spenderAddress: Address;
  tokenAmount: BigIntString;
  targetTxUrl: string;

  entryFrameUrl: string;
  exitFrameUrl: string;
}
