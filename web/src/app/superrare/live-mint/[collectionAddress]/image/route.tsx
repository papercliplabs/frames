import { NextRequest } from "next/server";
import { generateLayeredImageResponse } from "@/utils/generateLayeredImage";
import { getSuperrareLiveAuctionDetails } from "@/data/superrare/queries/getSuperrareLiveAuctionDetails";
import ServerImage from "@/components/ServerImage";
import { getSuperrareLiveMintData } from "@/data/superrare/queries/getSuperrareLiveMintData";
import { getAddress } from "viem";

export async function GET(req: NextRequest, { params }: { params: { collectionAddress: string } }): Promise<Response> {
  //   const utid = params.collectionAddress.toLowerCase() + "-" + params.tokenId;
  const data = await getSuperrareLiveMintData(getAddress(params.collectionAddress));

  console.log(data);

  return generateLayeredImageResponse({
    frameSize: {
      width: 600,
      height: 600,
    },
    backgroundColor: { r: 0xa, g: 0xa, b: 0xa },
    layers: data
      ? [
          //   {
          //     type: "static",
          //     // src: data.imageSrc,
          //     size: { width: 260, height: 260 },
          //     position: { left: 40, top: 168 },
          //     // animated: true,
          //     borderRadius: 20,
          //   },
          {
            type: "dynamic",
            src: (
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
            ),
            fontTypes: ["inter"],
            size: {
              width: 600,
              height: 600,
            },
          },
        ]
      : [
          {
            type: "dynamic",
            src: (
              <div tw="flex flex-col w-full h-full text-[#FFFFFF] justify-center items-center text-[24px] ">
                <div>No mint data found</div>
              </div>
            ),
            fontTypes: ["inter"],
            size: {
              width: 600,
              height: 600,
            },
          },
        ],
  });
}
