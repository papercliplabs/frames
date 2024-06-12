import { BigIntString } from "@/common/utils/bigInt";
import { FrameButtonMetadata } from "@coinbase/onchainkit/frame";
import { Address } from "viem";

export interface Erc20TransactionInputState {
  chainId: number;
  appName: string; // For logging only

  tokenAddress: Address; // zero address for ETH will bypass approval check/step
  spenderAddress: Address;
  tokenAmount: BigIntString;

  tryAgainFrameUrl: string;

  txFailedImgUrl: string;

  approvePendingImgUrl: string;
  approveSuccessImgUrl: string;
  actionName: string;

  actionTxEndpointUrl: string;
  actionPendingImgUrl: string;
  actionSuccessImgUrl: string;
  actionExitButtonConfig: FrameButtonMetadata;

  uuid: string; // Used to track the transaction, needs to be passed in since tx endpoint can't pass state
}
