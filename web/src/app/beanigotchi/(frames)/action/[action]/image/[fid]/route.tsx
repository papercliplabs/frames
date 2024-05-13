import { Action } from "@/app/beanigotchi/data/actions";
import { getTrainer } from "@/app/beanigotchi/data/trainer";
import { actionImageResponse } from "@/app/beanigotchi/imageResponses/action";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { action: string; fid: string } }
): Promise<Response> {
  // Assume valid inputs, we sanitize in the POST endpoint
  const fid = Number(params.fid);
  const action = params.action as Action;
  const success = req.nextUrl.searchParams.get("success")! == "true";
  const xpGained = Number(req.nextUrl.searchParams.get("xpGained")!);

  const trainer = await getTrainer({ fid });

  return actionImageResponse({
    primaryColor: trainer.bean.colors.classOne,
    secondaryColor: trainer.bean.colors.classTwo,
    action,
    success,
    xpGained,
  });
}

export const maxDuration = 150; // Allow up to 2.5min for first fetch
