import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/nouns-auction-house.png`,
    buttonInfo: [{ name: "View Auction!", action: "post" }],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=nouns`,
    ogTitle: "Nouns",
    ogDesc: "One Noun, Every Day, Forever.",
});

export default function Page() {
    return <RedirectPage url="https://nouns.wtf" />;
}
