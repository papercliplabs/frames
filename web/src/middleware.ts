// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendAnalyticsEvent } from "./common/utils/analytics";

export function middleware(request: NextRequest) {
  const time = new Date().toISOString();

  const method = request.method;

  const url = request.nextUrl.pathname;
  const app = url.split("/")[1];

  const userAgent = request.headers.get("user-agent") ?? "unknown";

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const forwardedFor = request.headers.get("x-forwarded-for");
  const requesterOrigin = origin ?? referer ?? forwardedFor ?? "unknown";

  sendAnalyticsEvent("api_request", {
    time,
    method,
    app,
    url,
    userAgent,
    requesterOrigin,
  }).catch(console.error);

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|favicon.ico|_next/image|public).*)",
};
