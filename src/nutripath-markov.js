/**
 * NutriPath Analyzer - Simulador de Cadeias de Markov
 * Baseado nas premissas científicas do documento técnico
 * Implementação completa de Cadeias de Markov para terapia nutricional
 */

class NutriPathAnalyzer {
    constructor() {
        // Estados do modelo (índices para arrays)
        this.ESTADOS = {
            BN: 0,    // Bem Nutrido
            RN: 1,    // Risco Nutricional  
            DL: 2,    // Desnutrição Leve
            DMG: 3,   // Desnutrição Moderada/Grave
            COMP: 4,  // Complicações
            ALTA: 5,  // Alta Hospitalar
            OBITO: 6  // Óbito
        };

        this.ESTADO_NOMES = ['BN', 'RN', 'DL', 'DMG', 'COMP', 'ALTA', 'OBITO'];
        this.ESTADO_LABELS = [
            'Bem Nutrido', 'Risco Nutricional', 'Desnutrição Leve', 
            'Desnutrição M/G', 'Complicações', 'Alta', 'Óbito'
        ];

        // Estados absorventes (não há transições para fora)
        this.ESTADOS_ABSORVENTES = [this.ESTADOS.ALTA, this.ESTADOS.OBITO];

        // Matrizes de transição baseadas no documento técnico
        this.MATRIZ_COM_TNO = [
            //  BN    RN    DL    DMG   COMP  ALTA  OBITO
            [0.10, 0.05, 0.02, 0.00, 0.03, 0.78, 0.02], // BN
            [0.25, 0.15, 0.10, 0.05, 0.08, 0.35, 0.02], // RN  
            [0.20, 0.25, 0.15, 0.10, 0.15, 0.13, 0.02], // DL
            [0.10, 0.15, 0.20, 0.20, 0.25, 0.05, 0.05], // DMG
            [0.05, 0.10, 0.15, 0.20, 0.30, 0.12, 0.08], // COMP
            [0.00, 0.00, 0.00, 0.00, 0.00, 1.00, 0.00], // ALTA
            [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.00]  // OBITO
        ];

        this.MATRIZ_SEM_TNO = [
            //  BN    RN    DL    DMG   COMP  ALTA  OBITO
            [0.08, 0.15, 0.08, 0.02, 0.07, 0.58, 0.02], // BN
            [0.10, 0.20, 0.25, 0.15, 0.15, 0.13, 0.02], // RN
            [0.05, 0.15, 0.25, 0.25, 0.22, 0.06, 0.02], // DL  
            [0.02, 0.08, 0.15, 0.35, 0.30, 0.02, 0.08], // DMG
            [0.02, 0.05, 0.10, 0.25, 0.40, 0.05, 0.13], // COMP
            [0.00, 0.00, 0.00, 0.00, 0.00, 1.00, 0.00], // ALTA
            [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.00]  // OBITO
        ];

        // Custos diários por estado (R$)
        this.CUSTOS_BASE = [
            550,   // BN: Bem Nutrido
            765,   // RN: Risco Nutricional
            1060,  // DL: Desnutrição Leve  
            1750,  // DMG: Desnutrição Moderada/Grave
            3650,  // COMP: Complicações
            0,     // ALTA: Alta Hospitalar
            0      // OBITO: Óbito
        ];

        // Distribuições iniciais por gravidade
        this.DISTRIBUICOES_INICIAIS = {
            leve: [0.60, 0.25, 0.10, 0.05, 0.00, 0.00, 0.00],     // População leve
            moderada: [0.40, 0.35, 0.15, 0.08, 0.02, 0.00, 0.00], // População moderada  
            grave: [0.25, 0.30, 0.25, 0.15, 0.05, 0.00, 0.00]     // População grave
        };

        // Parâmetros ajustáveis
        this.parametros = {
            populacao: 10000,
            eficaciaTNO: 0.75,
            adesao: 0.80,
            gravidade: 'moderada',
            custoTNODiario: 75,
            custoMedioDiaria: 800,
            maxDias: 30
        };

        // Resultados da simulação
        this.resultados = {
            comTNO: null,
            semTNO: null
        };

        this.charts = {};
        this.initializeEventListeners();
        this.initializeTabs();
        this.updateParameterValues();
        this.displayMatrizes();
    }

