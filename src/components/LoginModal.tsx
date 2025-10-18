"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { loginAction } from "@/app/actions/auth";
import { modalManager } from "@/lib/modal-manager";

export default function LoginModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const showLogin = searchParams.get("showLogin") === "true";
  const eventExpired = searchParams.get("eventExpired") === "true";

  // Prevenir scroll quando o modal está aberto
  useEffect(() => {
    if (showLogin) {
      modalManager.open();
      return () => {
        modalManager.close();
      };
    }
  }, [showLogin]);

  if (!showLogin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Por favor, insira o código do evento");
      return;
    }

    startTransition(async () => {
      // Verificar se é o bypass de administrador
      const ADMIN_BYPASS = "haroldo123";
      const isAdminBypass = code.trim().toLowerCase() === ADMIN_BYPASS.toLowerCase();

      if (eventExpired && !isAdminBypass) {
        toast.error("Este evento já expirou. Entre em contato com os organizadores.");
        return;
      }

      const result = await loginAction(code);

      if (result.success) {
        toast.success(
          isAdminBypass ? "Acesso de administrador liberado!" : "Acesso liberado! Bem-vindo!",
        );
        // Remover os query params e atualizar a página
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("showLogin");
        currentUrl.searchParams.delete("eventExpired");
        router.replace(currentUrl.pathname + currentUrl.search);
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao validar o código");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="mb-4 inline-block p-3 bg-indigo-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-8 h-8 text-indigo-600"
              aria-hidden="true"
            >
              <title>Ícone de cadeado</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nutri Economics</h2>
          <p className="text-gray-600">Insira o código do evento para acessar</p>
        </div>

        {eventExpired && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                aria-hidden="true"
              >
                <title>Ícone de alerta</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-red-800 mb-1">⚠️ Evento Expirado</p>
                <p className="text-xs text-red-700">
                  Este evento já foi encerrado. Se você é um administrador, use o código especial para acessar.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Acesso
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Digite o código aqui"
              disabled={isPending}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-center text-lg font-mono tracking-widest uppercase"
              autoComplete="off"
              maxLength={20}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Validando..." : "Acessar Simulador"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800 font-medium mb-1">💡 Onde encontrar o código?</p>
          <p className="text-xs text-amber-700">
            O código de acesso está sendo distribuído no evento. Se você não recebeu, entre em contato com os organizadores.
          </p>
        </div>
      </div>
    </div>
  );
}
