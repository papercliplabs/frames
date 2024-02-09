import { Address, PublicClient, formatEther } from "viem";
import { basePublicClient, mainnetPublicClient, zoraPublicClient } from "@/utils/wallet";
import { FontType } from "@/utils/baseImg";
import {
    AuctionDetails,
    GetAuctionDetailsParams,
    getBeansDaoAuctionDetails,
    getNounBuilderAuctionDetails,
    getNounOgAuctionDetails,
} from "./getAuctionDetails";
import React, { ReactElement } from "react";
import NounAuctionStatus from "./components/NounAuctionStatus";
import BeansAuctionStatus from "./components/BeansAuctionStatus";
import { AuctionStatusProps } from "./components/AuctionStatusProps";

export interface AuctionConfig {
    client: PublicClient;
    auctionAddress: Address;
    tokenAddress: Address;
    getAuctionDetails: (params: GetAuctionDetailsParams) => Promise<AuctionDetails>;
    auctionStatusComponent: React.ComponentType<AuctionStatusProps>;
    firstPageImage: string;
    title: string;
    description: string;
    auctionUrl: string;
    tokenNamePrefix: string;
    style: {
        backgroundColor: string;
        textColor: string;
        fontType: FontType;
    };
}

export type SupportedAuctionDao =
    | "nouns"
    | "yellow-collective"
    | "purple-dao"
    | "based-dao"
    | "builder-dao"
    | "based-management"
    | "lil-nouns"
    | "energy-dao"
    | "beans-dao";

