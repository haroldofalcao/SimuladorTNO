import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const disclaimerCookie = request.cookies.get("disclaimer-accepted");
    const authToken = request.cookies.get("auth_token");
    const { searchParams } = request.nextUrl;

    // 1) Forçar aviso de disclaimer caso não aceito ainda
    if (!disclaimerCookie && !searchParams.has("disclaimer")) {
        const url = request.nextUrl.clone();
        url.searchParams.set("disclaimer", "true");
        return NextResponse.redirect(url);
    }

    // 2) Checagem de autenticação via código do evento
    // Permite render do modal quando showLogin=true
    if (searchParams.get("showLogin") === "true") {
        return NextResponse.next();
    }

    // Verificar se tem token e se é admin bypass
    let isAdminBypass = false;
    if (authToken) {
        try {
            const decoded = JSON.parse(Buffer.from(authToken.value, "base64").toString());
            isAdminBypass = decoded.isAdmin === true;
        } catch {
            // Token inválido, segue para redirecionar
        }
    }

    // Definir se evento expirou (ajuste a data se necessário)
    const isExpired = new Date() >= new Date('2025-10-26');

    if (!authToken || (isExpired && !isAdminBypass)) {
        const url = request.nextUrl.clone();
        url.searchParams.set("showLogin", "true");
        if (isExpired) url.searchParams.set("eventExpired", "true");
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
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
    ],
};
