// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { trackEvent } from "./common/utils/analytics";

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

  trackEvent("api_request", {
    time,
    method,
    app,
    url,
    userAgent,
    requesterOrigin,
  }).catch(console.error);

  const host = request.headers.get("host");
  const fullUrl = request.nextUrl.clone();
  if (process.env.NODE_ENV === "development") {
    // Don't redirect in development
    return NextResponse.next();
  }

  if (host && !host.startsWith("www.")) {
    fullUrl.hostname = "www." + host;
    fullUrl.port = "";
    return NextResponse.redirect(fullUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|favicon.ico|_next/image|public).*)",
};
