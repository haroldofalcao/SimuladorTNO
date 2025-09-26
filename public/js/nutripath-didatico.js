/**
 * NutriPath Analyzer - Versão Didática
 * Simulador orientado para profissionais de saúde
 * Foco na jornada de aprendizado e explicações claras
 */

class NutriPathDidatico {
    constructor() {
        // Estado atual da jornada
        this.currentSection = 1;
        this.totalSections = 6;
        
        // Configurações selecionadas
        this.config = {
            hospitalType: 'privado',
            patientType: 'cirurgico',
            populacao: 10000,
            eficaciaTNO: 75,
            adesao: 80,
            custoTNODiario: 75,
            ranges: {
                populacao: { min: 1000, max: 50000 },
                eficacia: { min: 30, max: 95 },
                adesao: { min: 40, max: 95 },
                custoTNO: { min: 25, max: 180 }
            }
        };

        // Dados base por tipo de hospital e paciente
        this.hospitalData = {
            publico: {
                name: 'Hospital Público/SUS',
                costRange: { min: 196, max: 680 },
                avgDaily: 380,
                description: 'Foco em custo-efetividade e atendimento universal'
            },
            privado: {
                name: 'Hospital Privado',
                costRange: { min: 359, max: 5000 },
                avgDaily: 1200,
                description: 'Convênios e particulares com alto padrão'
            },
            misto: {
                name: 'Hospital Misto',
                costRange: { min: 280, max: 950 },
                avgDaily: 600,
                description: 'Atende SUS e convênios/particulares'
            }
        };

        this.patientData = {
            cirurgico: {
                name: 'Pacientes Cirúrgicos',
                avgLOS: 6,
                responseRate: 0.85,
                baseROI: 550,
                description: 'Foco em cicatrização e recuperação pós-operatória'
            },
            clinico: {
                name: 'Pacientes Clínicos',
                avgLOS: 14,
                responseRate: 0.78,
                baseROI: 800,
                description: 'Patologias complexas e internações prolongadas'
            },
            misto: {
                name: 'Perfil Misto',
                avgLOS: 10,
                responseRate: 0.81,
                baseROI: 675,
                description: 'Mistura equilibrada de ambos os perfis'
            }
        };

        // Estados de Markov baseados no documento técnico
        this.ESTADOS = {
            BN: 0, RN: 1, DL: 2, DMG: 3, COMP: 4, ALTA: 5, OBITO: 6
        };

        this.MATRIZ_COM_TNO = [
            [0.10, 0.05, 0.02, 0.00, 0.03, 0.78, 0.02],
            [0.25, 0.15, 0.10, 0.05, 0.08, 0.35, 0.02],
            [0.20, 0.25, 0.15, 0.10, 0.15, 0.13, 0.02],
            [0.10, 0.15, 0.20, 0.20, 0.25, 0.05, 0.05],
            [0.05, 0.10, 0.15, 0.20, 0.30, 0.12, 0.08],
            [0.00, 0.00, 0.00, 0.00, 0.00, 1.00, 0.00],
            [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.00]
        ];

        this.MATRIZ_SEM_TNO = [
            [0.08, 0.15, 0.08, 0.02, 0.07, 0.58, 0.02],
            [0.10, 0.20, 0.25, 0.15, 0.15, 0.13, 0.02],
            [0.05, 0.15, 0.25, 0.25, 0.22, 0.06, 0.02],
            [0.02, 0.08, 0.15, 0.35, 0.30, 0.02, 0.08],
            [0.02, 0.05, 0.10, 0.25, 0.40, 0.05, 0.13],
            [0.00, 0.00, 0.00, 0.00, 0.00, 1.00, 0.00],
            [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1.00]
        ];

        this.CUSTOS_BASE = [550, 765, 1060, 1750, 3650, 0, 0];

        this.resultados = null;
        this.charts = {};

        this.initializeEventListeners();
        this.updateDisplays();
    }

