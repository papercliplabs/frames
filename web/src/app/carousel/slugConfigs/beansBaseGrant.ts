import { CarouselConfig } from "../configs";

export const beansBaseGrantConfig: CarouselConfig = {
  navButtonConfig: {
    prevButtonLabel: "Prev",
    nextButtonLabel: "Next",
  },
  itemConfigs: [
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-base-grant/1.png`,
        aspectRatio: "1:1",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-base-grant/2.png`,
        aspectRatio: "1:1",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-base-grant/3.png`,
        aspectRatio: "1:1",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-base-grant/4.png`,
        aspectRatio: "1:1",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-base-grant/5.png`,
        aspectRatio: "1:1",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-base-grant/6.jpeg`,
        aspectRatio: "1:1",
      },
      buttonThreeConfig: {
        label: "Mint",
        target: `${process.env.NEXT_PUBLIC_URL}/mint/beans-base-grant`,
        action: "compose",
      },
      buttonFourConfig: {
        label: "Artist",
        target: "https://warpcast.com/bodegacatceo",
        action: "link",
      },
    },
  ],
};
