import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const disclaimerCookie = request.cookies.get("disclaimer-accepted");
    const authToken = request.cookies.get("auth_token");
    const { searchParams } = request.nextUrl;
    const isExpired = new Date() >= new Date('2025-10-26');



    // 1) Forçar aviso de disclaimer caso não aceito ainda (exceto se já estiver no disclaimer)
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

    const path = request.nextUrl.pathname;

    // Lista de rotas públicas que NÃO precisam de login
    const isPublicRoute = path === "/" || path.startsWith("/public");



    // Se for rota protegida (Technical) e não tiver token
    if (!isPublicRoute && !authToken) {

        const url = request.nextUrl.clone();
        // Redireciona para a home com o modal de login aberto
        url.pathname = "/";
        url.searchParams.set("showLogin", "true");

        if (isExpired) {
            url.searchParams.set("eventExpired", "true");
        }

        return NextResponse.redirect(url);
    }

    // Se tem token, valida (lógica existente...)
    if (authToken) {
        try {
            const parts = authToken.value.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
                const isAdminBypass = payload.isAdmin === true;

                if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
                    const url = request.nextUrl.clone();
                    url.pathname = "/";
                    url.searchParams.set("showLogin", "true");
                    const response = NextResponse.redirect(url);
                    response.cookies.delete("auth_token");
                    return response;
                }

                // Se o evento expirou e não é admin, pede login
                if (isExpired && !isAdminBypass) {
                    const url = request.nextUrl.clone();
                    url.pathname = "/";
                    url.searchParams.set("showLogin", "true");
                    url.searchParams.set("eventExpired", "true");
                    return NextResponse.redirect(url);
                }
            }
        } catch (error) {
            // Token inválido
            const url = request.nextUrl.clone();
            url.pathname = "/";
            url.searchParams.set("showLogin", "true");
            const response = NextResponse.redirect(url);
            response.cookies.delete("auth_token");
            return response;
        }
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
