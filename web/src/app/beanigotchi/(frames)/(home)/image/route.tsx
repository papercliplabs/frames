import { homeImageResponse } from "@/app/beanigotchi/imageResponses/home";
import { getBean } from "@/common/beans/data/getBean";
import { getCurrentAuction } from "@/common/beans/data/getCurrentAuction";
import { SECONDS_PER_DAY } from "@/utils/constants";

export async function GET(req: Request): Promise<Response> {
  const currentAuction = await getCurrentAuction();
  const auctionBean = await getBean({ beanId: currentAuction.beanId });

  return homeImageResponse({ primaryColor: auctionBean.colors.classOne, secondaryColor: auctionBean.colors.classTwo });
}

export const revalidate = SECONDS_PER_DAY / 2;
export const dynamic = "force-dynamic";
