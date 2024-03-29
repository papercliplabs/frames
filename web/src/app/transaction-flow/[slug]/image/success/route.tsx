import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { getDefaultSquareImageOptions } from "@/utils/imageOptions";
import { SupportedTransactionFlowSlug, transactionFlowConfigs } from "@/app/transaction-flow/config";
import { paperclipIcon } from "@/utils/paperclip";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }): Promise<Response> {
  const config = transactionFlowConfigs[params.slug as SupportedTransactionFlowSlug];

  if (!config) {
    console.error("No config found - ", params.slug);
    return Response.error();
  }

  const successMessage = req.nextUrl.searchParams.get("successMessage");

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full justify-center items-center relative p-[80px] text-center"
        style={{ backgroundColor: config.style.backgroundColor }}
      >
        <img
          src={config.icons?.success ?? `${process.env.NEXT_PUBLIC_URL}/images/transaction-flow/default/success.png`}
          width={200}
          height={200}
        />
        <div
          tw="text-[80px] text-bold pt-[60px] pb-[20px]"
          style={{ fontFamily: config.style.font.primary.type, color: config.style.font.primary.color }}
        >
          Transaction Successful
        </div>
        <div
          tw="text-[52px]"
          style={{ fontFamily: config.style.font.secondary.type, color: config.style.font.secondary.color }}
        >
          {successMessage ?? "Your transaction was successfully submitted!"}
        </div>
        {paperclipIcon}
      </div>
    ),
    await getDefaultSquareImageOptions([config.style.font.primary.type, config.style.font.secondary.type])
  );
}

export const dynamic = "force-dynamic";
