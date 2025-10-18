"use server";

import { cookies } from "next/headers";

// Código do evento (pode ser alterado conforme necessário)
const EVENT_CODE = "NUTRI2025#";
const ADMIN_BYPASS = "HAROLDO123"; // Código de bypass para administrador

export async function loginAction(code: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        // Remover espaços e converter para maiúsculas
        const normalizedCode = code.trim().toUpperCase();

        // Verificar se o código está vazio
        if (!normalizedCode) {
            return {
                success: false,
                error: "Por favor, insira o código do evento",
            };
        }

        // Verificar se é o código de bypass do administrador ou o código do evento
        const isValidCode = normalizedCode === EVENT_CODE || normalizedCode === ADMIN_BYPASS;

        if (!isValidCode) {
            return {
                success: false,
                error: "Código inválido. Verifique o código e tente novamente.",
            };
        }

        // Criar um token simples
        const token = Buffer.from(
            JSON.stringify({
                code: normalizedCode,
                timestamp: Date.now(),
                isAdmin: normalizedCode === ADMIN_BYPASS,
            })
        ).toString("base64");

        // Definir o cookie de autenticação
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: "/",
        });

        return {
            success: true,
        };
    } catch (error) {
        console.error("Erro no login:", error);
        return {
            success: false,
            error: "Erro ao processar o login. Tente novamente.",
        };
    }
}

export async function logoutAction(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
}

export async function getAuthStatus(): Promise<{
    isAuthenticated: boolean;
    code?: string;
}> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token");

        if (!token) {
            return { isAuthenticated: false };
        }

        // Decodificar o token
        const decoded = JSON.parse(Buffer.from(token.value, "base64").toString());

        return {
            isAuthenticated: true,
            code: decoded.code,
        };
    } catch {
        return { isAuthenticated: false };
    }
}
