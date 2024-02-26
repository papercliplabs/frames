import { CarouselConfig } from "../configs";

export const beansDungeonConfig: CarouselConfig = {
    navButtonConfig: {
        disablePrevNavigation: true,
        nextButtonLabel: "Attack ⚔️",
    },
    itemConfigs: [
        {
            image: {
                src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/00-door-idle.gif`,
                aspectRatio: "1.91:1",
            },
            navButtonConfigOverrides: {
                nextButtonLabel: "Quests complete, open door",
            },
        },
        {
            image: {
                src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/01-door-open5.gif`,
                aspectRatio: "1.91:1",
            },
            navButtonConfigOverrides: {
                nextButtonLabel: "Enter the dungeon ⬆️",
            },
        },
        {
            image: {
                src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/02-boss.gif`,
                aspectRatio: "1.91:1",
            },
        },
        {
            image: {
                src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/03-boss.gif`,
                aspectRatio: "1.91:1",
            },
        },
        {
            image: {
                src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/04-boss.gif`,
                aspectRatio: "1.91:1",
            },
        },
        {
            image: {
                src: `${process.env.NEXT_PUBLIC_URL}/images/carousel/beans-dungeon/05-boss.gif`,
                aspectRatio: "1.91:1",
            },
            buttonThreeConfig: {
                label: "Mint",
                target: `${process.env.NEXT_PUBLIC_URL}/mint/beans-dungeon/beans-entering-the-unknown`,
                action: "compose",
            },
        },
    ],
};
