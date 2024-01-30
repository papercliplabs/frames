import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/based-management-auction-house.png`,
    buttonInfo: [{ name: "View Auction!", action: "post" }],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=based-management`,
    ogTitle: "Based Management One",
    ogDesc: "Based Management is the culture layer of the Base chain.",
});

export default function Page() {
    return <RedirectPage url="https://nouns.build/dao/base/0xB78b89EB81303a11CC597B4519035079453d8E31" />;
}
