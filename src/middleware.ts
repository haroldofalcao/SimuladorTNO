import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const disclaimerCookie = request.cookies.get("disclaimer-accepted");
    const { searchParams } = request.nextUrl;

    // Se o cookie não existe e não está na URL com disclaimer=true
    if (!disclaimerCookie && !searchParams.has("disclaimer")) {
        const url = request.nextUrl.clone();
        url.searchParams.set("disclaimer", "true");
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
