import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/purple-auction-house.png`,
    buttonNames: ["View Auction!"],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=purple`,
    ogTitle: "Purple",
    ogDesc: "Purple is a DAO whose goal is to proliferate and expand the Farcaster protocol and ecosystem.",
});

export default function Page() {
    return <RedirectPage url="https://purple.construction/" />;
}
