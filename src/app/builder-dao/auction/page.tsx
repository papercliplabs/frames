import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/builder-dao-auction-house.png`,
    buttonInfo: [{ name: "View Auction!", action: "post" }],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=builder-dao`,
    ogTitle: "Builder DAO",
    ogDesc: "Builder DAO is dedicated to the creation and development of free and accessible DAO infrastructure as a public good.",
});

export default function Page() {
    return <RedirectPage url="https://nouns.build/dao/ethereum/0xdf9b7d26c8fc806b1ae6273684556761ff02d422" />;
}
