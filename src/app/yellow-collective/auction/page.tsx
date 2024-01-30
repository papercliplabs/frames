import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/yellow-collective-auction-home.png`,
    buttonNames: ["View Auction!"],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/yellow-collective/auction/api`,
});

export default function Page() {
    return <RedirectPage url="https://www.yellowcollective.xyz" />;
}
