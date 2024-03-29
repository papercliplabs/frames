import { Optional } from "@/utils/types";

export interface AuctionStatusProps {
  id: Optional<string>;
  imgSrc: Optional<string>;
  timeRemaining: Optional<string>;
  bid: Optional<string>;
  bidder: Optional<string>;
  collectionName: Optional<string>; // Ex: "Noun ", "Purple #"
  backgroundColor: Optional<string>;
  baseTextColor: Optional<string>;
  highlightTextColor: Optional<string>;
}
