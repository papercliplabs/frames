import { BigIntString } from "@/common/utils/bigInt";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { Address } from "viem";

export interface Erc20TransactionInputState {
  chainId: number;

  tokenAddress: Address; // zero address for ETH will bypass approval check/step
  spenderAddress: Address;
  tokenAmount: BigIntString;

  tryAgainFrameUrl: string;

  txPendingImgUrl: string;
  txFailedImgUrl: string;

  approveSuccessImgUrl: string;
  actionName: string;

  actionSuccessImgUrl: string;
  actionExitButtonConfig: FrameButtonMetadata;
  actionTxEndpointUrl: string;
}
