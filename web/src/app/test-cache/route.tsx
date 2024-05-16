import frameResponseWrapper from "@/utils/frameResponseWrapper";
import { relativeEndpointUrl } from "@/utils/urlHelpers";
import { NextRequest } from "next/server";
import { getCachedData, getData } from "./data";
import { getArtworkData } from "../superrare/data/queries/getArtworkData";
import { getAddress } from "viem";

async function response(req: NextRequest): Promise<Response> {
  console.log("CALLED");
  //   const data = await getData();
  //   const data = await getCachedData();
  const da = await getArtworkData({
    collectionAddress: getAddress("0x323D62e16d6Dc6d1b96ee789058b98a0d4C56752"),
    tokenId: BigInt(12),
  });
  console.log(da);

  return Response.json(da);
}

export const GET = response;
export const POST = response;

export const dynamic = "force-dynamic";
