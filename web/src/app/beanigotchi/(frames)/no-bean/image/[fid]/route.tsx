import { getTrainer } from "@/app/beanigotchi/data/trainer";
import { noBeanImageResponse } from "@/app/beanigotchi/imageResponses/noBean";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { fid: string } }): Promise<Response> {
  const fid = Number(params.fid);
  const trainer = await getTrainer({ fid });

  return noBeanImageResponse({
    primaryColor: trainer.bean.colors.classOne,
    secondaryColor: trainer.bean.colors.classTwo,
  });
}
