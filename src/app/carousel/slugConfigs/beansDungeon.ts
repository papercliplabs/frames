import { CarouselConfig } from "../configs";

export const beansDungeonConfig: CarouselConfig = {
    navButtonConfig: {
        disablePrevNavigation: true,
        nextButtonLabel: "Attack ⚔️",
    },
    itemConfigs: [
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/door-idle.gif`,
            navButtonConfigOverrides: {
                nextButtonLabel: "Unlock the door 🔓",
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/door-open.gif`,
            navButtonConfigOverrides: {
                nextButtonLabel: "Enter the dungeon ⬆️",
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/boss-1.png`,
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/boss-1.png`,
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/boss-1.png`,
        },
    ],
};
