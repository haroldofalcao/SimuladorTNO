import Link from "next/link";
import React from "react";

export default function LandingPage() {
  return (
    <main className="h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Decor Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[rgba(17,172,237,0.2)] rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply filter opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[rgba(59,71,167,0.2)] rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-[rgba(17,172,237,0.15)] rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl w-full text-center z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 tracking-tight leading-tight">
          Simuladores de <br />
          <span className="text-gradient">Terapia Nutricional</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-8 sm:mb-12 lg:mb-16 max-w-2xl mx-auto leading-relaxed text-balance px-2 sm:px-0">
          Ferramentas avançadas para demonstrar o valor clínico e econômico da
          nutrição em tempo real.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto px-2 sm:px-0">
          {/* Public Module Card */}
          <Link href="/public" className="group">
            <div className="glass-panel p-4 sm:p-6 lg:p-8 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(59,71,167,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--danone-cyan)] to-[var(--danone-blue)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  🩺
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-700 transition-colors">
                  Módulo Didático
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 text-center leading-relaxed">
                  Interface visual para nutricionistas apresentarem benefícios
                  aos pacientes.
                </p>
                <div className="mt-auto">
                  <span className="btn-primary py-2 sm:py-3 px-6 sm:px-8 rounded-full font-semibold inline-flex items-center gap-2 text-sm sm:text-base">
                    Iniciar Demonstração{" "}
                    <span className="text-lg sm:text-xl">→</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Technical Module Card */}
          <Link href="/technical" className="group">
            <div className="glass-panel p-4 sm:p-6 lg:p-8 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(17,172,237,0.15)] relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

              <div className="flex flex-col items-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 shadow-inner group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
                  📊
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-gray-900 transition-colors">
                  Módulo Técnico
                </h2>
                <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 text-center leading-relaxed">
                  Cálculo de ROI, Farmacoeconomia e Análises de Sensibilidade
                  para gestores.
                </p>
                <div className="mt-auto">
                  <span className="btn-primary py-2 sm:py-3 px-6 sm:px-8 rounded-full font-semibold inline-flex items-center gap-2 text-sm sm:text-base ">
                    Acessar Painel <span className="text-lg sm:text-xl">→</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <footer className="mt-12 sm:mt-16 lg:mt-20 text-gray-400 text-xs sm:text-sm px-4">
          <p>
            © 2025 Danone Nutrição Especializada. Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </main>
  );
}
