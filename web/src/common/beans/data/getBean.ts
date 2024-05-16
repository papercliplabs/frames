"use server";
import { beansClient } from "@/common/beans/config/client";
import { beansTokenContract } from "@/common/beans/config/contracts/token";
import { Address } from "viem";
import { SECONDS_PER_MONTH } from "@/utils/constants";
import { beansDescriptorContract } from "../config/contracts/descriptor";
import { parseBase64Json } from "@/common/utils/base64";
import { readContractCached } from "@/common/utils/caching/readContractCached";

interface GetBeanParams {
  beanId: bigint;
}

export interface Bean {
  id: bigint;

  ownerAddress: Address;

  seeds: {
    classOne: bigint;
    classTwo: bigint;
    size: bigint;
    helmetLib: bigint;
    helmet: bigint;
    gearLib: bigint;
    gear: bigint;
  };

  colors: {
    classOne: string;
    classTwo: string;
  };

  imgSrc: string;
}

export async function getBean({ beanId }: GetBeanParams): Promise<Bean> {
  const [ownerAddress, tokenUri, [classOne, classTwo, size, helmetLib, helmet, gearLib, gear]] = await Promise.all([
    readContractCached(
      beansClient,
      {
        ...beansTokenContract,
        functionName: "ownerOf",
        args: [beanId],
      },
      { revalidate: 30 }
    ),
    readContractCached(
      beansClient,
      {
        ...beansTokenContract,
        functionName: "tokenURI",
        args: [beanId],
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
    readContractCached(
      beansClient,
      {
        ...beansTokenContract,
        functionName: "seeds",
        args: [beanId],
      },
      { revalidate: SECONDS_PER_MONTH }
    ),
  ]);

  const [classOneColor, classTwoColor] = await Promise.all([
    readContractCached(
      beansClient,
      { ...beansDescriptorContract, functionName: "classOne", args: [classOne] },
      { revalidate: SECONDS_PER_MONTH }
    ),
    readContractCached(
      beansClient,
      { ...beansDescriptorContract, functionName: "classTwo", args: [classTwo] },
      { revalidate: SECONDS_PER_MONTH }
    ),
  ]);

  const imgSrc = parseBase64Json(tokenUri).image;

  return {
    id: beanId,

    ownerAddress,

    seeds: {
      classOne,
      classTwo,
      size,
      helmetLib,
      helmet,
      gearLib,
      gear,
    },

    colors: {
      classOne: "#" + classOneColor,
      classTwo: "#" + classTwoColor,
    },

    imgSrc: imgSrc as string,
  };
}
