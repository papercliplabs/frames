import { NounsBuilderAuction } from "@/common/nounsBuilder/data/getCurrentAuction";
import { NounsBuilderToken } from "@/common/nounsBuilder/data/getToken";
import { Address, Client } from "viem";
import { gnarsAuctionConfig } from "./slugConfigs/gnars";
import { SupportedTransactionFlowSlug } from "@/app/transaction-flow/config";
import { purpleAuctionConfig } from "./slugConfigs/purple";
import { energyAuctionConfig } from "./slugConfigs/energy";
import { yellowCollectiveAuctionConfig } from "./slugConfigs/yellow";
import { africaAuctionConfig } from "./slugConfigs/africa";

export type SupportedNounsBuilderDao = "gnars" | "purple" | "energy" | "yellow-collective" | "africa";

export interface NounsBuilderAuctionConfig {
  client: Client;
  collectionAddress: Address;
  frontendUrl: string;
  imageResponse: (token: NounsBuilderToken, auction: NounsBuilderAuction) => Promise<Response>;
  transactionFlowSlug: SupportedTransactionFlowSlug;
}

export const nounsBuilderAuctionConfigs: Record<SupportedNounsBuilderDao, NounsBuilderAuctionConfig> = {
  gnars: gnarsAuctionConfig,
  purple: purpleAuctionConfig,
  energy: energyAuctionConfig,
  "yellow-collective": yellowCollectiveAuctionConfig,
  africa: africaAuctionConfig,
};