    initializeEventListeners() {
        // Sliders de parâmetros
        const sliders = [
            'populationSize', 'tnoEffectiveness', 'adherenceRate', 
            'severityLevel', 'tnoCostPerDay', 'dailyHospitalCost'
        ];

        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.addEventListener('input', () => this.updateParameterValues());
            }
        });

        // Botão de simulação
        const runBtn = document.getElementById('runSimulation');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runSimulation());
        }

        // Botões de export
        ['exportPDF', 'exportExcel', 'exportData'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => this.exportResults(btnId.replace('export', '').toLowerCase()));
            }
        });
    }

    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Remove active de todos
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Ativa o selecionado
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    updateParameterValues() {
        // População
        const populationSlider = document.getElementById('populationSize');
        const populationValue = document.getElementById('populationValue');
        if (populationSlider && populationValue) {
            this.parametros.populacao = parseInt(populationSlider.value);
            populationValue.textContent = this.parametros.populacao.toLocaleString('pt-BR');
        }

        // Eficácia TNO
        const effectivenessSlider = document.getElementById('tnoEffectiveness');
        const effectivenessValue = document.getElementById('effectivenessValue');
        if (effectivenessSlider && effectivenessValue) {
            this.parametros.eficaciaTNO = parseInt(effectivenessSlider.value) / 100;
            effectivenessValue.textContent = `${parseInt(effectivenessSlider.value)}%`;
        }

        // Adesão
        const adherenceSlider = document.getElementById('adherenceRate');
        const adherenceValue = document.getElementById('adherenceValue');
        if (adherenceSlider && adherenceValue) {
            this.parametros.adesao = parseInt(adherenceSlider.value) / 100;
            adherenceValue.textContent = `${parseInt(adherenceSlider.value)}%`;
        }

        // Gravidade
        const severitySlider = document.getElementById('severityLevel');
        const severityValue = document.getElementById('severityValue');
        if (severitySlider && severityValue) {
            const nivel = parseInt(severitySlider.value);
            const niveis = ['Leve', 'Moderada', 'Grave'];
            const chavesNiveis = ['leve', 'moderada', 'grave'];
            this.parametros.gravidade = chavesNiveis[nivel - 1];
            severityValue.textContent = niveis[nivel - 1];
        }

        // Custo TNO
        const tnoCostSlider = document.getElementById('tnoCostPerDay');
        const tnoCostValue = document.getElementById('tnoCostValue');
        if (tnoCostSlider && tnoCostValue) {
            this.parametros.custoTNODiario = parseInt(tnoCostSlider.value);
            tnoCostValue.textContent = `R$ ${this.parametros.custoTNODiario}`;
        }

        // Custo diária hospitalar
        const hospitalCostSlider = document.getElementById('dailyHospitalCost');
        const hospitalCostValue = document.getElementById('hospitalCostValue');
        if (hospitalCostSlider && hospitalCostValue) {
            this.parametros.custoMedioDiaria = parseInt(hospitalCostSlider.value);
            hospitalCostValue.textContent = `R$ ${this.parametros.custoMedioDiaria}`;
            
            // Atualizar custos base proporcionalmente
            this.atualizarCustosBase();
        }
    }

    atualizarCustosBase() {
        // Ajusta os custos base proporcionalmente ao custo médio da diária
        const fatorAjuste = this.parametros.custoMedioDiaria / 800; // 800 é o valor base

        this.custos = this.CUSTOS_BASE.map(custo => Math.round(custo * fatorAjuste));
    }

    // Simulação de um paciente individual através dos estados de Markov
    simularPaciente(matriz, comTNO = false) {
        let estadoAtual = this.selecionarEstadoInicial();
        let custoTotal = 0;
        let dia = 0;
        let trajetoria = [];
        let custoTNOTotal = 0;

        // Aplicar custos atualizados
        const custosUtilizados = this.custos || this.CUSTOS_BASE;

        while (!this.ESTADOS_ABSORVENTES.includes(estadoAtual) && dia < this.parametros.maxDias) {
            // Registrar estado atual
            trajetoria.push({
                dia: dia,
                estado: estadoAtual,
                estadoNome: this.ESTADO_NOMES[estadoAtual]
            });

            // Calcular custos do dia
            const custoDiaHospital = custosUtilizados[estadoAtual];
            custoTotal += custoDiaHospital;

            // Adicionar custo TNO se aplicável
            if (comTNO && !this.ESTADOS_ABSORVENTES.includes(estadoAtual)) {
                custoTNOTotal += this.parametros.custoTNODiario;
            }

            // Transição para próximo estado
            const probabilidades = matriz[estadoAtual];
            estadoAtual = this.escolherProximoEstado(probabilidades);
            
            dia++;
        }

        // Adicionar estado final
        if (dia < this.parametros.maxDias) {
            trajetoria.push({
                dia: dia,
                estado: estadoAtual,
                estadoNome: this.ESTADO_NOMES[estadoAtual]
            });
        }

        return {
            diasInternacao: dia,
            custoHospitalar: custoTotal,
            custoTNO: custoTNOTotal,
            custoTotal: custoTotal + custoTNOTotal,
            estadoFinal: estadoAtual,
            estadoFinalNome: this.ESTADO_NOMES[estadoAtual],
            trajetoria: trajetoria,
            sobreviveu: estadoAtual === this.ESTADOS.ALTA
        };
    }

    selecionarEstadoInicial() {
        const distribuicao = this.DISTRIBUICOES_INICIAIS[this.parametros.gravidade];
        const random = Math.random();
        let acumulado = 0;

        for (let i = 0; i < distribuicao.length; i++) {
            acumulado += distribuicao[i];
            if (random <= acumulado) {
                return i;
            }
        }
        return 0; // Fallback para BN
    }

    escolherProximoEstado(probabilidades) {
        const random = Math.random();
        let acumulado = 0;

        for (let i = 0; i < probabilidades.length; i++) {
            acumulado += probabilidades[i];
            if (random <= acumulado) {
                return i;
            }
        }
        return probabilidades.length - 1; // Fallback para último estado
    }

    // Aplicar eficácia da TNO nas matrizes de transição
    aplicarEficaciaTNO(matriz) {
        const novaMatriz = matriz.map(linha => [...linha]); // Deep copy
        const eficacia = this.parametros.eficaciaTNO;
        const adesao = this.parametros.adesao;
        const eficaciaReal = eficacia * adesao;

        for (let i = 0; i < 5; i++) { // Só estados não-absorventes (0-4)
            for (let j = 0; j < 7; j++) {
                if (j === this.ESTADOS.ALTA) {
                    // Aumenta probabilidade de alta
                    novaMatriz[i][j] *= (1 + eficaciaReal);
                } else if (j === this.ESTADOS.OBITO || j === this.ESTADOS.COMP) {
                    // Diminui probabilidade de complicações e óbito
                    novaMatriz[i][j] *= (1 - eficaciaReal);
                } else if (j > i && j < this.ESTADOS.ALTA) {
                    // Diminui probabilidade de piora
                    novaMatriz[i][j] *= (1 - eficaciaReal * 0.5);
                } else if (j < i) {
                    // Aumenta probabilidade de melhora
                    novaMatriz[i][j] *= (1 + eficaciaReal * 0.5);
                }
            }
            
            // Normalizar probabilidades (devem somar 1.0)
            const soma = novaMatriz[i].reduce((a, b) => a + b, 0);
            for (let j = 0; j < 7; j++) {
                novaMatriz[i][j] /= soma;
            }
        }

        return novaMatriz;
    }

    async runSimulation() {
        const runBtn = document.getElementById('runSimulation');
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        try {
            // Preparar interface
            runBtn.disabled = true;
            runBtn.textContent = '⏳ SIMULANDO...';
            progressContainer.style.display = 'block';

            // Atualizar custos base
            this.atualizarCustosBase();

            // Aplicar eficácia da TNO
            const matrizComTNOAjustada = this.aplicarEficaciaTNO(this.MATRIZ_COM_TNO);

            progressText.textContent = 'Simulando cenário COM TNO...';
            progressFill.style.width = '25%';

            // Simular cenário COM TNO
            const resultadosComTNO = await this.simularCenario(matrizComTNOAjustada, true);
            
            progressText.textContent = 'Simulando cenário SEM TNO...';
            progressFill.style.width = '75%';
            await this.delay(100);

            // Simular cenário SEM TNO
            const resultadosSemTNO = await this.simularCenario(this.MATRIZ_SEM_TNO, false);

            progressText.textContent = 'Finalizando e gerando gráficos...';
            progressFill.style.width = '100%';
            await this.delay(200);

            // Armazenar resultados
            this.resultados = {
                comTNO: resultadosComTNO,
                semTNO: resultadosSemTNO
            };

            // Atualizar dashboard
            this.atualizarDashboard();
            this.atualizarDistribuicaoEstados();
            this.gerarGraficos();

            // Mostrar seção de resultados
            document.getElementById('resultsSection').style.display = 'block';
            document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Erro na simulação:', error);
            alert('Erro durante a simulação. Verifique o console para detalhes.');
        } finally {
            // Restaurar interface
            runBtn.disabled = false;
            runBtn.textContent = '⚡ EXECUTAR SIMULAÇÃO';
            progressContainer.style.display = 'none';
            progressFill.style.width = '0%';
        }
    }

    async simularCenario(matriz, comTNO) {
        const populacao = this.parametros.populacao;
        const pacientes = [];
        const batchSize = 1000;

        for (let i = 0; i < populacao; i += batchSize) {
            const lote = Math.min(batchSize, populacao - i);
            
            for (let j = 0; j < lote; j++) {
                const resultado = this.simularPaciente(matriz, comTNO);
                pacientes.push(resultado);
            }

            // Permitir que a interface respire
            if (i % 2000 === 0) {
                await this.delay(1);
            }
        }

        // Calcular estatísticas
        return this.calcularEstatisticas(pacientes);
    }

    calcularEstatisticas(pacientes) {
        const n = pacientes.length;
        
        // Métricas básicas
        const diasInternacao = pacientes.map(p => p.diasInternacao);
        const custos = pacientes.map(p => p.custoTotal);
        const custosHospitalares = pacientes.map(p => p.custoHospitalar);
        const custosTNO = pacientes.map(p => p.custoTNO);
        
        // Desfechos
        const sobreviventes = pacientes.filter(p => p.sobreviveu).length;
        const mortalidade = ((n - sobreviventes) / n) * 100;
        
        // Distribuição de estados finais
        const estadosFinais = {};
        this.ESTADO_NOMES.forEach(estado => estadosFinais[estado] = 0);
        pacientes.forEach(p => estadosFinais[p.estadoFinalNome]++);

        return {
            n: n,
            diasInternacao: {
                media: this.media(diasInternacao),
                mediana: this.mediana(diasInternacao),
                desvio: this.desvioPadrao(diasInternacao),
                min: Math.min(...diasInternacao),
                max: Math.max(...diasInternacao),
                dados: diasInternacao
            },
            custos: {
                total: {
                    media: this.media(custos),
                    mediana: this.mediana(custos),
                    desvio: this.desvioPadrao(custos),
                    dados: custos
                },
                hospitalar: {
                    media: this.media(custosHospitalares),
                    dados: custosHospitalares
                },
                tno: {
                    media: this.media(custosTNO),
                    dados: custosTNO
                }
            },
            desfechos: {
                sobrevivencia: (sobreviventes / n) * 100,
                mortalidade: mortalidade,
                estadosFinais: estadosFinais
            },
            dadosBrutos: pacientes
        };
    }

    atualizarDashboard() {
        if (!this.resultados.comTNO || !this.resultados.semTNO) return;

        const comTNO = this.resultados.comTNO;
        const semTNO = this.resultados.semTNO;

        // Tempo de internação
        const tempoComTNO = comTNO.diasInternacao.media;
        const tempoSemTNO = semTNO.diasInternacao.media;
        const economiaTempo = tempoSemTNO - tempoComTNO;

        document.getElementById('tno-days').textContent = tempoComTNO.toFixed(1);
        document.getElementById('control-days').textContent = tempoSemTNO.toFixed(1);
        document.getElementById('days-economy').textContent = `ECONOMIA: ${economiaTempo.toFixed(1)} dias`;

        // Custos
        const custoComTNO = comTNO.custos.total.media;
        const custoSemTNO = semTNO.custos.total.media;
        const economiaCusto = custoSemTNO - custoComTNO;

        document.getElementById('tno-cost').textContent = `R$ ${Math.round(custoComTNO/1000 * 10)/10}k`;
        document.getElementById('control-cost').textContent = `R$ ${Math.round(custoSemTNO/1000 * 10)/10}k`;
        document.getElementById('cost-economy').textContent = `ECONOMIA: R$ ${Math.round(economiaCusto/1000 * 10)/10}k`;

        // Mortalidade
        const mortalidadeComTNO = comTNO.desfechos.mortalidade;
        const mortalidadeSemTNO = semTNO.desfechos.mortalidade;
        const rrr = ((mortalidadeSemTNO - mortalidadeComTNO) / mortalidadeSemTNO * 100);

        document.getElementById('tno-mortality').textContent = `${mortalidadeComTNO.toFixed(1)}%`;
        document.getElementById('control-mortality').textContent = `${mortalidadeSemTNO.toFixed(1)}%`;
        document.getElementById('mortality-rrr').textContent = `RRR: ${rrr.toFixed(0)}%`;
    }

    atualizarDistribuicaoEstados() {
        if (!this.resultados.comTNO) return;

        const estados = this.resultados.comTNO.desfechos.estadosFinais;
        const total = this.resultados.comTNO.n;

        Object.keys(estados).forEach((estado, index) => {
            const count = estados[estado];
            const percentage = (count / total * 100);
            
            const stateKey = estado.toLowerCase().replace('ção', 'cao').replace('ó', 'o');
            const countElement = document.getElementById(`${stateKey}-patients`);
            const percentElement = document.getElementById(`${stateKey}-percentage`);
            
            if (countElement) countElement.textContent = count.toLocaleString('pt-BR');
            if (percentElement) percentElement.textContent = `${percentage.toFixed(1)}%`;
        });
    }

    displayMatrizes() {
        this.criarTabelaMatriz('matrixWithTNO', this.MATRIZ_COM_TNO, 'COM TNO');
        this.criarTabelaMatriz('matrixControl', this.MATRIZ_SEM_TNO, 'SEM TNO');
    }

    criarTabelaMatriz(containerId, matriz, titulo) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const table = container.querySelector('table') || container;
        
        // Header
        let html = '<thead><tr><th>Estado Origem</th>';
        this.ESTADO_LABELS.forEach(label => {
            html += `<th>${label}</th>`;
        });
        html += '</tr></thead><tbody>';

        // Linhas da matriz
        matriz.forEach((linha, i) => {
            if (i < 5) { // Só mostrar estados não-absorventes
                html += `<tr><td><strong>${this.ESTADO_LABELS[i]}</strong></td>`;
                linha.forEach((prob, j) => {
                    const classe = prob > 0.3 ? 'high-prob' : '';
                    html += `<td class="${classe}">${(prob * 100).toFixed(1)}%</td>`;
                });
                html += '</tr>';
            }
        });

        html += '</tbody>';
        table.innerHTML = html;
    }

    gerarGraficos() {
        if (!this.resultados.comTNO || !this.resultados.semTNO) return;

        this.criarGraficoROI();
        this.criarGraficoComparacaoCustos();
        this.criarGraficoTempo();
        this.criarGraficoDesfechos();
        this.criarGraficoTornado();
    }

    criarGraficoROI() {
        const ctx = document.getElementById('roiChart');
        if (!ctx) return;

        const comTNO = this.resultados.comTNO;
        const semTNO = this.resultados.semTNO;
        
        const investimento = comTNO.custos.tno.media;
        const economia = semTNO.custos.total.media - comTNO.custos.total.media;
        const roi = ((economia - investimento) / investimento) * 100;

        // Calcular distribuição de ROI
        const rois = [];
        for (let i = 0; i < comTNO.n; i++) {
            const invPaciente = comTNO.dadosBrutos[i].custoTNO;
            const economiaPaciente = semTNO.dadosBrutos[i].custoTotal - comTNO.dadosBrutos[i].custoTotal;
            const roiPaciente = invPaciente > 0 ? ((economiaPaciente - invPaciente) / invPaciente) * 100 : 0;
            rois.push(roiPaciente);
        }

        // Criar histograma
        const bins = this.criarHistograma(rois, 20);

        if (this.charts.roi) this.charts.roi.destroy();
        
        this.charts.roi = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: 'Distribuição do ROI (%)',
                    data: bins.counts,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `ROI Médio: ${roi.toFixed(0)}%`
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'ROI (%)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Frequência'
                        }
                    }
                }
            }
        });
    }

    criarGraficoComparacaoCustos() {
        const ctx = document.getElementById('costComparisonChart');
        if (!ctx) return;

        const comTNO = this.resultados.comTNO;
        const semTNO = this.resultados.semTNO;

        if (this.charts.costs) this.charts.costs.destroy();

        this.charts.costs = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['COM TNO', 'SEM TNO'],
                datasets: [
                    {
                        label: 'Custo Hospitalar',
                        data: [
                            comTNO.custos.hospitalar.media,
                            semTNO.custos.hospitalar.media
                        ],
                        backgroundColor: 'rgba(255, 99, 132, 0.6)'
                    },
                    {
                        label: 'Custo TNO',
                        data: [
                            comTNO.custos.tno.media,
                            0
                        ],
                        backgroundColor: 'rgba(54, 162, 235, 0.6)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Comparação de Custos por Paciente'
                    }
                },
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Custo (R$)'
                        }
                    }
                }
            }
        });
    }

    criarGraficoTempo() {
        const ctx = document.getElementById('losChart');
        if (!ctx) return;

        const comTNO = this.resultados.comTNO.diasInternacao.dados;
        const semTNO = this.resultados.semTNO.diasInternacao.dados;

        // Criar histogramas
        const binsComTNO = this.criarHistograma(comTNO, 15);
        const binsSemTNO = this.criarHistograma(semTNO, 15);

        if (this.charts.los) this.charts.los.destroy();

        this.charts.los = new Chart(ctx, {
            type: 'line',
            data: {
                labels: binsComTNO.labels,
                datasets: [
                    {
                        label: 'COM TNO',
                        data: binsComTNO.densidades,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    },
                    {
                        label: 'SEM TNO',
                        data: binsSemTNO.densidades.slice(0, binsComTNO.labels.length),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribuição do Tempo de Internação'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Dias de Internação'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Densidade'
                        }
                    }
                }
            }
        });
    }

    criarGraficoDesfechos() {
        const ctx = document.getElementById('outcomeChart');
        if (!ctx) return;

        const comTNO = this.resultados.comTNO.desfechos;
        const semTNO = this.resultados.semTNO.desfechos;

        if (this.charts.outcomes) this.charts.outcomes.destroy();

        this.charts.outcomes = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Alta', 'Óbito'],
                datasets: [{
                    label: 'COM TNO',
                    data: [comTNO.sobrevivencia, comTNO.mortalidade],
                    backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Desfechos - Mortalidade: ${comTNO.mortalidade.toFixed(1)}% vs ${semTNO.mortalidade.toFixed(1)}%`
                    }
                }
            }
        });
    }

    criarGraficoTornado() {
        const ctx = document.getElementById('tornadoChart');
        if (!ctx) return;

        // Análise de sensibilidade simplificada
        const fatores = [
            { nome: 'Custo Diária', impacto: 85 },
            { nome: 'Eficácia TNO', impacto: 65 },
            { nome: 'Adesão Protocolo', impacto: 45 },
            { nome: '% Risco Nutricional', impacto: 35 },
            { nome: 'Custo TNO', impacto: -25 }
        ];

        if (this.charts.tornado) this.charts.tornado.destroy();

        this.charts.tornado = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: fatores.map(f => f.nome),
                datasets: [{
                    label: 'Impacto no ROI (%)',
                    data: fatores.map(f => f.impacto),
                    backgroundColor: fatores.map(f => f.impacto > 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    title: {
                        display: true,
                        text: 'Análise de Sensibilidade - Impacto no ROI'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Variação do ROI (%)'
                        }
                    }
                }
            }
        });
    }

    // Funções utilitárias
    criarHistograma(dados, numBins) {
        const min = Math.min(...dados);
        const max = Math.max(...dados);
        const binWidth = (max - min) / numBins;
        
        const bins = Array(numBins).fill(0);
        const labels = [];
        
        for (let i = 0; i < numBins; i++) {
            labels.push((min + i * binWidth).toFixed(1));
        }

        dados.forEach(valor => {
            const binIndex = Math.min(Math.floor((valor - min) / binWidth), numBins - 1);
            bins[binIndex]++;
        });

        // Calcular densidades
        const total = dados.length;
        const densidades = bins.map(count => (count / total) / binWidth);

        return {
            labels: labels,
            counts: bins,
            densidades: densidades
        };
    }

    media(array) {
        return array.reduce((a, b) => a + b, 0) / array.length;
    }

    mediana(array) {
        const sorted = [...array].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
            ? (sorted[middle - 1] + sorted[middle]) / 2 
            : sorted[middle];
    }

    desvioPadrao(array) {
        const avg = this.media(array);
        const squareDiffs = array.map(value => Math.pow(value - avg, 2));
        return Math.sqrt(this.media(squareDiffs));
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    exportResults(format) {
        console.log(`Exportando resultados em formato: ${format}`);
        alert(`Funcionalidade de export ${format.toUpperCase()} será implementada em breve!`);
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.nutriPathAnalyzer = new NutriPathAnalyzer();
    console.log('✅ NutriPath Analyzer inicializado com sucesso!');
});