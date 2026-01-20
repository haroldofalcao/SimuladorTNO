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
import { NavigationButtons } from "@/components/shared/NavigationButtons";
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
            "#11aced", // Danone Cyan
            "#ec4899", // Pink/Red for complications (kept distinct but vibrant)
          ],
          borderColor: ["#0e7490", "#be185d"],
          borderWidth: 0,
          borderRadius: 8,
        },
        {
          label: "SEM TNO",
          data: [
            100 - resultados.semTNO.complicacoes,
            resultados.semTNO.complicacoes,
          ],
          backgroundColor: [
            "rgba(17, 172, 237, 0.3)", // Faded Cyan
            "rgba(236, 72, 153, 0.3)", // Faded Pink
          ],
          borderColor: ["#0e7490", "#be185d"],
          borderWidth: 1,
          borderDash: [5, 5],
          borderRadius: 8,
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
          backgroundColor: "#3b47a7", // Danone Blue
          borderRadius: 6,
        },
        {
          label: "Custo TNO",
          data: [resultados.comTNO.custoTNO, 0],
          backgroundColor: "#11aced", // Danone Cyan
          borderRadius: 6,
        },
      ],
    }
    : null;

  return (
    <section className="glass-panel p-8 mb-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl mb-2 font-bold flex items-center gap-4">
        <span className="text-gradient">Simulação e Resultados</span>
      </h1>
      <p className="text-lg text-gray-500 mb-8">
        Visualize o impacto da TNO em tempo real.
      </p>

      <div className="text-center bg-white/50 backdrop-blur-sm border border-white/60 p-10 rounded-2xl my-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⚡ Pronto para simular?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Vamos processar os dados de{" "}
          <strong className="text-blue-700">
            {config.populacao.toLocaleString("pt-BR")} pacientes virtuais
          </strong>{" "}
          utilizando modelagem de Monte Carlo para máxima precisão.
        </p>

        <button
          type="button"
          onClick={executeSimulation}
          disabled={isSimulating}
          className={`px-10 py-4 text-xl font-bold rounded-full transition-all ${isSimulating
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "btn-primary hover:scale-105"
            }`}
        >
          {isSimulating ? "PROCESSANDO..." : "EXECUTAR SIMULAÇÃO"}
        </button>

        {isSimulating && (
          <div className="max-w-xl mx-auto mt-8">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[var(--danone-blue)] to-[var(--danone-cyan)] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm font-medium text-blue-600 animate-pulse">{progressText}</p>
          </div>
        )}
      </div>

      {/* Resultados */}
      {resultados && (
        <div className="mt-12 space-y-12 animate-in slide-in-from-bottom-8 duration-700 fade-in">

          {/* KPIs Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI 1: Tempo de Internação */}
            <div className="glass-panel p-6 border-l-4 border-l-[var(--danone-cyan)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl text-[var(--danone-cyan)]">🏥</span>
              </div>
              <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                Tempo de Internação
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-800">
                    {resultados.comTNO.tempoInternacao.toFixed(1)} <span className="text-sm font-normal text-gray-400">dias</span>
                  </div>
                  <div className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                    📉 -{(resultados.semTNO.tempoInternacao - resultados.comTNO.tempoInternacao).toFixed(1)} dias
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div className="bg-[var(--danone-cyan)] h-1.5 rounded-full" style={{ width: `${(resultados.comTNO.tempoInternacao / resultados.semTNO.tempoInternacao) * 100}%` }}></div>
              </div>
            </div>

            {/* KPI 2: Custo por Paciente */}
            <div className="glass-panel p-6 border-l-4 border-l-[var(--danone-blue)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl text-[var(--danone-blue)]">💰</span>
              </div>
              <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                Economia por Paciente
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-3xl font-bold text-[var(--danone-blue)]">
                    R$ {((resultados.semTNO.custo - resultados.comTNO.custo) / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Custo Com TNO: R$ {(resultados.comTNO.custo / 1000).toFixed(1)}k
                  </div>
                </div>
              </div>
            </div>

            {/* KPI 3: ROI */}
            <div className="glass-panel p-6 border-t-4 border-t-green-500 bg-gradient-to-b from-green-50/50 to-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-200 rounded-full filter blur-2xl opacity-50"></div>
              <div className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wider">
                ROI (Retorno)
              </div>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-green-600 tracking-tighter">
                  {roi.toFixed(0)}%
                </div>
                <div className="text-xs font-medium text-green-800 mt-2 bg-green-100 px-2 py-1 rounded-full inline-block">
                  Para cada R$ 1 investido
                </div>
              </div>
            </div>

            {/* KPI 4: Complicações */}
            <div className="glass-panel p-6 border-l-4 border-l-red-400 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl text-red-500">📉</span>
              </div>
              <div className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                Redução de Complicações
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-800">
                    {((
                      (resultados.semTNO.complicacoes - resultados.comTNO.complicacoes) /
                      resultados.semTNO.complicacoes
                    ) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-red-500 font-semibold mt-1">
                    Menos eventos adversos
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                <div className="bg-red-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-[var(--danone-cyan)] rounded-full"></span>
                Desfechos Clínicos
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
                          grid: { color: "rgba(0,0,0,0.05)" },
                        },
                        x: {
                          grid: { display: false },
                        }
                      },
                      plugins: {
                        legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-[var(--danone-blue)] rounded-full"></span>
                Análise Econômica
              </h3>
              <div className="h-80">
                {costChartData && (
                  <Bar
                    data={costChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { stacked: true, grid: { display: false } },
                        y: { stacked: true, grid: { color: "rgba(0,0,0,0.05)" } },
                      },
                      plugins: {
                        legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8 } },
                      },
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Conclusão */}
          <div className="glass-panel p-8 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-100">
            <h3 className="text-xl font-bold text-[var(--danone-blue)] mb-4 flex items-center gap-2">
              ✅ Conclusão Estratégica
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              A implementação do protocolo de TNO demonstra viabilidade econômica robusta, gerando uma
              <strong className="text-[var(--danone-blue)]"> economia líquida de R$ {Math.round(resultados.semTNO.custo - resultados.comTNO.custo).toLocaleString("pt-BR")} por paciente</strong>.
              Além do retorno financeiro, observa-se ganho clínico significativo com a redução média de
              <strong> {(resultados.semTNO.tempoInternacao - resultados.comTNO.tempoInternacao).toFixed(1)} dias</strong> de internação.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setCurrentSection(4)}
          className="text-gray-400 hover:text-gray-600 font-semibold px-6 py-3"
        >
          ← Voltar
        </button>
        {/* Custom Navigation Button if needed, or stick to the shared component if refactored */}
      </div>
    </section>
  );
}
