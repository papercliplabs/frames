import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/yellow-auction-house.png`,
    buttonInfo: [{ name: "View Auction!", action: "post" }],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=yellow`,
    ogTitle: "The Yellow Collective",
    ogDesc: "An onchain club on the BASE Ethereum L2 network, designed to support and empower artists and creatives in the Nouns and Superchain ecosystems. ",
});

export default function Page() {
    return <RedirectPage url="https://www.yellowcollective.xyz" />;
}
