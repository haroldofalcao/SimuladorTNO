"use client";

import { useRouter } from "next/navigation";

export default function DisclaimerPopup() {
  const router = useRouter();

  const handleAccept = () => {
    // Setar cookie com validade de 1 ano
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `disclaimer-accepted=true; expires=${expiryDate.toUTCString()}; path=/`;

    // Redirecionar para URL sem search params
    router.push("/");
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Aviso Importante</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <p className="text-sm text-amber-900 dark:text-amber-200 font-medium">
              📚 Ferramenta de Caráter Educacional
            </p>
          </div>

          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Este simulador de nutrieconomia tem{" "}
              <strong className="text-gray-900 dark:text-white">
                finalidade exclusivamente didática
              </strong>
              , baseado em{" "}
              <strong className="text-gray-900 dark:text-white">
                modelos teóricos e referências científicas nacionais e
                internacionais
              </strong>
              .
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                ⚠️ Características Importantes:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Não utiliza dados reais</strong> de pacientes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    <strong>Não representa a realidade</strong> de nenhum
                    hospital específico
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                    •
                  </span>
                  <span>
                    Os resultados são <strong>ilustrativos</strong> e não devem
                    ser usados para decisões clínicas, estratégicas ou
                    financeiras
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm italic">
              Ao prosseguir, você reconhece e aceita que esta ferramenta tem
              caráter educacional e não substitui a análise profissional.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleAccept}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Li e Compreendo
            </button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-500">
            Para mais informações, consulte os{" "}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleAccept();
                setTimeout(() => {
                  window.location.href = "/terms";
                }, 100);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Termos de Uso
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
