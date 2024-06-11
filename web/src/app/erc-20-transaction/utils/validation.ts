import { FrameButtonMetadata, FrameValidationData } from "@coinbase/onchainkit/frame";
import { Address, Hex, getAddress, isHex } from "viem";
import { Erc20TransactionInputState } from "../types";

function validateIsString(value: unknown): string {
  if (typeof value != "string") {
    throw Error(`validateIsString - not a string - ${value}`);
  }
  return value;
}

function validateIsNumber(value: unknown): number {
  if (typeof value != "number") {
    throw Error(`validateIsNumber - not a number - ${value}`);
  }
  return value;
}

function validateFrameButtonMetadata(value: unknown): FrameButtonMetadata {
  if (typeof value != "object") {
    throw Error(`validateFrameButtonMetadata - not an object - ${value}`);
  }
  const action = (value as any)["action"];

  switch (action) {
    case "link":
    case "mint":
      validateIsString((value as any)["label"]);
      validateIsString((value as any)["target"]);
      break;

    case "post":
    case "post_redirect":
      validateIsString((value as any)["label"]);
      break;
    case "tx":
      validateIsString((value as any)["label"]);
      validateIsString((value as any)["target"]);
      break;

    default:
      throw Error(`validateFrameButtonMetadata - invalid type - ${action}`);
  }

  return value as FrameButtonMetadata;
}

export function extractAndValidateState(
  frameData: FrameValidationData
): Erc20TransactionInputState & { transactionHash?: Hex; userAddress?: Address; isApproval?: boolean } {
  let chainId: number;
  let appName: string;

  let tokenAddress: Address;
  let spenderAddress: Address;
  let tokenAmount: bigint;

  let tryAgainFrameUrl: string;

  let txFailedImgUrl: string;

  let approvePendingImgUrl: string;
  let approveSuccessImgUrl: string;
  let actionName: string;

  let actionTxEndpointUrl: string;
  let actionPendingImgUrl: string;
  let actionSuccessImgUrl: string;
  let actionExitButtonConfig: FrameButtonMetadata;

  let uuid: string;

  let transactionHash: Hex | undefined = undefined;

  let error: string | undefined;
  try {
    const decodedState = JSON.parse(decodeURIComponent(frameData.state.serialized)) as Erc20TransactionInputState;

    chainId = validateIsNumber(decodedState.chainId);
    appName = validateIsString(decodedState.appName);

    tokenAddress = getAddress(decodedState.tokenAddress); // throws if invalid
    spenderAddress = getAddress(decodedState.spenderAddress); // throws if invalid
    tokenAmount = BigInt(decodedState.tokenAmount); // throws if invalid

    tryAgainFrameUrl = validateIsString(decodedState.tryAgainFrameUrl); // throws if invalid

    txFailedImgUrl = validateIsString(decodedState.txFailedImgUrl);

    approvePendingImgUrl = validateIsString(decodedState.approvePendingImgUrl);
    approveSuccessImgUrl = validateIsString(decodedState.approveSuccessImgUrl);
    actionName = validateIsString(decodedState.actionName);

    actionTxEndpointUrl = validateIsString(decodedState.actionTxEndpointUrl);
    actionPendingImgUrl = validateIsString(decodedState.actionPendingImgUrl);
    actionSuccessImgUrl = validateIsString(decodedState.actionSuccessImgUrl);
    actionExitButtonConfig = validateFrameButtonMetadata(decodedState.actionExitButtonConfig);

    uuid = validateIsString(decodedState.uuid);

    const transactionHashInternal = (decodedState as any)["transactionHash"];
    if (transactionHashInternal != undefined) {
      if (!isHex(transactionHashInternal)) {
        throw Error(`Invalid transaction hash - ${transactionHashInternal}`);
      }
      transactionHash = transactionHashInternal;
    }
  } catch (err: unknown) {
    let errorLog = `Error: Invalid frame state - ${JSON.stringify(frameData)}, ${error}`;
    if (err instanceof Error) {
      errorLog += `- ${err.message}`;
    }
    throw new Error(errorLog);
  }

  return {
    chainId,
    appName,

    tokenAddress,
    spenderAddress,
    tokenAmount: tokenAmount.toString(),

    tryAgainFrameUrl,

    txFailedImgUrl,

    approvePendingImgUrl,
    approveSuccessImgUrl,
    actionName,

    actionPendingImgUrl,
    actionSuccessImgUrl,
    actionExitButtonConfig,
    actionTxEndpointUrl,

    uuid,

    transactionHash,
  };
}
