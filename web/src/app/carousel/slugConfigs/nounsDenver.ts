import { CarouselConfig } from "../configs";

export const nounsDenverCarrouselConfig: CarouselConfig = {
  itemConfigs: [
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/nouns-denver/00-nouns-denver-nft.gif`,
        aspectRatio: "1:1",
      },
      navButtonConfigOverrides: {
        nextButtonLabel: "RSVP to Nouns Event + Mint this for FREE",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/nouns-denver/01-apply.gif`,
        aspectRatio: "1:1",
      },
      navButtonConfigOverrides: {
        nextButtonLabel: "More Events ➡️",
        disablePrevNavigation: true,
      },
      buttonThreeConfig: {
        label: "Apply to Attend",
        action: "compose",
        target: `${process.env.NEXT_PUBLIC_URL}/rsvp/nouns-denver`,
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/nouns-denver/02-item.gif`,
        aspectRatio: "1:1",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/nouns-denver/03-item.gif`,
        aspectRatio: "1:1",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/nouns-denver/04-item.gif`,
        aspectRatio: "1:1",
      },
      buttonFourConfig: {
        label: "FREE Mint",
        action: "compose",
        target: `${process.env.NEXT_PUBLIC_URL}/mint/nouns-denver`,
      },
    },
  ],
};
