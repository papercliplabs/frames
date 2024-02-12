import { CarouselConfig } from "../configs";

export const beansDungeonNoMintConfig: CarouselConfig = {
    navButtonConfig: {
        disablePrevNavigation: true,
        nextButtonLabel: "Attack ⚔️",
    },
    itemConfigs: [
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/00-door-idle.gif`,
            navButtonConfigOverrides: {
                nextButtonLabel: "Unlock the door 🔓",
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/01-door-open5.gif`,
            navButtonConfigOverrides: {
                nextButtonLabel: "Enter the dungeon ⬆️",
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/02-boss.gif`,
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/03-boss.gif`,
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/04-boss.gif`,
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/05-boss.gif`,
            navButtonConfigOverrides: {
                nextButtonLabel: "You defeated the boss!",
            },
        },
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/06-saved-beans-no-mint.gif`,
            redirectButtonConfig: {
                label: "BEANSDAO",
                url: "https://beans.wtf",
            },
        },
    ],
};
