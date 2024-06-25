import { localImageUrl } from "@/utils/urlHelpers";
import { FrameButtonMetadata, FrameImageMetadata } from "@coinbase/onchainkit/frame";

interface FrameConfig {
  image: FrameImageMetadata;
  buttons: [FrameButtonMetadata, ...FrameButtonMetadata[]];
}

export const FRAME_CONFIGS: Record<number, FrameConfig> = {
  [0]: {
    image: {
      src: localImageUrl("/nouns-town/home.png"),
      aspectRatio: "1:1",
    },
    buttons: [{ label: "Learn More!", target: `${process.env.NEXT_PUBLIC_URL}/nouns-town/1` }],
  },
  [1]: {
    image: {
      src: localImageUrl("/nouns-town/schedule.png"),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Prev", target: `${process.env.NEXT_PUBLIC_URL}/nouns-town/0` },
      { label: "Next", target: `${process.env.NEXT_PUBLIC_URL}/nouns-town/2` },
      { label: "Join Waitlist", target: `${process.env.NEXT_PUBLIC_URL}/nouns-town/join-waitlist` },
    ],
  },
  [2]: {
    image: {
      src: localImageUrl("/nouns-town/join-waitlist.png"),
      aspectRatio: "1:1",
    },
    buttons: [
      { label: "Prev", target: `${process.env.NEXT_PUBLIC_URL}/nouns-town/1` },
      { label: "Join Waitlist", target: `${process.env.NEXT_PUBLIC_URL}/nouns-town/join-waitlist` },
    ],
  },
};
