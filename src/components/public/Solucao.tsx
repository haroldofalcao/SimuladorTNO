'use client';

import { useSimulator } from '@/context/SimulatorContext';
import { NavigationButtons } from '@/components/shared/NavigationButtons';

export function Solucao() {
  const { setCurrentSection } = useSimulator();

  return (
    <section className="bg-white rounded-xl p-8 mb-5 shadow-md">
      <h1 className="text-4xl mb-4 text-blue-600 flex items-center gap-4">
        💊 A Solução - Terapia Nutricional Oral (TNO)
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Entenda como a suplementação nutricional pode transformar os desfechos clínicos
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-teal-500 p-5 rounded-lg mb-6">
        <h3 className="text-blue-600 mb-2.5 text-xl font-semibold">
          O que é TNO?
        </h3>
        <p className="text-gray-600 leading-relaxed">
          A Terapia Nutricional Oral são suplementos nutricionais de alta densidade calórica e proteica,
          consumidos via oral. São práticos, saborosos e cientificamente formulados para pacientes
          hospitalizados que não conseguem atingir suas necessidades nutricionais apenas com a dieta.
        </p>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg my-4">
        <div className="font-semibold text-purple-600 mb-1.5">
          🎯 Quando indicar TNO?
        </div>
        <div className="text-purple-900 text-sm">
          • Pacientes cirúrgicos (pré e pós-operatório)
          <br />
          • Idosos hospitalizados com risco nutricional
          <br />
          • Pacientes com doenças crônicas e catabolismo aumentado
          <br />
          • Internações prolongadas previstas (&gt; 7 dias)
          <br />
          • Quando a ingestão oral for insuficiente (&lt; 60% das necessidades)
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg my-4">
        <div className="font-semibold text-orange-600 mb-1.5 flex items-center gap-2">
          📊 Evidências de Custo-Efetividade
        </div>
        <div className="text-orange-900 text-sm">
          Estudos econômicos brasileiros demonstram que TNO reduz custos hospitalares em 15-35%.
          O custo adicional da suplementação (R$ 25-75/dia) é amplamente compensado pela redução
          de complicações (economia de R$ 15.000+), menor tempo de internação (R$ 380-1.200/dia)
          e menor taxa de reinternação.
        </div>
      </div>

      <NavigationButtons
        onNext={() => setCurrentSection(3)}
        onPrevious={() => setCurrentSection(1)}
      />
    </section>
  );
}
