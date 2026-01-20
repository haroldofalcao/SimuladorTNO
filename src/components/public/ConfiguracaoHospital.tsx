'use client';

import { useSimulator } from '@/context/SimulatorContext';
import { NavigationButtons } from '@/components/shared/NavigationButtons';

export function ConfiguracaoHospital() {
  const { setCurrentSection, config, updateConfig, hospitalData, patientData } = useSimulator();

  return (
    <section className="bg-white rounded-xl p-8 mb-5 shadow-md">
      <h1 className="text-4xl mb-4 text-blue-600 flex items-center gap-4">
        ⚙️ Configuração do Hospital
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Agora vamos personalizar a simulação para sua realidade específica
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-teal-500 p-5 rounded-lg mb-6">
        <h3 className="text-blue-600 mb-2.5 text-xl font-semibold">
          Por que personalizar?
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Cada hospital tem suas particularidades. Custos, perfil de pacientes e estrutura variam.
          Por isso, vamos ajustar o simulador para refletir SUA realidade e gerar insights mais precisos.
        </p>
      </div>

      {/* Tipo de Hospital */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-blue-600 flex items-center gap-2.5 text-lg">
            🏥 Tipo de Hospital
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
          {Object.entries(hospitalData).map(([key, data]) => (
            <div
              key={key}
              onClick={() => updateConfig({ hospitalType: key as any })}
              className={`bg-white border-2 rounded-xl p-5 cursor-pointer transition-all text-center ${config.hospitalType === key
                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-cyan-50'
                : 'border-gray-200 hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md'
                }`}
            >
              <div className="text-5xl mb-4">
                {key === 'publico' ? '🏥' : key === 'privado' ? '🏨' : '🏢'}
              </div>
              <div className="text-xl font-bold text-blue-600 mb-2.5">
                {data.name}
              </div>
              <div className="text-gray-600 mb-4">
                {data.description}
              </div>
              <div className="bg-blue-50/50 p-2.5 rounded-md text-sm">
                Custo médio/dia: R$ {data.avgDaily}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tipo de Paciente */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-blue-600 flex items-center gap-2.5 text-lg">
            👥 Perfil de Pacientes
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
          {Object.entries(patientData).map(([key, data]) => (
            <div
              key={key}
              onClick={() => updateConfig({ patientType: key as any })}
              className={`bg-white border-2 rounded-xl p-5 cursor-pointer transition-all text-center ${config.patientType === key
                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-cyan-50'
                : 'border-gray-200 hover:border-blue-600 hover:-translate-y-0.5 hover:shadow-md'
                }`}
            >
              <div className="text-5xl mb-4">
                {key === 'cirurgico' ? '🔪' : key === 'clinico' ? '💊' : '🏥'}
              </div>
              <div className="text-xl font-bold text-blue-600 mb-2.5">
                {data.name}
              </div>
              <div className="text-gray-600 mb-4">
                {data.description}
              </div>
              <div className="bg-blue-50/50 p-2.5 rounded-md text-sm">
                Tempo médio: {data.avgLOS} dias
              </div>
            </div>
          ))}
        </div>
      </div>

      <NavigationButtons
        onNext={() => setCurrentSection(4)}
        onPrevious={() => setCurrentSection(2)}
        className="touch-manipulation"
      />
    </section>
  );
}
