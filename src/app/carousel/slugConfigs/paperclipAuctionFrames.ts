import { CarouselConfig } from "../configs";

export const paperclipAuctionFramesConfig: CarouselConfig = {
    itemConfigs: [
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/auction-frame-compilation-start.png`,
            redirectButtonConfig: {
                label: "paperclip.xyz",
                url: "https://paperclip.xyz",
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/nouns-auction-house.png`,
            // redirectButtonConfig: {
            //     label: "TEST REDIR",
            //     url: `${process.env.NEXT_PUBLIC_URL}/auction/nouns?${new URLSearchParams([
            //         ["compose-frame-button-label", "Back to compilation ↩️"],
            //         ["compose-frame-url", `${process.env.NEXT_PUBLIC_URL}/carousel/paperclip-auction-frames/1`],
            //     ]).toString()}`,
            // },
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/nouns?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩️"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/1`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/lil-nouns-auction-house.png`,
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/lil-nouns?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩️"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/2`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/beans-dao-auction-house.png`,
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/beans-dao?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩️"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/3`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/yellow-auction-house.png`,
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/yellow-collective?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩️"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/4`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/purple-auction-house.png`,
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/purple-dao?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩️"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/5`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/builder-dao-auction-house.png`,
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/builder-dao?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩️"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/6`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/energy-auction-house.png`,
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/energy-dao?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩️"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/7`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/based-dao-auction-house.png`,
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/based-dao?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩️"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/8`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/based-management-auction-house.png`,
            composeButtonConfig: {
                label: "Go To Frame ⬆️",
                postUrl: `${process.env.NEXT_PUBLIC_URL}/auction/based-management?${new URLSearchParams([
                    ["compose-frame-button-label", "Back to compilation ↩"],
                    ["compose-frame-url", `/carousel/paperclip-auction-frames/9`],
                ]).toString()}`,
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/auction-frame-compilation-end.png`,
            redirectButtonConfig: {
                label: "paperclip.xyz",
                url: "https://paperclip.xyz",
            },
        },
    ],
    // allowedCasterFids: [18655],
};