export const auctionConfigs: Record<SupportedAuctionDao, AuctionConfig> = {
    nouns: {
        client: mainnetPublicClient,
        auctionAddress: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
        tokenAddress: "0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/nouns-auction-house.png`,
        getAuctionDetails: getNounOgAuctionDetails,
        auctionStatusComponent: NounAuctionStatus,
        title: "Nouns DAO",
        description: "One Noun everyday, forever!",
        auctionUrl: "https://nouns.wtf",
        tokenNamePrefix: "Noun ",
        style: {
            backgroundColor: "white",
            textColor: "black",
            fontType: "londrina",
        },
    },
    "yellow-collective": {
        client: basePublicClient,
        auctionAddress: "0x0aa23a7e112889c965010558803813710becf263",
        tokenAddress: "0x220e41499CF4d93a3629a5509410CBf9E6E0B109",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/yellow-auction-house.png`,
        getAuctionDetails: getNounBuilderAuctionDetails,
        auctionStatusComponent: NounAuctionStatus,
        title: "The Yellow Collective",
        description:
            "An onchain club on the BASE Ethereum L2 network, designed to support and empower artists and creatives in the Nouns and Superchain ecosystems.",
        auctionUrl: "https://yellowcollective.xyz",
        tokenNamePrefix: "Collective Noun #",
        style: {
            backgroundColor: "#FBCB07",
            textColor: "black",
            fontType: "pally",
        },
    },
    "purple-dao": {
        client: mainnetPublicClient,
        auctionAddress: "0x43790fe6bd46b210eb27f01306c1d3546aeb8c1b",
        tokenAddress: "0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/purple-auction-house.png`,
        getAuctionDetails: getNounBuilderAuctionDetails,
        auctionStatusComponent: NounAuctionStatus,
        title: "Purple DAO",
        description: "Purple is a DAO whose goal is to proliferate and expand the Farcaster protocol and ecosystem.",
        auctionUrl: "https://purple.construction",
        tokenNamePrefix: "Purple #",
        style: {
            backgroundColor: "#7649C7",
            textColor: "white",
            fontType: "inter",
        },
    },
    "based-dao": {
        client: basePublicClient,
        auctionAddress: "0x0d2790f4831bdfd6a8fd21c6f591bb69496b5e91",
        tokenAddress: "0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/based-dao-auction-house.png`,
        getAuctionDetails: getNounBuilderAuctionDetails,
        auctionStatusComponent: NounAuctionStatus,
        title: "BASED DAO",
        description:
            "Our mission is to ignite identity, foster a vibrant community, establish effective governance, and cultivate a robust treasury that empowers and benefits our collective",
        auctionUrl: "https://nouns.build/dao/base/0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf",
        tokenNamePrefix: "BASED DAO #",
        style: {
            backgroundColor: "#334afb",
            textColor: "white",
            fontType: "inter",
        },
    },
    "builder-dao": {
        client: mainnetPublicClient,
        auctionAddress: "0x658d3a1b6dabcfbaa8b75cc182bf33efefdc200d",
        tokenAddress: "0xdf9b7d26c8fc806b1ae6273684556761ff02d422",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/builder-dao-auction-house.png`,
        getAuctionDetails: getNounBuilderAuctionDetails,
        auctionStatusComponent: NounAuctionStatus,
        title: "BASED DAO",
        description:
            "Builder DAO is dedicated to the creation and development of free and accessible DAO infrastructure as a public good.",
        auctionUrl: "https://nouns.build/dao/ethereum/0xdf9b7d26c8fc806b1ae6273684556761ff02d422/408",
        tokenNamePrefix: "Builder #",
        style: {
            backgroundColor: "#0088ff",
            textColor: "black",
            fontType: "inter",
        },
    },
    "based-management": {
        client: basePublicClient,
        auctionAddress: "0x629c4e852beb467af0b15587b07d71b957b61c8a",
        tokenAddress: "0xB78b89EB81303a11CC597B4519035079453d8E31",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/based-management-auction-house.png`,
        getAuctionDetails: getNounBuilderAuctionDetails,
        auctionStatusComponent: NounAuctionStatus,
        title: "Based Management One",
        description: "Based Management is the culture layer of the Base chain.",
        auctionUrl: "https://nouns.build/dao/base/0xB78b89EB81303a11CC597B4519035079453d8E31",
        tokenNamePrefix: "Based Management One #",
        style: {
            backgroundColor: "#135eff",
            textColor: "white",
            fontType: "inter",
        },
    },
    "lil-nouns": {
        client: mainnetPublicClient,
        auctionAddress: "0x55e0F7A3bB39a28Bd7Bcc458e04b3cF00Ad3219E",
        tokenAddress: "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/lil-nouns-auction-house.png`,
        getAuctionDetails: getNounOgAuctionDetails,
        auctionStatusComponent: NounAuctionStatus,
        title: "Lil Nouns",
        description: "Lil Nouns are just like Nouns, but Lil!",
        auctionUrl: "https://lilnouns.wtf",
        tokenNamePrefix: "Lil Noun ",
        style: {
            backgroundColor: "#7cc5f2",
            textColor: "white",
            fontType: "londrina",
        },
    },
    "energy-dao": {
        client: zoraPublicClient,
        auctionAddress: "0x94eed78a8e3e862d195cdde333a2201f6517ad97",
        tokenAddress: "0x32297b7416294b1acf404b6148a3c58107ba8afd",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/energy-auction-house.png`,
        getAuctionDetails: getNounBuilderAuctionDetails,
        auctionStatusComponent: NounAuctionStatus,
        title: "Energy DAO",
        description:
            "ENERGY is a creative grants collective. We fund creative arts and engineering projects on Zora Network.",
        auctionUrl: "https://nouns.build/dao/zora/0x32297b7416294b1acf404b6148a3c58107ba8afd",
        tokenNamePrefix: "Energy #",
        style: {
            backgroundColor: "white",
            textColor: "black",
            fontType: "inter",
        },
    },
    "beans-dao": {
        client: mainnetPublicClient,
        auctionAddress: "0xA2Ccbcb596FBA2CCB4552D599119C328078Bb07c",
        tokenAddress: "0x4A458eEA1954EfC6d8acCdaB82af031c33Ef72FE",
        firstPageImage: `${process.env.NEXT_PUBLIC_URL}/images/beans-dao-auction-house.png`,
        getAuctionDetails: getBeansDaoAuctionDetails,
        auctionStatusComponent: BeansAuctionStatus,
        title: "Beans DAO",
        description: "Beans are an experimental attempt to improve the formation of on-chain avatar communities.",
        auctionUrl: "https://beans.wtf",
        tokenNamePrefix: "BEAN #",
        style: {
            backgroundColor: "black",
            textColor: "white",
            fontType: "druk",
        },
    },
};
