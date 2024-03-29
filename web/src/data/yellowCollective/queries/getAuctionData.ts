import { Address } from "viem";
import { gql } from "../generated";
import { getYellowCollectiveApolloClient } from "../client";

const query = gql(/* GraphQL */ `
  query LiveAuction($id: ID!) {
    token(id: $id) {
      name
      image
      tokenId
      owner
      auction {
        startTime
        endTime
        extended
        highestBid {
          amount
          bidder
        }
        winningBid {
          amount
          bidder
        }
        settled
      }
    }
  }
`);

export async function getAuctionImage(collectionAddress: Address, tokenId: number): Promise<string> {
  const id = `${collectionAddress.toLowerCase()}:${tokenId.toString()}`;

  const { data } = await getYellowCollectiveApolloClient().query({
    query: query,
    variables: { id },
    context: {
      fetchOptions: {
        next: {
          revalidate: 15,
        },
      },
    },
  });

  return data.token?.image ?? "";
}
