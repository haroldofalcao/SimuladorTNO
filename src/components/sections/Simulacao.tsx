"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { NavigationButtons } from "@/components/NavigationButtons";
import { useSimulator } from "@/context/SimulatorContext";
import { useAnalytics } from "@/lib/analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function Simulacao() {
  const analytics = useAnalytics();
  const {
    setCurrentSection,
    config,
    hospitalData,
    patientData,
    resultados,
    setResultados,
  } = useSimulator();
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const executeSimulation = async () => {
    setIsSimulating(true);

    // Track simulation start
    analytics.trackSimulationRun({
      hospitalType: config.hospitalType,
      patientType: config.patientType,
      populacao: config.populacao,
      eficaciaTNO: config.eficaciaTNO,
      adesao: config.adesao,
      custoTNODiario: config.custoTNODiario,
    });

    const steps = [
      { progress: 20, text: "Configurando parâmetros do hospital..." },
      { progress: 40, text: "Criando pacientes virtuais..." },
      { progress: 60, text: "Simulando cenário COM TNO..." },
      { progress: 80, text: "Simulando cenário SEM TNO..." },
      { progress: 100, text: "Calculando resultados..." },
    ];

    for (const step of steps) {
      setProgress(step.progress);
      setProgressText(step.text);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Executar simulação
    const hospitalConfig = hospitalData[config.hospitalType];
    const patientConfig = patientData[config.patientType];

    const custoDiario = hospitalConfig.avgDaily;
    const custoComplicacao = hospitalConfig.avgComplicationCost;

    // Ajuste de eficácia baseado na adesão
    const eficaciaAjustada = (config.eficaciaTNO / 100) * (config.adesao / 100);

    // 1. Cálculos de Tempo de Internação (LOS)
    const reductionLOS = eficaciaAjustada * patientConfig.losReductionFactor;
    const tempoSemTNO = patientConfig.avgLOS;
    const tempoComTNO = patientConfig.avgLOS * (1 - reductionLOS);

    // 2. Cálculos de Complicações
    // Taxa base (Sem TNO) vs. Taxa reduzida (Com TNO)
    const taxaComplicacaoSemTNO = patientConfig.baseComplicationRate;
    const reductionComplicacao = eficaciaAjustada * patientConfig.complicationReductionFactor;
    const taxaComplicacaoComTNO = taxaComplicacaoSemTNO * (1 - reductionComplicacao);

    // 3. Cálculos Financeiros
    const custoHospitalarSemTNO = tempoSemTNO * custoDiario;
    const custoHospitalarComTNO = tempoComTNO * custoDiario;

    const custoTNO = tempoComTNO * config.custoTNODiario;

    // Custo ponderado das complicações (Taxa * Custo Unitário)
    // Assume-se que a taxa é a probabilidade de um evento custoso
    const custoComplicacoesSemTNO = (taxaComplicacaoSemTNO / 100) * custoComplicacao;
    const custoComplicacoesComTNO = (taxaComplicacaoComTNO / 100) * custoComplicacao;

    const custoTotalSemTNO = custoHospitalarSemTNO + custoComplicacoesSemTNO;
    const custoTotalComTNO = custoHospitalarComTNO + custoTNO + custoComplicacoesComTNO;

    const simulationResults = {
      comTNO: {
        tempoInternacao: tempoComTNO,
        custo: custoTotalComTNO,
        custoTNO: custoTNO,
        complicacoes: taxaComplicacaoComTNO,
      },
      semTNO: {
        tempoInternacao: tempoSemTNO,
        custo: custoTotalSemTNO,
        complicacoes: taxaComplicacaoSemTNO,
      },
    };

    setResultados(simulationResults);

    // Track simulation completion with results
    const economiaTotal = custoTotalSemTNO - custoTotalComTNO;
    // ROI = (Economia Líquida / Investimento) * 100
    // Economia Líquida = (Custo Total Sem TNO) - (Custo Total Com TNO)
    // *Importante*: O custoTotalComTNO já inclui o custo do TNO.
    // Então Lucro = CustoSem - CustoCom.
    // Investimento = CustoTNO.
    const calculatedRoi = (economiaTotal / custoTNO) * 100;

    analytics.trackSimulationResults({
      roi: calculatedRoi,
      economiaTotal: economiaTotal,
      diasHospitalizacao: tempoSemTNO - tempoComTNO,
      custoTNO: custoTNO,
    });

    setIsSimulating(false);
    setProgress(0);
  };

  const roi = resultados
    ? ((resultados.semTNO.custo - resultados.comTNO.custo) /
      resultados.comTNO.custoTNO) *
    100
    : 0;

  const comparisonChartData = resultados
    ? {
      labels: ["Alta Segura", "Complicações"],
      datasets: [
        {
          label: "COM TNO",
          data: [
            100 - resultados.comTNO.complicacoes,
            resultados.comTNO.complicacoes,
          ],
          backgroundColor: [
            "rgba(22, 163, 74, 0.8)",
            "rgba(220, 38, 38, 0.8)",
          ],
          borderColor: ["#16a34a", "#dc2626"],
          borderWidth: 2,
        },
        {
          label: "SEM TNO",
          data: [
            100 - resultados.semTNO.complicacoes,
            resultados.semTNO.complicacoes,
          ],
          backgroundColor: [
            "rgba(22, 163, 74, 0.4)",
            "rgba(220, 38, 38, 0.4)",
          ],
          borderColor: ["#16a34a", "#dc2626"],
          borderWidth: 2,
          borderDash: [5, 5],
        },
      ],
    }
    : null;

  const costChartData = resultados
    ? {
      labels: ["COM TNO", "SEM TNO"],
      datasets: [
        {
          label: "Custo Hospitalar",
          data: [
            resultados.comTNO.custo - resultados.comTNO.custoTNO,
            resultados.semTNO.custo,
          ],
          backgroundColor: "#3b82f6",
        },
        {
          label: "Custo TNO",
          data: [resultados.comTNO.custoTNO, 0],
          backgroundColor: "#16a34a",
        },
      ],
    }
    : null;

  return (
    <section className="bg-white rounded-xl p-8 mb-5 shadow-md">
      <h1 className="text-4xl mb-4 text-blue-600 flex items-center gap-4">
        🎯 Simulação e Resultados
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Agora vamos simular milhares de pacientes e ver os resultados
      </p>

      <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 p-10 rounded-xl my-8">
        <h2 className="text-2xl text-blue-600 mb-4">⚡ Pronto para simular?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Vamos criar{" "}
          <strong>
            {config.populacao.toLocaleString("pt-BR")} pacientes virtuais
          </strong>{" "}
          e simular seus desfechos com e sem TNO. Isso levará alguns segundos...
        </p>

        <button
          type="button"
          onClick={executeSimulation}
          disabled={isSimulating}
          className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-10 py-4 text-xl font-bold rounded-lg hover:-translate-y-0.5 hover:shadow-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none mb-5"
        >
          {isSimulating ? "⏳ SIMULANDO..." : "⚡ EXECUTAR SIMULAÇÃO"}
        </button>

        {isSimulating && (
          <div className="max-w-2xl mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-teal-500 h-6 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-blue-600 font-semibold">{progressText}</p>
          </div>
        )}
      </div>

      {/* Resultados */}
      {resultados && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            📊 Resultados da Simulação
          </h2>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Tempo de Internação */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-200 p-6 rounded-xl border-l-4 border-blue-600">
              <div className="text-sm text-gray-600 mb-4 uppercase tracking-wide">
                Tempo de Internação
              </div>
              <div className="flex justify-around mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {resultados.comTNO.tempoInternacao.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">Com TNO</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {resultados.semTNO.tempoInternacao.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-600">Sem TNO</div>
                </div>
              </div>
              <div className="text-base font-bold text-orange-600 bg-orange-50 p-2 rounded-md text-center">
                ECONOMIA:{" "}
                {(
                  resultados.semTNO.tempoInternacao -
                  resultados.comTNO.tempoInternacao
                ).toFixed(1)}{" "}
                dias
              </div>
            </div>

            {/* Custos */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-200 p-6 rounded-xl border-l-4 border-blue-600">
              <div className="text-sm text-gray-600 mb-4 uppercase tracking-wide">
                Custo por Paciente
              </div>
              <div className="flex justify-around mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    R$ {(resultados.comTNO.custo / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-gray-600">Com TNO</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    R$ {(resultados.semTNO.custo / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-gray-600">Sem TNO</div>
                </div>
              </div>
              <div className="text-base font-bold text-orange-600 bg-orange-50 p-2 rounded-md text-center">
                ECONOMIA: R${" "}
                {(
                  (resultados.semTNO.custo - resultados.comTNO.custo) /
                  1000
                ).toFixed(1)}
                k
              </div>
            </div>

            {/* ROI */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-200 p-6 rounded-xl border-l-4 border-blue-600">
              <div className="text-sm text-gray-600 mb-4 uppercase tracking-wide">
                Retorno do Investimento
              </div>
              <div className="text-center my-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {roi.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">ROI em TNO</div>
              </div>
              <div className="text-sm text-gray-700 bg-blue-50 p-2 rounded-md text-center">
                Para cada R$ 1 investido, economiza R${" "}
                {(
                  (resultados.semTNO.custo - resultados.comTNO.custo) /
                  resultados.comTNO.custoTNO
                ).toFixed(1)}
              </div>
            </div>

            {/* Complicações */}
            <div className="bg-gradient-to-br from-gray-50 to-slate-200 p-6 rounded-xl border-l-4 border-blue-600">
              <div className="text-sm text-gray-600 mb-4 uppercase tracking-wide">
                Taxa de Complicações
              </div>
              <div className="flex justify-around mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {resultados.comTNO.complicacoes.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Com TNO</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {resultados.semTNO.complicacoes.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600">Sem TNO</div>
                </div>
              </div>
              <div className="text-base font-bold text-orange-600 bg-orange-50 p-2 rounded-md text-center">
                REDUÇÃO:{" "}
                {(
                  ((resultados.semTNO.complicacoes -
                    resultados.comTNO.complicacoes) /
                    resultados.semTNO.complicacoes) *
                  100
                ).toFixed(0)}
                %
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">
                Comparação de Desfechos Clínicos
              </h3>
              <div className="h-80">
                {comparisonChartData && (
                  <Bar
                    data={comparisonChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: "Percentual de Pacientes (%)",
                          },
                        },
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">
                Comparação de Custos por Paciente
              </h3>
              <div className="h-80">
                {costChartData && (
                  <Bar
                    data={costChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { stacked: true },
                        y: {
                          stacked: true,
                          title: {
                            display: true,
                            text: "Custo (R$)",
                          },
                        },
                      },
                      plugins: {
                        title: {
                          display: false,
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Conclusão */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-600 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-green-700 mb-3">
              ✅ Conclusão Final
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Com base na simulação, implementar TNO no seu hospital resultaria
              em uma{" "}
              <strong>
                economia líquida de R${" "}
                {Math.round(
                  resultados.semTNO.custo - resultados.comTNO.custo,
                ).toLocaleString("pt-BR")}{" "}
                por paciente
              </strong>
              , redução de{" "}
              <strong>
                {(
                  resultados.semTNO.tempoInternacao -
                  resultados.comTNO.tempoInternacao
                ).toFixed(1)}{" "}
                dias de internação
              </strong>{" "}
              e{" "}
              <strong>
                {(
                  ((resultados.semTNO.complicacoes -
                    resultados.comTNO.complicacoes) /
                    resultados.semTNO.complicacoes) *
                  100
                ).toFixed(0)}
                % menos complicações
              </strong>
              . O ROI de <strong>{roi.toFixed(0)}%</strong> indica que é um
              investimento altamente recomendado.
            </p>
          </div>
        </div>
      )}

      <NavigationButtons
        onNext={() => setCurrentSection(6)}
        onPrevious={() => setCurrentSection(4)}
      />
    </section>
  );
}
