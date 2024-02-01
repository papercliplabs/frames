import { Address, createPublicClient, hexToString, http, slice } from "viem";
import { getEnsName } from "viem/actions";
import { base, baseSepolia, mainnet, zora } from "viem/chains";

export const mainnetPublicClient = createPublicClient({
    chain: mainnet,
    transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
});

export const basePublicClient = createPublicClient({
    chain: base,
    transport: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`),
});

export const baseSepoliaPublicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
});

export const zoraPublicClient = createPublicClient({
    chain: zora,
    transport: http(`https://rpc.zora.energy`),
});

export const shortenAddress = (address: string, amount: number = 4) =>
    `${address?.slice(0, amount)}...${address?.slice(address.length - amount, address.length)}`;

export async function getWalletName({ address }: { address: Address }): Promise<string> {
    // Get NNS or ENS name
    const ensName = await getEnsName(mainnetPublicClient, { address });

    return ensName ?? shortenAddress(address, 4);

    // Disable NNS for now since won't render correctly in frame
    // try {
    //     const res = await mainnetPublicClient.call({
    //         to: "0x849f92178950f6254db5d16d1ba265e70521ac1b",
    //         data: `0x55ea6c47000000000000000000000000${address.toLowerCase().substring(2)}`,
    //     });

    //     let name = undefined;
    //     if (res?.data) {
    //         const offset = Number(slice(res.data, 0, 32));
    //         const length = Number(slice(res.data, offset, offset + 32));
    //         const data = slice(res.data, offset + 32, offset + 32 + length);

    //         name = hexToString(data);
    //     }

    //     return name ?? shortenAddress(address, 4);
    // } catch (e) {
    //     return shortenAddress(address, 4);
    // }
}
