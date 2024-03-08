import { Address, Client } from "viem";
import { readContract } from "viem/actions";
import { erc721Abi } from "viem";

async function getOwnerNftBalance(client: Client, collectionAddress: Address, owner: Address): Promise<number> {
    return Number(
        (
            await readContract(client, {
                address: collectionAddress,
                abi: erc721Abi,
                functionName: "balanceOf",
                args: [owner],
            })
        ).toString()
    );
}

export async function isNftBalanceBelowThreshold(
    client: Client,
    collectionAddress: Address,
    owner: Address,
    threshold: number
): Promise<boolean> {
    const balance = await getOwnerNftBalance(client, collectionAddress, owner);
    return balance < threshold;
}

export async function isNftBalanceAboveThreshold(
    client: Client,
    collectionAddress: Address,
    owner: Address,
    threshold: number
): Promise<boolean> {
    const balance = await getOwnerNftBalance(client, collectionAddress, owner);
    return balance > threshold;
}
