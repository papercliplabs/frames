import { getTrainer } from "@/app/beanigotchi/data/trainer";
import { howToImageResponse } from "@/app/beanigotchi/imageResponses/howTo";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { fid: string } }): Promise<Response> {
  const fid = Number(params.fid);
  const trainer = await getTrainer({ fid });

  return howToImageResponse({
    primaryColor: trainer.bean.colors.classOne,
    secondaryColor: trainer.bean.colors.classTwo,
  });
}

export const maxDuration = 150; // Allow up to 2.5 min for first fetch
