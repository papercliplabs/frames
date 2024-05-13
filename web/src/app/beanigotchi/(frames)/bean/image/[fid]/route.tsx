import { getTrainer } from "@/app/beanigotchi/data/trainer";
import { myBeanImageResponse } from "@/app/beanigotchi/imageResponses/myBean";

export async function GET(req: Request, { params }: { params: { fid: string } }): Promise<Response> {
  const fid = Number(params.fid);
  const trainer = await getTrainer({ fid });

  return myBeanImageResponse({
    primaryColor: trainer.bean.colors.classOne,
    secondaryColor: trainer.bean.colors.classTwo,
    level: trainer.levelStatus.level,
    xpPct: trainer.levelStatus.levelProgressPct,
    waterBoostActive: trainer.waterBoost,
    foodBoostActive: trainer.feedBoost,
    beanId: trainer.bean.id.toString(),
    beanImgSrc: trainer.bean.imgSrc,
  });
}

export const dynamic = "force-dynamic";

export const maxDuration = 150; // Allow up to 2.5 min for first fetch
