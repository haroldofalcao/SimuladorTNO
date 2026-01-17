import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold text-blue-900 mb-6 tracking-tight">
          Simuladores de Terapia Nutricional
        </h1>
        <p className="text-xl text-blue-700 mb-12 max-w-2xl mx-auto">
          Escolha o módulo adequado para sua necessidade: demonstração para
          pacientes ou análise técnica avançada.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Public Module Card */}
          <Link
            href="/public"
            className="group relative bg-white rounded-2xl shadow-xl p-8 hover:-translate-y-2 transition-all duration-300 border border-blue-100 hover:shadow-2xl hover:border-blue-300"
          >
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              B2C / Nutricionistas
            </div>
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-600 transition-colors">
              <span className="text-3xl grooup-hover:text-white">🩺</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Módulo Público
            </h2>
            <p className="text-gray-600">
              Interface amigável para apresentar benefícios clínicos e economias
              básicas a pacientes e profissionais de saúde.
            </p>
            <div className="mt-6 text-blue-600 font-semibold flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
              Acessar Simulador <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Technical Module Card */}
          <Link
            href="/technical"
            className="group relative bg-slate-900 rounded-2xl shadow-xl p-8 hover:-translate-y-2 transition-all duration-300 border border-slate-700 hover:shadow-2xl hover:border-blue-500"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
              B2B / Gestores
            </div>
            <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-500 transition-colors">
              <span className="text-3xl">📊</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Módulo Técnico
            </h2>
            <p className="text-slate-300">
              Ferramenta avançada para representantes técnicos. Farmacoeconomia,
              análise de sensibilidade e ROI detalhado.
            </p>
            <div className="mt-6 text-blue-400 font-semibold flex items-center justify-center gap-2 group-hover:gap-3 transition-all">
              Acessar Painel <span aria-hidden="true">→</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
