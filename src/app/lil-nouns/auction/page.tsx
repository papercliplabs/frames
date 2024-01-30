import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/lil-nouns-auction-house.png`,
    buttonInfo: [{ name: "View Auction!", action: "post" }],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=lil-nouns`,
    ogTitle: "Lil Nouns",
    ogDesc: "Lil Nouns are just like Nouns, but Lil!",
});

export default function Page() {
    return <RedirectPage url="https://lilnouns.wtf" />;
}
