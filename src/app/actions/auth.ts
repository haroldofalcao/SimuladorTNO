"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Código do evento (pode ser alterado conforme necessário)
const EVENT_CODE = "CBNPE2025#";
const ADMIN_BYPASS = "NUTRI2025#"; // Código de bypass para administrador (após 26/10)
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRATION = "7d"; // Token expira em 7 dias

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

        // Criar um JWT token
        const token = jwt.sign(
            {
                code: normalizedCode,
                isAdmin: normalizedCode === ADMIN_BYPASS,
                iat: Math.floor(Date.now() / 1000),
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        console.log('[Auth] Token created for code:', normalizedCode);
        console.log('[Auth] JWT_SECRET exists:', !!JWT_SECRET);
        console.log('[Auth] Token (first 20 chars):', token.substring(0, 20));

        // Definir o cookie de autenticação
        const cookieStore = await cookies();
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: "/",
        });

        console.log('[Auth] Cookie set successfully');

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
    expiresAt?: number;
}> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token");

        if (!token) {
            return { isAuthenticated: false };
        }

        // Verificar e decodificar o JWT token
        const decoded = jwt.verify(token.value, JWT_SECRET) as {
            code: string;
            isAdmin?: boolean;
            exp?: number;
        };

        return {
            isAuthenticated: true,
            code: decoded.code,
            expiresAt: decoded.exp,
        };
    } catch (error) {
        // Token inválido ou expirado
        console.error("Token inválido ou expirado:", error);
        return { isAuthenticated: false };
    }
}
