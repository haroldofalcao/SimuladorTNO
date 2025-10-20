import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const disclaimerCookie = request.cookies.get("disclaimer-accepted");
    const authToken = request.cookies.get("auth_token");
    const { searchParams } = request.nextUrl;
    const isExpired = new Date() >= new Date('2025-10-26');

    // Debug log (remover em produção)
    console.log('[Middleware] Path:', request.nextUrl.pathname);
    console.log('[Middleware] Has auth token:', !!authToken);
    console.log('[Middleware] Query params:', Object.fromEntries(searchParams));

    // 1) Forçar aviso de disclaimer caso não aceito ainda
    if (!disclaimerCookie && !searchParams.has("disclaimer")) {
        const url = request.nextUrl.clone();
        url.searchParams.set("disclaimer", "true");
        return NextResponse.redirect(url);
    }

    // 2) Checagem de autenticação via código do evento
    // Permite render do modal quando showLogin=true
    if (searchParams.get("showLogin") === "true") {
        console.log('[Middleware] Showing login modal, passing through');
        return NextResponse.next();
    }

    // Verificação simples: apenas checa se o cookie existe
    // A validação JWT completa será feita nas Server Actions
    if (!authToken) {
        console.log('[Middleware] No auth token, redirecting to login');
        const url = request.nextUrl.clone();
        url.searchParams.set("showLogin", "true");

        if (isExpired) {
            url.searchParams.set("eventExpired", "true");
        }

        return NextResponse.redirect(url);
    }

    // Tentar decodificar o payload do JWT manualmente (sem verificar assinatura)
    // para checar se é admin e se expirou
    try {
        const parts = authToken.value.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            const isAdminBypass = payload.isAdmin === true;

            // Verificar expiração do token
            if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                console.log('[Middleware] Token expired');
                const url = request.nextUrl.clone();
                url.searchParams.set("showLogin", "true");
                const response = NextResponse.redirect(url);
                response.cookies.delete("auth_token");
                return response;
            }

            // Se o evento expirou e não é admin, pede login
            if (isExpired && !isAdminBypass) {
                console.log('[Middleware] Event expired and not admin');
                const url = request.nextUrl.clone();
                url.searchParams.set("showLogin", "true");
                url.searchParams.set("eventExpired", "true");
                return NextResponse.redirect(url);
            }

            console.log('[Middleware] Access granted, isAdmin:', isAdminBypass);
        }
    } catch (error) {
        console.log('[Middleware] Error decoding token:', error);
        // Se não conseguir decodificar, remove o cookie
        const url = request.nextUrl.clone();
        url.searchParams.set("showLogin", "true");
        const response = NextResponse.redirect(url);
        response.cookies.delete("auth_token");
        return response;
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
