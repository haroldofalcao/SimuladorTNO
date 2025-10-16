'use client';

import { useSimulator } from '@/context/SimulatorContext';
import { NavigationButtons } from '@/components/NavigationButtons';

export function ParametrosPersonalizaveis() {
  const { setCurrentSection, config, updateConfig } = useSimulator();

  const handleSliderChange = (key: keyof typeof config, value: number) => {
    updateConfig({ [key]: value });
  };

  return (
    <section className="bg-white rounded-xl p-8 mb-5 shadow-md">
      <h1 className="text-4xl mb-4 text-blue-600 flex items-center gap-4">
        🎛️ Parâmetros Personalizáveis
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Agora vamos ajustar os detalhes específicos da sua implementação
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-teal-500 p-5 rounded-lg mb-6">
        <h3 className="text-blue-600 mb-2.5 text-xl font-semibold">
          Ajuste fino da simulação
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Estes parâmetros permitem simular diferentes cenários: eficácia esperada do TNO, 
          adesão dos pacientes, tamanho da população e custo dos suplementos. 
          Use os valores padrão ou personalize baseado na sua experiência.
        </p>
      </div>

      {/* População */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <div className="font-semibold text-blue-600 mb-4 text-lg">
          👥 População Simulada
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-5 border-l-4 border-blue-600">
          <p className="text-gray-700 text-sm">
            Número de pacientes virtuais que serão simulados. Quanto maior a população, 
            mais robustos os resultados estatísticos.
          </p>
        </div>
        
        <input
          type="range"
          min={config.ranges.populacao.min}
          max={config.ranges.populacao.max}
          value={config.populacao}
          onChange={(e) => handleSliderChange('populacao', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="text-center text-xl font-bold text-blue-600 bg-white p-2.5 rounded-lg mt-2.5">
          {config.populacao.toLocaleString('pt-BR')} pacientes
        </div>
      </div>

      {/* Eficácia TNO */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <div className="font-semibold text-blue-600 mb-4 text-lg">
          📈 Eficácia Esperada do TNO
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-5 border-l-4 border-blue-600">
          <p className="text-gray-700 text-sm">
            Percentual de melhora nos desfechos clínicos com TNO. Baseado em literatura: 
            30-50% é conservador, 70-85% é otimista (ideal para pacientes bem selecionados).
          </p>
        </div>
        
        <input
          type="range"
          min={config.ranges.eficacia.min}
          max={config.ranges.eficacia.max}
          value={config.eficaciaTNO}
          onChange={(e) => handleSliderChange('eficaciaTNO', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="text-center text-xl font-bold text-blue-600 bg-white p-2.5 rounded-lg mt-2.5">
          {config.eficaciaTNO}% de eficácia
        </div>
      </div>

      {/* Adesão */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <div className="font-semibold text-blue-600 mb-4 text-lg">
          ✅ Taxa de Adesão ao Protocolo
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-5 border-l-4 border-blue-600">
          <p className="text-gray-700 text-sm">
            Percentual de pacientes que aderem completamente ao protocolo TNO. 
            Adesão depende de sabor, tolerância, educação da equipe e follow-up. 
            60-80% é realista, acima de 85% requer programa estruturado.
          </p>
        </div>
        
        <input
          type="range"
          min={config.ranges.adesao.min}
          max={config.ranges.adesao.max}
          value={config.adesao}
          onChange={(e) => handleSliderChange('adesao', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="text-center text-xl font-bold text-blue-600 bg-white p-2.5 rounded-lg mt-2.5">
          {config.adesao}% de adesão
        </div>
      </div>

      {/* Custo TNO */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <div className="font-semibold text-blue-600 mb-4 text-lg">
          💰 Custo Diário do TNO
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-5 border-l-4 border-blue-600">
          <p className="text-gray-700 text-sm">
            Custo médio por dia de suplementação (pode variar por fornecedor e volume). 
            R$ 25-50 é básico, R$ 50-100 é intermediário, R$ 100+ são fórmulas especializadas.
          </p>
        </div>
        
        <input
          type="range"
          min={config.ranges.custoTNO.min}
          max={config.ranges.custoTNO.max}
          value={config.custoTNODiario}
          onChange={(e) => handleSliderChange('custoTNODiario', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="text-center text-xl font-bold text-blue-600 bg-white p-2.5 rounded-lg mt-2.5">
          R$ {config.custoTNODiario} por dia
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg my-4">
        <div className="font-semibold text-orange-600 mb-1.5 flex items-center gap-2">
          💡 Dica de Otimização
        </div>
        <div className="text-orange-900 text-sm">
          Para maximizar ROI: foque em pacientes de alto risco (idosos, cirúrgicos, desnutridos), 
          invista em treinamento da equipe para melhorar adesão, e negocie preços com fornecedores 
          para grandes volumes.
        </div>
      </div>

      <NavigationButtons
        onNext={() => setCurrentSection(5)}
        onPrevious={() => setCurrentSection(3)}
      />
    </section>
  );
}
