"use client";

import { NavigationButtons } from "@/components/NavigationButtons";
import { useSimulator } from "@/context/SimulatorContext";

export function Introducao() {
  const { setCurrentSection } = useSimulator();

  return (
    <section className="bg-white rounded-xl p-8 mb-5 shadow-md">
      <h1 className="text-4xl mb-4 text-blue-600 flex items-center gap-4">
        🏥 O Problema da Desnutrição Hospitalar
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Vamos começar compreendendo por que a desnutrição hospitalar é um
        desafio tão importante
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-teal-500 p-5 rounded-lg mb-6">
        <h3 className="text-blue-600 mb-2.5 text-xl font-semibold">
          Por que isso importa?
        </h3>
        <p className="text-gray-600 leading-relaxed">
          A desnutrição hospitalar afeta{" "}
          <strong>30-50% dos pacientes internados</strong> no Brasil. Ela
          aumenta complicações, tempo de internação e custos. Mas há uma solução
          comprovada: a Terapia Nutricional Oral (TNO). Este simulador vai
          mostrar o impacto real dessa intervenção.
        </p>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg my-4">
        <div className="font-semibold text-purple-600 mb-1.5">
          📊 Impacto Clínico da Desnutrição
        </div>
        <div className="text-purple-900 text-sm">
          Pacientes desnutridos têm 3x mais risco de complicações, 2x mais
          reinternações e permanência hospitalar 40% maior. A desnutrição também
          compromete a resposta imunológica e a cicatrização de feridas.
        </div>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg my-4">
        <div className="font-semibold text-purple-600 mb-1.5">
          🔬 Base Científica
        </div>
        <div className="text-purple-900 text-sm">
          Meta-análises recentes (Cochrane, ESPEN) demonstram que suplementação
          nutricional oral reduz mortalidade em 34%, complicações em 52% e tempo
          de internação em até 2.5 dias. Os benefícios são ainda maiores em
          pacientes cirúrgicos e idosos.
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg my-4">
        <div className="font-semibold text-orange-600 mb-1.5 flex items-center gap-2">
          💰 Impacto Econômico
        </div>
        <div className="text-orange-900 text-sm">
          Cada dia adicional de internação custa R$ 380-1.200 dependendo do
          hospital. Complicações podem adicionar R$ 15.000-50.000 por paciente.
          Investir em TNO (R$ 5-50/dia) gera retorno de 300-500% através da
          redução desses custos.
        </div>
      </div>

      <NavigationButtons
        onNext={() => setCurrentSection(2)}
        showPrevious={false}
      />
    </section>
  );
}
