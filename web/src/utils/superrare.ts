import { getSuperrareApolloClient } from "@/graphql/apolloClient";
import { gql } from "@/graphql/generated";
import { Address, getAddress } from "viem";
import { shortenAddress } from "./wallet";
import { CurrencyType } from "@/graphql/generated/graphql";
import { formatNumber, formatTimeLeft } from "./format";

export const SUPERRARE_BASE_URL = "https://superrare.com";

export interface LiveAuction {
    contractAddress: Address;
    tokenId: BigInt;
    title: string;
    imageSrc: string;
    link: string;
    timeFormatted: string; // Time to start when not-started, otherwise time left
    creatorName: string;
    creatorAvatarSrc?: string;
    status: "not-started" | "underway" | "finished";
    highestBidderName?: string;
    highestBidderAvatarSrc?: string;
    highestBidFormatted: string;
}

export async function getSuperrareLiveAuctionDetails(utid: string): Promise<LiveAuction | undefined> {
    const liveAuctionQuery = gql(/* GraphQL */ `
        query LiveAuction($universalTokenId: String!) {
            auctionByUtid(universalTokenId: $universalTokenId) {
                bid {
                    amount
                    bidder {
                        primaryProfile {
                            sr {
                                srName
                                srAvatarUri
                            }
                            ens {
                                ensAvatarUri
                                ensName
                            }
                        }
                        primaryAddress
                    }
                    currencyType
                }
                startTime
                endTime
                nft {
                    tokenNumber
                    tokenContractAddress
                    metadata {
                        title
                        proxyImageMediumUri
                    }
                    creator {
                        primaryProfile {
                            sr {
                                srName
                                srAvatarUri
                            }
                            ens {
                                ensAvatarUri
                                ensName
                            }
                        }
                        primaryAddress
                    }
                }
            }
        }
    `);

    const { data } = await getSuperrareApolloClient().query({
        query: liveAuctionQuery,
        variables: { universalTokenId: utid },
        context: {
            fetchOptions: {
                next: {
                    revalidate: 15,
                },
            },
        },
    });

    const auction = data.auctionByUtid[0];

    const startTime = auction?.startTime;
    const endTime = auction?.endTime;
    const imageSrc = auction?.nft?.metadata?.proxyImageMediumUri;
    const title = auction?.nft?.metadata?.title;
    const creator = auction?.nft?.creator;
    const bidder = auction?.bid?.bidder;
    const contractAddress = auction?.nft?.tokenContractAddress
        ? getAddress(auction?.nft?.tokenContractAddress)
        : undefined;
    const tokenId = auction?.nft?.tokenNumber ? BigInt(auction.nft.tokenNumber) : undefined;

    const creatorName = creator?.primaryProfile.sr?.srName
        ? "@" + creator.primaryProfile.sr.srName
        : creator?.primaryProfile.ens?.ensName ??
          (creator?.primaryAddress ? shortenAddress(creator?.primaryAddress) : undefined);
    const highestBidderName = bidder?.primaryProfile.sr?.srName
        ? "@" + bidder.primaryProfile.sr.srName
        : bidder?.primaryProfile.ens?.ensName ??
          (bidder?.primaryAddress ? shortenAddress(bidder?.primaryAddress) : undefined);
    const currencyType = auction?.bid?.currencyType;
    const highestBid = auction?.bid?.amount;

    // Not required
    const creatorAvatarSrc =
        creator?.primaryProfile.sr?.srAvatarUri ?? creator?.primaryProfile.ens?.ensAvatarUri ?? undefined;
    const highestBidderAvatarSrc =
        bidder?.primaryProfile.sr?.srAvatarUri ?? bidder?.primaryProfile.ens?.ensAvatarUri ?? undefined;

    if (
        contractAddress == undefined ||
        tokenId == undefined ||
        !title ||
        !imageSrc ||
        !startTime ||
        !endTime ||
        !creatorName ||
        (highestBid && !(highestBidderName || currencyType))
    ) {
        console.error("Missing auction data for ", utid, JSON.stringify(auction));
        return undefined;
    }

    let currencySymbol = "Ξ";
    switch (currencyType) {
        case CurrencyType.Usd:
            currencySymbol = "USDC";
            break;
        case CurrencyType.Rare:
            currencySymbol = "RARE";
            break;
    }

    const nowS = Date.now() / 1000;
    const startTimeS = new Date(startTime).getTime() / 1000;
    const endTimeS = new Date(endTime).getTime() / 1000;
    const timeLeftS = Math.max(endTimeS - nowS, 0);
    const timeToStartS = Math.max(startTimeS - nowS, 0);

    const status = nowS < startTimeS ? "not-started" : timeLeftS == 0 ? "finished" : "underway";
    const timeFormatted = formatTimeLeft(status == "not-started" ? timeToStartS : timeLeftS);
    const highestBidFormatted = `${formatNumber(highestBid ?? 0, 4)} ${currencySymbol}`;

    return {
        contractAddress,
        tokenId,
        title,
        imageSrc,
        link: SUPERRARE_BASE_URL + `/${contractAddress}/${tokenId}`,
        timeFormatted,
        creatorName,
        creatorAvatarSrc,
        status,
        highestBidderName,
        highestBidderAvatarSrc,
        highestBidFormatted,
    };
}
