/** @jsxImportSource frog/jsx */
import { Button, Frog } from "frog";
import { handle } from "frog/next";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
import { getDefaultSquareImageOptions } from "@/utils/imageOptions";
import { getSuperrareLiveMintData } from "@/data/superrare/queries/getSuperrareLiveMintData";
import { getAddress } from "viem";
import { detect } from "detect-browser";
import { SUPERRARE_BASE_URL } from "../../constants";
import Image, { getImageProps } from "next/image";
import ServerImage from "@/components/ServerImage";

const app = new Frog({
  basePath: "/superrare/live-mint-old",
  verify: false,
});

app.frame("/:collection-address", async (c) => {
  const collectionAddress = c.req.param("collection-address");
  const data = await getSuperrareLiveMintData(getAddress(collectionAddress));
  const link = `${SUPERRARE_BASE_URL}/releases/${collectionAddress}`;

  return c.res({
    image: data ? (
      <div
        tw="flex flex-col w-[600px] h-[600px] text-[20px] items-center justify-between text-[#FFFFFF] bg-[#232323]"
        style={{ WebkitFontSmoothing: "antialiased" }}
      >
        <div tw="flex flex-col items-center p-[40px] h-2/3">
          <ServerImage
            src={data.nextNft?.image ?? data.previousNfts[0].image}
            height={300}
            width={300}
            quality={50}
            tw="rounded-[6px] h-full shadow-2xl"
            style={{ objectFit: "cover" }}
            alt=""
          />
        </div>
        <div tw="flex flex-col bg-black w-full h-1/3 p-[20px]" style={{ gap: "20px" }}>
          <div tw="flex w-full border-2 border-white h-[10px] rounded-full shadow-none">
            <div
              tw="flex bg-white h-full"
              style={{ width: `${(Number(data.currentSupply) / Number(data.supplyCap)) * 100}%` }}
            />
          </div>
          <div tw="flex w-full justify-between">
            <div tw="flex" style={{ gap: "8px" }}>
              {data.previousNfts.map((nft, i) => (
                <ServerImage
                  src={nft.image}
                  width={125}
                  height={125}
                  quality={50}
                  style={{ objectFit: "cover" }}
                  tw="rounded-[8px]"
                  key={i}
                  alt=""
                />
              ))}
            </div>
            <div tw="flex flex-col">
              <div tw="flex">
                {data.currentSupply.toString()} / {data.supplyCap.toString()} minted
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div tw="flex flex-col w-[600px] h-[600px] p-[80px] text-[30px] items-center justify-between text-[#FFFFFF] bg-[#232323]">
        No mint data found
      </div>
    ),
    imageOptions: await getDefaultSquareImageOptions(["inter"], 600),
    browserLocation: link,
    imageAspectRatio: "1:1",
    intents: [
      <Button.Link key={1} href={link}>
        Mint
      </Button.Link>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
