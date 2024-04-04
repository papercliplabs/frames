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

const app = new Frog({
  basePath: "/superrare/live-mint",
  verify: false,
});

app.frame("/:collection-address", async (c) => {
  const collectionAddress = c.req.param("collection-address");
  const data = await getSuperrareLiveMintData(getAddress(collectionAddress));
  const link = `${SUPERRARE_BASE_URL}/releases/${collectionAddress}`;

  // Handle redirect if clicked on frame
  const browser = detect(c.req.header("user-agent") ?? "");
  if (browser?.name) {
    return Response.redirect(link);
  }

  return c.res({
    image: data ? (
      <div tw="flex flex-col w-[1200px] h-[1200px] text-[40px] items-center justify-between text-[#FFFFFF] bg-[#232323] antialiased">
        <div tw="flex flex-col items-center p-[80px] h-2/3">
          <img src={data.nextNft.image} tw="rounded-[16px] h-full shadow-2xl" style={{ objectFit: "cover" }} />
        </div>
        <div tw="flex flex-col bg-black w-full h-1/3 p-[40px]" style={{ gap: "40px" }}>
          <div tw="flex w-full border-4 border-white h-[20px] rounded-full shadow-none">
            <div
              tw="flex bg-white h-full"
              style={{ width: `${(Number(data.currentSupply) / Number(data.supplyCap)) * 100}%` }}
            />
          </div>
          <div tw="flex w-full justify-between">
            <div tw="flex" style={{ gap: "16px" }}>
              {data.previousNfts.map((nft, i) => (
                <img
                  src={nft.image}
                  width={250}
                  height={250}
                  style={{ objectFit: "cover" }}
                  tw="rounded-[16px]"
                  key={i}
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
      <div tw="flex flex-col w-[1200px] h-[1200px] p-[80px] text-[48px] items-center justify-between text-[#FFFFFF] bg-[#232323]">
        No mint data found
      </div>
    ),
    imageOptions: await getDefaultSquareImageOptions(["inter"]),
    imageAspectRatio: "1:1",
    intents: [
      <Button key={1}>Refresh</Button>,
      <Button.Link key={2} href={link}>
        Mint
      </Button.Link>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