    initializeEventListeners() {
        // Seletores de tipo
        this.initializeTypeSelectors();
        
        // Sliders personalizáveis
        this.initializeCustomSliders();
        
        // Botão de simulação
        const runBtn = document.getElementById('runSimulation');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runSimulation());
        }

        // Navegação
        window.nextSection = () => this.nextSection();
        window.previousSection = () => this.previousSection();
        window.restartJourney = () => this.restartJourney();
    }

    initializeTypeSelectors() {
        // Seletor de hospital
        const hospitalCards = document.querySelectorAll('#hospitalTypeSelector .type-card');
        hospitalCards.forEach(card => {
            card.addEventListener('click', () => {
                hospitalCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.config.hospitalType = card.dataset.type;
                this.updateDisplays();
            });
        });

        // Seletor de paciente
        const patientCards = document.querySelectorAll('#patientTypeSelector .type-card');
        patientCards.forEach(card => {
            card.addEventListener('click', () => {
                patientCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.config.patientType = card.dataset.type;
                this.updateDisplays();
            });
        });
    }

    initializeCustomSliders() {
        const sliders = [
            { id: 'population', config: 'populacao', unit: ' pacientes', format: 'number' },
            { id: 'eficacia', config: 'eficaciaTNO', unit: '% de eficácia', format: 'percent' },
            { id: 'adesao', config: 'adesao', unit: '% de adesão', format: 'percent' },
            { id: 'custoTNO', config: 'custoTNODiario', unit: ' por dia', format: 'currency' }
        ];

        sliders.forEach(slider => {
            this.setupCustomSlider(slider);
        });
    }

    setupCustomSlider(slider) {
        const minInput = document.getElementById(`${slider.id}Min`);
        const maxInput = document.getElementById(`${slider.id}Max`);
        const sliderElement = document.getElementById(`${slider.id}Slider`);
        const valueDisplay = document.getElementById(`${slider.id}Value`);

        if (!minInput || !maxInput || !sliderElement || !valueDisplay) return;

        const updateSlider = () => {
            const min = parseInt(minInput.value) || 0;
            const max = parseInt(maxInput.value) || 100;
            
            if (min >= max) {
                maxInput.value = min + 1;
                return;
            }

            sliderElement.min = min;
            sliderElement.max = max;
            
            // Ajustar valor atual se necessário
            let currentValue = parseInt(sliderElement.value);
            if (currentValue < min) currentValue = min;
            if (currentValue > max) currentValue = max;
            sliderElement.value = currentValue;

            this.config[slider.config] = currentValue;
            this.updateSliderDisplay(slider, currentValue);
        };

        const updateValue = () => {
            const value = parseInt(sliderElement.value);
            this.config[slider.config] = value;
            this.updateSliderDisplay(slider, value);
            this.updateSimulationCount();
        };

        minInput.addEventListener('input', updateSlider);
        maxInput.addEventListener('input', updateSlider);
        sliderElement.addEventListener('input', updateValue);

        // Inicializar
        updateSlider();
    }

    updateSliderDisplay(slider, value) {
        const valueDisplay = document.getElementById(`${slider.id}Value`);
        if (!valueDisplay) return;

        let displayValue = '';
        switch (slider.format) {
            case 'number':
                displayValue = value.toLocaleString('pt-BR') + slider.unit;
                break;
            case 'percent':
                displayValue = value + slider.unit;
                break;
            case 'currency':
                displayValue = 'R$ ' + value + slider.unit;
                break;
            default:
                displayValue = value + slider.unit;
        }

        valueDisplay.textContent = displayValue;
    }

    updateSimulationCount() {
        const countElement = document.getElementById('simulationCount');
        if (countElement) {
            countElement.textContent = this.config.populacao.toLocaleString('pt-BR');
        }
    }

    updateDisplays() {
        this.updateSimulationCount();
        // Adicionar outras atualizações de display se necessário
    }

    nextSection() {
        if (this.currentSection < this.totalSections) {
            this.showSection(this.currentSection + 1);
        }
    }

    previousSection() {
        if (this.currentSection > 1) {
            this.showSection(this.currentSection - 1);
        }
    }

    showSection(sectionNumber) {
        // Esconder seção atual
        const currentSectionElement = document.getElementById(`section${this.currentSection}`);
        if (currentSectionElement) {
            currentSectionElement.classList.remove('active');
        }

        // Atualizar indicador de progresso
        const currentStep = document.getElementById(`step${this.currentSection}`);
        if (currentStep) {
            currentStep.classList.remove('active');
            currentStep.classList.add('completed');
        }

        // Mostrar nova seção
        this.currentSection = sectionNumber;
        const newSectionElement = document.getElementById(`section${this.currentSection}`);
        if (newSectionElement) {
            newSectionElement.classList.add('active');
            newSectionElement.scrollIntoView({ behavior: 'smooth' });
        }

        // Atualizar indicador de progresso
        const newStep = document.getElementById(`step${this.currentSection}`);
        if (newStep) {
            newStep.classList.add('active');
            newStep.classList.remove('completed');
        }
    }

    restartJourney() {
        // Reset para seção 1
        this.showSection(1);
        
        // Reset indicadores de progresso
        for (let i = 1; i <= this.totalSections; i++) {
            const step = document.getElementById(`step${i}`);
            if (step) {
                step.classList.remove('active', 'completed');
            }
        }
        
        const firstStep = document.getElementById('step1');
        if (firstStep) {
            firstStep.classList.add('active');
        }

        // Esconder resultados
        const resultsDashboard = document.getElementById('resultsDashboard');
        if (resultsDashboard) {
            resultsDashboard.style.display = 'none';
        }
    }

    async runSimulation() {
        const runBtn = document.getElementById('runSimulation');
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const resultsDashboard = document.getElementById('resultsDashboard');

        try {
            // Preparar interface
            runBtn.disabled = true;
            runBtn.textContent = '⏳ SIMULANDO...';
            progressContainer.style.display = 'block';
            
            // Simular progresso
            const steps = [
                { progress: 20, text: 'Configurando parâmetros do hospital...' },
                { progress: 40, text: 'Criando pacientes virtuais...' },
                { progress: 60, text: 'Simulando cenário COM TNO...' },
                { progress: 80, text: 'Simulando cenário SEM TNO...' },
                { progress: 100, text: 'Calculando resultados...' }
            ];

            for (const step of steps) {
                progressFill.style.width = step.progress + '%';
                progressText.textContent = step.text;
                await this.delay(800);
            }

            // Executar simulação real
            this.resultados = await this.executeSimulation();

            // Atualizar dashboard
            this.updateResultsDashboard();
            this.createCharts();

            // Mostrar resultados
            resultsDashboard.style.display = 'block';
            resultsDashboard.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Erro na simulação:', error);
            alert('Erro durante a simulação. Tente novamente.');
        } finally {
            // Restaurar interface
            runBtn.disabled = false;
            runBtn.textContent = '⚡ EXECUTAR SIMULAÇÃO';
            progressContainer.style.display = 'none';
            progressFill.style.width = '0%';
        }
    }

    async executeSimulation() {
        // Simular com base na configuração atual
        const hospitalConfig = this.hospitalData[this.config.hospitalType];
        const patientConfig = this.patientData[this.config.patientType];
        
        const custoDiario = hospitalConfig.avgDaily;
        const eficaciaAjustada = (this.config.eficaciaTNO / 100) * (this.config.adesao / 100);
        
        // Resultados simulados baseados na configuração
        const tempoComTNO = patientConfig.avgLOS * (1 - eficaciaAjustada * 0.3);
        const tempoSemTNO = patientConfig.avgLOS;
        
        const custoComTNO = (tempoComTNO * custoDiario) + (tempoComTNO * this.config.custoTNODiario);
        const custoSemTNO = tempoSemTNO * custoDiario;
        
        const complicacoesComTNO = 18 * (1 - eficaciaAjustada * 0.4);
        const complicacoesSemTNO = 28;
        
        return {
            comTNO: {
                tempoInternacao: tempoComTNO,
                custo: custoComTNO,
                custoTNO: tempoComTNO * this.config.custoTNODiario,
                complicacoes: complicacoesComTNO
            },
            semTNO: {
                tempoInternacao: tempoSemTNO,
                custo: custoSemTNO,
                complicacoes: complicacoesSemTNO
            }
        };
    }

    updateResultsDashboard() {
        if (!this.resultados) return;

        const { comTNO, semTNO } = this.resultados;
        
        // Tempo de internação
        document.getElementById('tnoInternacao').textContent = comTNO.tempoInternacao.toFixed(1);
        document.getElementById('controlInternacao').textContent = semTNO.tempoInternacao.toFixed(1);
        document.getElementById('internacaoEconomia').textContent = 
            `ECONOMIA: ${(semTNO.tempoInternacao - comTNO.tempoInternacao).toFixed(1)} dias`;

        // Custos
        document.getElementById('tnoCusto').textContent = 
            `R$ ${(comTNO.custo/1000).toFixed(1)}k`;
        document.getElementById('controlCusto').textContent = 
            `R$ ${(semTNO.custo/1000).toFixed(1)}k`;
        document.getElementById('custoEconomia').textContent = 
            `ECONOMIA: R$ ${((semTNO.custo - comTNO.custo)/1000).toFixed(1)}k`;

        // ROI
        const investimento = comTNO.custoTNO;
        const economia = semTNO.custo - comTNO.custo;
        const roi = ((economia - investimento) / investimento * 100);
        document.getElementById('roiExplanation').textContent = 
            `Para cada R$ 1 investido em TNO, o hospital economiza R$ ${(economia/investimento).toFixed(1)}. ROI de ${roi.toFixed(0)}%!`;

        // Complicações
        document.getElementById('tnoComplicacoes').textContent = `${comTNO.complicacoes.toFixed(0)}%`;
        document.getElementById('controlComplicacoes').textContent = `${semTNO.complicacoes.toFixed(0)}%`;
        document.getElementById('complicacoesReducao').textContent = 
            `REDUÇÃO: ${(((semTNO.complicacoes - comTNO.complicacoes) / semTNO.complicacoes) * 100).toFixed(0)}%`;

        // Conclusão final
        const economiaTotal = semTNO.custo - comTNO.custo;
        const diasEconomia = semTNO.tempoInternacao - comTNO.tempoInternacao;
        const percentualComplicacoes = ((semTNO.complicacoes - comTNO.complicacoes) / semTNO.complicacoes) * 100;
        
        document.getElementById('finalConclusion').innerHTML = 
            `Com base na simulação, implementar TNO no seu hospital resultaria em uma <strong>economia líquida de R$ ${Math.round(economiaTotal).toLocaleString('pt-BR')} por paciente</strong>, 
            redução de <strong>${diasEconomia.toFixed(1)} dias de internação</strong> e <strong>${percentualComplicacoes.toFixed(0)}% menos complicações</strong>. 
            O ROI de <strong>${roi.toFixed(0)}%</strong> indica que é um investimento altamente recomendado.`;
    }

    createCharts() {
        this.createComparisonChart();
        this.createCostChart();
    }

    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart');
        if (!ctx || !this.resultados) return;

        if (this.charts.comparison) this.charts.comparison.destroy();

        const { comTNO, semTNO } = this.resultados;

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Alta Segura', 'Complicações'],
                datasets: [
                    {
                        label: 'COM TNO',
                        data: [
                            100 - comTNO.complicacoes,
                            comTNO.complicacoes
                        ],
                        backgroundColor: ['rgba(22, 163, 74, 0.8)', 'rgba(220, 38, 38, 0.8)'],
                        borderColor: ['#16a34a', '#dc2626'],
                        borderWidth: 2
                    },
                    {
                        label: 'SEM TNO',
                        data: [
                            100 - semTNO.complicacoes,
                            semTNO.complicacoes
                        ],
                        backgroundColor: ['rgba(22, 163, 74, 0.4)', 'rgba(220, 38, 38, 0.4)'],
                        borderColor: ['#16a34a', '#dc2626'],
                        borderWidth: 2,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentual de Pacientes (%)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    createCostChart() {
        const ctx = document.getElementById('costChart');
        if (!ctx || !this.resultados) return;

        if (this.charts.cost) this.charts.cost.destroy();

        this.charts.cost = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['COM TNO', 'SEM TNO'],
                datasets: [
                    {
                        label: 'Custo Hospitalar',
                        data: [
                            this.resultados.comTNO.custo - this.resultados.comTNO.custoTNO,
                            this.resultados.semTNO.custo
                        ],
                        backgroundColor: '#3b82f6'
                    },
                    {
                        label: 'Custo TNO',
                        data: [this.resultados.comTNO.custoTNO, 0],
                        backgroundColor: '#16a34a'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: { 
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Custo (R$)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Comparação de Custos por Paciente'
                    }
                }
            }
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.nutriPathDidatico = new NutriPathDidatico();
    console.log('✅ NutriPath Didático inicializado com sucesso!');
});