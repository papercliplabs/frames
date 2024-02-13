import { Address, PublicClient } from "viem";
import { readContract } from "viem/actions";
import { syndicateFrameNftAbi } from "@/abis/syndicateFrameNftAbi";

export async function isNftSoldOut(client: PublicClient, collectionAddress: Address): Promise<boolean> {
    const currentId = await readContract(client, {
        address: collectionAddress,
        abi: syndicateFrameNftAbi,
        functionName: "currentTokenId",
    });

    const maxSupply = await readContract(client, {
        address: collectionAddress,
        abi: syndicateFrameNftAbi,
        functionName: "maxSupply",
    });

    return currentId >= maxSupply;
}
