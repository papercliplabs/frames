import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/yellow-auction-house.png`,
    buttonNames: ["View Auction!"],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=yellow`,
});

export default function Page() {
    return <RedirectPage url="https://www.yellowcollective.xyz" />;
}
