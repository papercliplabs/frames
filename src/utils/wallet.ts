import { Address, createPublicClient, hexToString, http, slice } from "viem";
import { mainnet } from "viem/chains";

export const publicClient = createPublicClient({
    chain: mainnet,
    transport: http(),
});

export const shortenAddress = (address: string, amount: number = 4) =>
    `${address?.slice(0, amount)}...${address?.slice(address.length - amount, address.length)}`;

export async function getWalletName({ address }: { address: Address }): Promise<string> {
    // Get NNS or ENS name
    try {
        const res = await publicClient.call({
            to: "0x849f92178950f6254db5d16d1ba265e70521ac1b",
            data: `0x55ea6c47000000000000000000000000${address.substring(2)}`,
        });

        let name = undefined;
        if (res?.data) {
            const offset = Number(slice(res.data, 0, 32));
            const length = Number(slice(res.data, offset, offset + 32));
            const data = slice(res.data, offset + 32, offset + 32 + length);

            name = hexToString(data);
        }

        return name ?? shortenAddress(address, 4);
    } catch (e) {
        return shortenAddress(address, 4);
    }
}
