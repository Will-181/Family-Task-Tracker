import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySignedCookieWithSecret, COOKIE_NAME } from "@/lib/cookie";

// Reference COOKIE_SECRET here so Next.js includes it in the Edge middleware bundle.
const COOKIE_SECRET = process.env.COOKIE_SECRET;

const PUBLIC_PATHS = [
  "/unlock",
  "/api/unlock",
  "/api/health",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }
  if (pathname.match(/^\/(assets?|icons?|images?|static)\//)) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await verifySignedCookieWithSecret(cookieValue, COOKIE_SECRET);

  if (!valid) {
    const url = request.nextUrl.clone();
    url.pathname = "/unlock";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
