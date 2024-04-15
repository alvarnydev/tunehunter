import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|auth_callback|_next/image|favicon.ico).*)",
  ],
};

export function middleware(request: NextRequest) {
  // Check if locale is present in request URL and matches the one in the NEXT_LOCALE cookie
  const urlLocale = request.nextUrl.locale;
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  // Redirect to the cookie locale if the URL locale doesn't match it
  if (urlLocale && cookieLocale && urlLocale !== cookieLocale) {
    const newUrl = request.url.replace(`/${urlLocale}`, `/${cookieLocale}`);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}
