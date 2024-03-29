import { FrameValidationData } from "@coinbase/onchainkit";
import { RsvpConfig } from "../configs";
import { isNftBalanceAboveThreshold } from "@/app/mint/commonChecks/nftBalance";
import { basePublicClient, mainnetPublicClient } from "@/utils/wallet";
import { getAddress } from "viem";
import { getNumApprovedGuestsForEvent } from "@/utils/luma";

const AUTO_REGISTER_CUTOFF_NUMBER = 80;

async function checkApprovalCriteria(payload: FrameValidationData): Promise<boolean> {
  // const address = getAddress(payload.interactor.verified_accounts[0]);

  // const promises = [
  //     isNftBalanceAboveThreshold(mainnetPublicClient, "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03", address, 0),
  //     isNftBalanceAboveThreshold(basePublicClient, "0x220e41499CF4d93a3629a5509410CBf9E6E0B109", address, 0),
  //     isNftBalanceAboveThreshold(mainnetPublicClient, "0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60", address, 0),
  // ];

  // let [nounsMember, yellowMember, purpleMember] = await Promise.all(promises);

  // const numApprovedGuests = await getNumApprovedGuestsForEvent(nounsDenverRsvpConfig.eventId);
  // console.log(numApprovedGuests);
  // const belowCutoff = numApprovedGuests <= AUTO_REGISTER_CUTOFF_NUMBER;

  return false; //(nounsMember || yellowMember || purpleMember) && belowCutoff;
}

export const nounsDenverRsvpConfig: RsvpConfig = {
  images: {
    home: { src: `${process.env.NEXT_PUBLIC_URL}/images/rsvp/nouns-denver/home.gif`, aspectRatio: "1:1" },
    soldOut: { src: `${process.env.NEXT_PUBLIC_URL}/images/rsvp/nouns-denver/sold-out.png`, aspectRatio: "1:1" },
    registered: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/rsvp/nouns-denver/registered.png`,
      aspectRatio: "1:1",
    },
    pendingApproval: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/rsvp/nouns-denver/pending-approval.png`,
      aspectRatio: "1:1",
    },
    ineligible: {
      src: `${process.env.NEXT_PUBLIC_URL}/images/rsvp/nouns-denver/ineligible.png`,
      aspectRatio: "1:1",
    },
  },
  eventUrl: "https://lu.ma/lc7fvt55",
  eventId: "evt-Pz0oijSSD8CzDD3",
  ticketTypeId: "evtticktyp-jsKbERlT0rCEdSi",
  maxNumTickets: 120,
  mintComposeTarget: `${process.env.NEXT_PUBLIC_URL}/mint/nouns-denver`,
  checkApprovalCriteria,
};
