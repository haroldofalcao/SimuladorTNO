'use client';

import { useSimulator } from '@/context/SimulatorContext';
import { NavigationButtons } from '@/components/NavigationButtons';

export function Referencias() {
  const { setCurrentSection } = useSimulator();

  return (
    <section className="bg-white rounded-xl p-8 mb-5 shadow-md">
      <h1 className="text-4xl mb-4 text-blue-600 flex items-center gap-4">
        📚 Referências Científicas
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Base científica que fundamenta este simulador
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-teal-500 p-5 rounded-lg mb-6">
        <h3 className="text-blue-600 mb-2.5 text-xl font-semibold">
          Embasamento Científico
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Este simulador é baseado em evidências científicas de alta qualidade: meta-análises, 
          ensaios clínicos randomizados e diretrizes internacionais publicadas nos últimos 10 anos.
        </p>
      </div>

      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg my-4">
        <div className="font-semibold text-purple-600 mb-1.5">
          🔬 Evidências Clínicas
        </div>
        <div className="text-purple-900 text-sm">
          Estudos demonstram que TNO reduz mortalidade, complicações e tempo de internação 
          em populações cirúrgicas, clínicas e geriátricas. Os efeitos são dose-dependentes 
          e maximizados quando iniciados precocemente.
        </div>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-lg my-4">
        <div className="font-semibold text-orange-600 mb-1.5 flex items-center gap-2">
          💰 Estudos de Custo-Efetividade
        </div>
        <div className="text-orange-900 text-sm">
          Análises econômicas brasileiras e internacionais confirmam que TNO é custo-efetivo, 
          com ROI positivo em 6-12 meses. O investimento inicial é compensado pela redução 
          de complicações e reinternações.
        </div>
      </div>

      {/* Referências Bibliográficas */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5 mt-8">
        <h3 className="font-semibold text-blue-600 mb-4 text-lg">
          📖 Principais Estudos
        </h3>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>Stratton et al. (2003)</strong> - Disease-Related Malnutrition: An Evidence-Based Approach to Treatment. 
            CABI Publishing.
          </li>
          <li>
            <strong>Elia et al. (2016)</strong> - A systematic review of the cost and cost effectiveness of using standard oral 
            nutritional supplements in community and care home settings. Clinical Nutrition, 35(1), 125-137.
          </li>
          <li>
            <strong>Philipson et al. (2013)</strong> - The economic value of oral nutritional supplements in hospitalized patients. 
            American Journal of Managed Care, 19(2), 121-128.
          </li>
          <li>
            <strong>Schuetz et al. (2019)</strong> - Individualised nutritional support in medical inpatients at nutritional risk: 
            a randomised clinical trial. The Lancet, 393(10188), 2312-2321.
          </li>
        </ul>
      </div>

      {/* Meta-análises */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <h3 className="font-semibold text-blue-600 mb-4 text-lg">
          🔍 Meta-análises e Revisões Sistemáticas
        </h3>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>Cochrane Database</strong> - Nutritional supplementation for hip fracture aftercare in older people 
            (redução de 52% em complicações)
          </li>
          <li>
            <strong>ESPEN Guidelines</strong> - Clinical nutrition in surgery (recomendação grau A para TNO perioperatória)
          </li>
          <li>
            <strong>Baldwin et al. (2016)</strong> - Oral nutritional interventions in malnourished patients with cancer: 
            a systematic review and meta-analysis
          </li>
        </ul>
      </div>

      {/* Diretrizes */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <h3 className="font-semibold text-blue-600 mb-4 text-lg">
          📋 Diretrizes Clínicas
        </h3>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li><strong>ESPEN</strong> - European Society for Clinical Nutrition and Metabolism</li>
          <li><strong>ASPEN</strong> - American Society for Parenteral and Enteral Nutrition</li>
          <li><strong>BRASPEN</strong> - Sociedade Brasileira de Nutrição Parenteral e Enteral</li>
          <li><strong>NICE</strong> - National Institute for Health and Care Excellence (UK)</li>
        </ul>
      </div>

      {/* Estudos Brasileiros */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <h3 className="font-semibold text-blue-600 mb-4 text-lg">
          🇧🇷 Contexto Brasileiro
        </h3>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>
            <strong>IBRANUTRI</strong> - Inquérito Brasileiro de Avaliação Nutricional Hospitalar 
            (prevalência de 48% de desnutrição)
          </li>
          <li>
            <strong>Waitzberg et al.</strong> - Hospital malnutrition: the Brazilian national survey (IBRANUTRI): 
            a study of 4000 patients
          </li>
        </ul>
      </div>

      {/* Metodologia */}
      <div className="bg-gray-50 p-6 rounded-xl mb-5">
        <h3 className="font-semibold text-blue-600 mb-4 text-lg">
          ⚙️ Metodologia do Simulador
        </h3>
        <p className="text-gray-700 mb-3">
          Este simulador utiliza uma abordagem baseada em:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Modelos de Markov para transição entre estados de saúde</li>
          <li>Dados epidemiológicos brasileiros (IBRANUTRI, ANS)</li>
          <li>Parâmetros de eficácia de meta-análises internacionais</li>
          <li>Custos adaptados para realidade hospitalar brasileira (SUS e privado)</li>
          <li>Simulação de Monte Carlo para robustez estatística</li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-600 p-5 rounded-lg mt-8">
        <h3 className="text-blue-600 mb-2.5 text-xl font-semibold">
          ⚠️ Limitações e Considerações
        </h3>
        <p className="text-gray-600 leading-relaxed mb-3">
          Este simulador é uma ferramenta educacional baseada em médias populacionais. 
          Resultados individuais podem variar. Recomenda-se:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Validar com dados locais do seu hospital</li>
          <li>Consultar equipe multidisciplinar antes de implementar protocolos</li>
          <li>Monitorar resultados e ajustar conforme necessário</li>
          <li>Considerar que eficácia depende de adesão e qualidade da implementação</li>
        </ul>
      </div>

      <NavigationButtons
        onNext={() => setCurrentSection(1)}
        onPrevious={() => setCurrentSection(5)}
      />
    </section>
  );
}
