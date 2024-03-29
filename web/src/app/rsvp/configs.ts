import { FrameImageMetadata, FrameValidationData } from "@coinbase/onchainkit";
import { nounsDenverRsvpConfig } from "./slugConfigs/nounsDenver";

export interface RsvpConfig {
  images: {
    home: FrameImageMetadata;
    soldOut: FrameImageMetadata;
    registered: FrameImageMetadata;
    pendingApproval: FrameImageMetadata;
    ineligible: FrameImageMetadata;
  };
  eventUrl: string;
  eventId: string;
  ticketTypeId: string;
  maxNumTickets: number;
  mintComposeTarget: string;
  checkApprovalCriteria: (payload: FrameValidationData) => Promise<boolean>;
}

export type SupportedRsvpSlug = "nouns-denver";

export const rsvpConfigs: Record<SupportedRsvpSlug, RsvpConfig> = {
  "nouns-denver": nounsDenverRsvpConfig,
};
