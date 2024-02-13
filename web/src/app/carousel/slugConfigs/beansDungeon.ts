import { CarouselConfig } from "../configs";

export const beansDungeonConfig: CarouselConfig = {
    navButtonConfig: {
        disablePrevNavigation: true,
        nextButtonLabel: "Attack ⚔️",
    },
    itemConfigs: [
        {
            imgSrc: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/00-door-idle.gif`,
            navButtonConfigOverrides: {
                nextButtonLabel: "Quests complete, open door",
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
        },
    ],
};
