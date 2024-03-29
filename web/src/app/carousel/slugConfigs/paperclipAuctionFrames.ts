import { CarouselConfig } from "../configs";

export const paperclipAuctionFramesConfig: CarouselConfig = {
  itemConfigs: [
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/auction-frame-compilation-start.png`,
        aspectRatio: "1.91:1",
      },
      buttonThreeConfig: {
        label: "paperclip.xyz",
        target: "https://paperclip.xyz",
        action: "link",
      },
    },
    {
      image: { src: `${process.env.NEXT_PUBLIC_URL}/images/nouns-auction-house.png`, aspectRatio: "1.91:1" },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/nouns?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩️"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/1`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: { src: `${process.env.NEXT_PUBLIC_URL}/images/lil-nouns-auction-house.png`, aspectRatio: "1.91:1" },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/lil-nouns?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩️"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/2`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: { src: `${process.env.NEXT_PUBLIC_URL}/images/beans-dao-auction-house.png`, aspectRatio: "1.91:1" },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/beans-dao?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩️"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/3`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: { src: `${process.env.NEXT_PUBLIC_URL}/images/yellow-auction-house.png`, aspectRatio: "1.91:1" },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/yellow-collective?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩️"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/4`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: { src: `${process.env.NEXT_PUBLIC_URL}/images/purple-auction-house.png`, aspectRatio: "1.91:1" },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/purple-dao?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩️"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/5`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/builder-dao-auction-house.png`,
        aspectRatio: "1.91:1",
      },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/builder-dao?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩️"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/6`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: { src: `${process.env.NEXT_PUBLIC_URL}/images/energy-auction-house.png`, aspectRatio: "1.91:1" },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/energy-dao?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩️"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/7`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: { src: `${process.env.NEXT_PUBLIC_URL}/images/based-dao-auction-house.png`, aspectRatio: "1.91:1" },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/based-dao?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩️"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/8`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/based-management-auction-house.png`,
        aspectRatio: "1.91:1",
      },
      buttonThreeConfig: {
        label: "Go To Frame ⬆️",
        target: `${process.env.NEXT_PUBLIC_URL}/auction/based-management?${new URLSearchParams([
          ["compose-frame-button-label", "Back to compilation ↩"],
          ["compose-frame-url", `/carousel/paperclip-auction-frames/9`],
        ]).toString()}`,
        action: "compose",
      },
    },
    {
      image: {
        src: `${process.env.NEXT_PUBLIC_URL}/images/auction-frame-compilation-end.png`,
        aspectRatio: "1.91:1",
      },
      buttonThreeConfig: {
        label: "paperclip.xyz",
        target: "https://paperclip.xyz",
        action: "link",
      },
    },
  ],
  // allowedCasterFids: [18655],
};
