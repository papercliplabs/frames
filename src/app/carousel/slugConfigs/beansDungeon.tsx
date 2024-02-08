import { CarouselConfig } from "../configs";

export const beansDungeonConfig: CarouselConfig = {
    navButtonConfig: {
        disablePrevNavigation: true,
        nextButtonLabel: "Attack ⚔️",
    },
    itemConfigs: [
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/based-dao-auction-house.png`,
            navButtonConfigOverrides: {
                nextButtonLabel: "Enter the dungeon ⬆️",
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/purple-auction-house.png`,
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/nouns-auction-house.png`,
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/yellow-auction-house.png`,
        },
    ],
};
