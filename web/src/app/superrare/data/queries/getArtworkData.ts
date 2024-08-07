import { Address, getAddress } from "viem";
import { gql } from "../generated";
import { getSuperrareApolloClient } from "../client";
import { fetchIpfsData } from "@/utils/fetchIpfsDats";
import { User, getUserData } from "./getUserData";
import { readContractCached } from "@/common/utils/caching/readContractCached";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { customUnstableCache } from "@/common/utils/caching/customUnstableCache";
import { baseNft } from "../../abis/baseNft";
import { SUPERRARE_CHAIN_CONFIG } from "../../config";

interface GetArtworkDataParams {
  collectionAddress: Address;
  tokenId: bigint;
}

export interface ArtworkData {
  title: string;
  imageSrc: string;
  creator: User;
}

async function getArtworkDataUncached(params: GetArtworkDataParams): Promise<ArtworkData | null> {
  try {
    let artworkData = await getArtworkDataFromGraphqlApi(params);

    // If we can't get it from Superrare's graphql API, try to get it directly (this is the case with un-minted art)
    if (!artworkData) {
      artworkData = await getArtworkDataFromContractAndIpfs(params);
    }

    if (!artworkData) {
      console.error("getArtworkData - none found for", params);
    }

    return artworkData;
  } catch (e) {
    console.error("getArtworkData - error:", params, e);
    return null;
  }
}

async function getArtworkDataFromGraphqlApi({
  collectionAddress,
  tokenId,
}: GetArtworkDataParams): Promise<ArtworkData | null> {
  const utid = collectionAddress.toLowerCase() + "-" + tokenId.toString();
  const query = gql(/* GraphQL */ `
    query ArtworkData($universalTokenId: [String!]!) {
      nftByUtid(universalTokenId: $universalTokenId) {
        tokenNumber
        tokenContractAddress
        metadata {
          title
          proxyImageMediumUri
          originalMediaUri
          originalThumbnailUri
        }
        creator {
          primaryAddress
        }
      }
    }
  `);

  const { data } = await getSuperrareApolloClient().query({
    query,
    variables: { universalTokenId: [utid.toLowerCase()] },
    context: {
      fetchOptions: {
        next: {
          revalidate: 15,
        },
      },
    },
  });

  const nft = data.nftByUtid[0];

  const title = nft?.metadata?.title;

  let imageSrc = nft?.metadata?.proxyImageMediumUri ?? nft?.metadata?.originalMediaUri;

  // Avif animated format is not supported by image generation
  if (imageSrc?.includes("avif")) {
    imageSrc = nft?.metadata?.originalThumbnailUri ?? imageSrc;
  }

  if (!nft || !title || !imageSrc) {
    return null;
  }

  const creator = await getUserData({ userAddress: getAddress(nft.creator.primaryAddress) });

  if (!creator) {
    return null;
  }

  return { title, imageSrc, creator };
}

interface IpfsNftData {
  name: string;
  image: string;
}

async function getArtworkDataFromContractAndIpfs({
  collectionAddress,
  tokenId,
}: GetArtworkDataParams): Promise<ArtworkData | null> {
  let tokenUri: string;
  let tokenCreator: Address;
  try {
    [tokenUri, tokenCreator] = await Promise.all([
      readContractCached(
        SUPERRARE_CHAIN_CONFIG.client,
        {
          address: collectionAddress,
          abi: baseNft,
          functionName: "tokenURI",
          args: [tokenId],
        },
        { revalidate: SECONDS_PER_DAY }
      ),
      readContractCached(
        SUPERRARE_CHAIN_CONFIG.client,
        {
          address: collectionAddress,
          abi: baseNft,
          functionName: "tokenCreator",
          args: [tokenId],
        },
        { revalidate: SECONDS_PER_DAY }
      ),
    ]);
  } catch (e) {
    // Fallback to owner if tokenCreator doesn't exist
    [tokenUri, tokenCreator] = await Promise.all([
      readContractCached(
        SUPERRARE_CHAIN_CONFIG.client,
        {
          address: collectionAddress,
          abi: baseNft,
          functionName: "tokenURI",
          args: [tokenId],
        },
        { revalidate: SECONDS_PER_DAY }
      ),
      readContractCached(
        SUPERRARE_CHAIN_CONFIG.client,
        {
          address: collectionAddress,
          abi: baseNft,
          functionName: "owner",
          args: [],
        },
        { revalidate: SECONDS_PER_DAY }
      ),
    ]);
  }

  const [nftData, creator] = await Promise.all([
    fetchIpfsData<IpfsNftData>(tokenUri),
    getUserData({ userAddress: tokenCreator }),
  ]);

  if (!nftData || !creator) {
    return null;
  }

  return {
    title: nftData.name,
    imageSrc: nftData.image,
    creator,
  };
}

export const getArtworkData = customUnstableCache(getArtworkDataUncached, ["get-artwork-data"], {
  revalidate: SECONDS_PER_DAY, // Every day, really should never change
});
