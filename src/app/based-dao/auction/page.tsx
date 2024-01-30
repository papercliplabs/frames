import { RedirectPage } from "@/components/RedirectPage";
import { generateFrameMetadata } from "@/utils/metadata";

export const metadata = generateFrameMetadata({
    type: "metadata",
    image: `${process.env.NEXT_PUBLIC_URL}/images/based-dao-auction-house.png`,
    buttonNames: ["View Auction!"],
    postUrl: `${process.env.NEXT_PUBLIC_URL}/common/nouns-auction/api?dao=based-dao`,
    ogTitle: "BASED DAO",
    ogDesc: "Our mission is to ignite identity, foster a vibrant community, establish effective governance, and cultivate a robust treasury that empowers and benefits our collective",
});

export default function Page() {
    return <RedirectPage url="https://nouns.build/dao/base/0x10a5676ec8ae3d6b1f36a6f1a1526136ba7938bf" />;
}
