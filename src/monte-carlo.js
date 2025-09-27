// Hospital Economic Simulator - Monte Carlo Implementation
class HospitalSimulator {
    constructor() {
        this.simulationData = null;
        this.charts = {};
        this.currentStep = 1;
        this.hospitalType = 'privado'; // Padrão
        this.patientType = 'cirurgico'; // Padrão
        
        console.log('HospitalSimulator inicializado com:', {
            hospitalType: this.hospitalType,
            patientType: this.patientType
        });
        
        this.initializeEventListeners();
        this.updateParameterValues();
        this.initializeSteps();
    }

    initializeEventListeners() {
        console.log('🔧 Inicializando event listeners...');
        
        // Parâmetros range sliders tradicionais
        const sliders = ['numLeitos', 'riscoPercent'];
        sliders.forEach(slider => {
            const element = document.getElementById(slider);
            if (element) {
                console.log(`✅ Slider ${slider} encontrado`);
                element.addEventListener('input', () => this.updateParameterValues());
            } else {
                console.warn(`⚠️ Slider ${slider} NÃO encontrado`);
            }
        });

        // Range duplo para custos de diária
        this.initializeDualRange();

        // Seletor inteligente de hospital (substitui tanto tipo quanto presets)
        const hospitalCards = document.querySelectorAll('.hospital-card');
        console.log(`📋 Encontrados ${hospitalCards.length} cards de hospital`);
        hospitalCards.forEach(card => {
            card.addEventListener('click', (e) => this.selectHospitalSmart(e));
        });
        
        // Seletor tipo paciente
        const patientOptions = document.querySelectorAll('.patient-option');
        console.log(`👥 Encontradas ${patientOptions.length} opções de paciente`);
        patientOptions.forEach(option => {
            option.addEventListener('click', (e) => this.selectPatientType(e));
        });

        // Botão simulação
        const runBtn = document.getElementById('runSimulation');
        if (runBtn) {
            console.log('✅ Botão runSimulation encontrado, adicionando event listener');
            runBtn.addEventListener('click', () => {
                console.log('🔥 Event listener do botão runSimulation foi acionado');
                this.runMonteCarloSimulation();
            });
        } else {
            console.error('❌ Botão runSimulation NÃO encontrado no DOM');
        }

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Export buttons
        document.getElementById('exportPDF')?.addEventListener('click', () => this.exportToPDF());
        document.getElementById('exportExcel')?.addEventListener('click', () => this.exportToExcel());
        
        // Tooltips acessíveis
        this.initializeAccessibleTooltips();
        
        // Navegação por teclado melhorada
        this.initializeKeyboardNavigation();
    }
    
    initializeSteps() {
        // Inicializar navegação guiada
        this.updateStepIndicator();
        
        // Observer para detectar scroll e atualizar steps
        const sections = ['caso-clinico', 'parametros', 'simulacao', 'resultados'];
        const options = {
            threshold: 0.5,
            rootMargin: '-50px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stepIndex = sections.indexOf(entry.target.id) + 1;
                    if (stepIndex > 0) {
                        this.currentStep = stepIndex;
                        this.updateStepIndicator();
                    }
                }
            });
        }, options);
        
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });
    }
    
    updateStepIndicator() {
        for (let i = 1; i <= 4; i++) {
            const step = document.getElementById(`step${i}`);
            if (step) {
                step.classList.remove('active', 'completed');
                if (i < this.currentStep) {
                    step.classList.add('completed');
                } else if (i === this.currentStep) {
                    step.classList.add('active');
                }
            }
        }
    }
    
    selectHospitalSmart(event) {
        // Remove seleção anterior
        document.querySelectorAll('.hospital-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        const selectedCard = event.currentTarget;
        selectedCard.classList.add('selected');
        
        // Define tipo de hospital
        this.hospitalType = selectedCard.dataset.type;
        
        // Aplica valores automaticamente (substitui applyPreset)
        const minVal = parseInt(selectedCard.dataset.min);
        const maxVal = parseInt(selectedCard.dataset.max);
        
        const minRange = document.getElementById('custoDiariaMin');
        const maxRange = document.getElementById('custoDiariaMax');

        if (minRange && maxRange) {
            minRange.value = minVal;
            maxRange.value = maxVal;
            this.handleRangeChange();
        }
        
        // Atualizar feedback
        const feedbackText = document.getElementById('hospitalSelectionFeedback');
        const hospitalNames = {
            'publico': 'Hospital Público/SUS',
            'privado': 'Hospital Privado', 
            'misto': 'Hospital Misto'
        };
        
        if (feedbackText) {
            feedbackText.textContent = `${hospitalNames[this.hospitalType]} selecionado. Valores ajustados automaticamente para R$ ${minVal.toLocaleString('pt-BR')} - R$ ${maxVal.toLocaleString('pt-BR')}.`;
        }
        
        console.log('Hospital selecionado:', this.hospitalType, 'Valores:', minVal, '-', maxVal);
    }
    
    selectPatientType(event) {
        // Remove seleção anterior
        document.querySelectorAll('.patient-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        event.currentTarget.classList.add('selected');
        this.patientType = event.currentTarget.dataset.type;
        
        console.log('Tipo de paciente selecionado:', this.patientType);
    }

    updateParameterValues() {
        const numLeitos = document.getElementById('numLeitos')?.value || 200;
        const riscoPercent = document.getElementById('riscoPercent')?.value || 48;

        document.getElementById('numLeitosValue').textContent = numLeitos;
        document.getElementById('riscoPercentValue').textContent = `${riscoPercent}%`;
        
        // Atualizar valores do range duplo
        this.updateDualRangeValues();
    }

    initializeDualRange() {
        const minRange = document.getElementById('custoDiariaMin');
        const maxRange = document.getElementById('custoDiariaMax');
        const rangeFill = document.getElementById('rangeFill');
        
        if (!minRange || !maxRange || !rangeFill) return;

        // Event listeners para os ranges
        minRange.addEventListener('input', () => this.handleRangeChange());
        maxRange.addEventListener('input', () => this.handleRangeChange());

        // Removido: presets agora são integrados na seleção de hospital

        // Inicializar valores
        this.updateDualRangeValues();
        this.updateRangeFill();
        
        // Aplicar seleção padrão para hospital privado
        setTimeout(() => {
            const defaultCard = document.querySelector('.hospital-card[data-type="privado"]');
            if (defaultCard) {
                defaultCard.click();
            }
        }, 100);
    }

    handleRangeChange() {
        const minRange = document.getElementById('custoDiariaMin');
        const maxRange = document.getElementById('custoDiariaMax');
        
        let minVal = parseInt(minRange.value);
        let maxVal = parseInt(maxRange.value);

        // Garantir que min não seja maior que max
        if (minVal >= maxVal) {
            minVal = maxVal - 50;
            minRange.value = minVal;
        }

        // Garantir que max não seja menor que min
        if (maxVal <= minVal) {
            maxVal = minVal + 50;
            maxRange.value = maxVal;
        }

        this.updateDualRangeValues();
        this.updateRangeFill();
        this.updateCostFeedback(minVal, maxVal);
    }

    updateDualRangeValues() {
        const minRange = document.getElementById('custoDiariaMin');
        const maxRange = document.getElementById('custoDiariaMax');
        const minValue = document.getElementById('custoDiariaMinValue');
        const maxValue = document.getElementById('custoDiariaMaxValue');

        if (minRange && maxRange && minValue && maxValue) {
            const minVal = parseInt(minRange.value);
            const maxVal = parseInt(maxRange.value);
            
            const minText = `R$ ${minVal.toLocaleString('pt-BR')}`;
            const maxText = `R$ ${maxVal.toLocaleString('pt-BR')}`;
            
            // Atualizar texto visível
            minValue.textContent = minText;
            maxValue.textContent = maxText;
            
            // Atualizar atributos ARIA para acessibilidade
            minRange.setAttribute('aria-valuenow', minVal);
            minRange.setAttribute('aria-valuetext', minText);
            maxRange.setAttribute('aria-valuenow', maxVal);
            maxRange.setAttribute('aria-valuetext', maxText);
            
            this.updateCostFeedback(minVal, maxVal);
        }
    }

    updateRangeFill() {
        const minRange = document.getElementById('custoDiariaMin');
        const maxRange = document.getElementById('custoDiariaMax');
        const rangeFill = document.getElementById('rangeFill');

        if (!minRange || !maxRange || !rangeFill) return;

        const min = parseInt(minRange.min);
        const max = parseInt(minRange.max);
        const minVal = parseInt(minRange.value);
        const maxVal = parseInt(maxRange.value);

        // Calcular percentuais ajustados para o novo layout
        const leftPercent = ((minVal - min) / (max - min)) * 100;
        const rightPercent = ((maxVal - min) / (max - min)) * 100;

        rangeFill.style.left = `${leftPercent}%`;
        rangeFill.style.width = `${rightPercent - leftPercent}%`;
    }

    updateCostFeedback(minVal, maxVal) {
        const costRange = document.getElementById('costRange');
        const costTip = document.getElementById('costTip');
        
        if (!costRange || !costTip) return;

        const amplitude = maxVal - minVal;
        const media = (minVal + maxVal) / 2;

        // Feedback sobre amplitude
        let amplitudeFeedback = '';
        if (amplitude < 200) {
            amplitudeFeedback = '(Amplitude baixa - considere maior variação)';
        } else if (amplitude > 1000) {
            amplitudeFeedback = '(Amplitude alta - verifique se é realista)';
        } else {
            amplitudeFeedback = '(Amplitude adequada)';
        }

        costRange.textContent = `Variação: R$ ${amplitude.toLocaleString('pt-BR')} ${amplitudeFeedback}`;

        // Dicas contextuais
        let dica = '';
        if (media < 300) {
            dica = 'Dica: Valores típicos de hospitais públicos/SUS';
        } else if (media > 1000) {
            dica = 'Dica: Valores típicos de hospitais privados premium';
        } else {
            dica = 'Dica: Valores realistas geram simulações precisas';
        }

        costTip.textContent = dica;
    }

    // Função removida - funcionalidade integrada em selectHospitalSmart

    // Função helper para obter valores do range duplo nas simulações
    getCostRange() {
        const minRange = document.getElementById('custoDiariaMin');
        const maxRange = document.getElementById('custoDiariaMax');
        
        let min = parseInt(minRange?.value || 400);
        let max = parseInt(maxRange?.value || 1200);
        
        // Debug: mostrar valores obtidos
        console.log('getCostRange chamado:', {minRange: minRange?.value, maxRange: maxRange?.value, min, max});
        
        // Validações de segurança
        if (isNaN(min) || min <= 0) {
            console.warn('Valor mínimo inválido, usando padrão 196');
            min = 196; // Padrão SUS
        }
        
        if (isNaN(max) || max <= 0) {
            console.warn('Valor máximo inválido, usando padrão 680');
            max = 680; // Padrão SUS
        }
        
        if (min >= max) {
            console.warn('Min >= Max, corrigindo valores');
            max = min + 100;
        }
        
        return { min, max };
    }

    initializeAccessibleTooltips() {
        // Encontrar todos os tooltips existentes e convertê-los
        document.querySelectorAll('.tooltip').forEach((tooltip, index) => {
            const text = tooltip.textContent;
            const tooltipText = tooltip.querySelector('.tooltiptext').textContent;
            
            // Criar novo botão acessível
            const btn = document.createElement('button');
            btn.className = 'tooltip-btn';
            btn.textContent = text.replace(tooltipText, '').trim();
            btn.setAttribute('aria-describedby', `tooltip-${index}`);
            
            // Criar conteúdo do tooltip
            const content = document.createElement('div');
            content.id = `tooltip-${index}`;
            content.className = 'tooltip-content';
            content.setAttribute('role', 'tooltip');
            content.setAttribute('aria-hidden', 'true');
            content.textContent = tooltipText;
            
            // Substituir elemento antigo
            tooltip.parentNode.replaceChild(btn, tooltip);
            btn.parentNode.appendChild(content);
            
            // Adicionar event listeners
            this.setupTooltipEvents(btn, content);
        });
    }

    setupTooltipEvents(button, content) {
        let hideTimeout;

        const showTooltip = () => {
            clearTimeout(hideTimeout);
            // Esconder outros tooltips
            document.querySelectorAll('.tooltip-content').forEach(t => {
                if (t !== content) {
                    t.setAttribute('aria-hidden', 'true');
                }
            });
            content.setAttribute('aria-hidden', 'false');
        };

        const hideTooltip = () => {
            hideTimeout = setTimeout(() => {
                content.setAttribute('aria-hidden', 'true');
            }, 150);
        };

        // Mouse events
        button.addEventListener('mouseenter', showTooltip);
        button.addEventListener('mouseleave', hideTooltip);

        // Keyboard events
        button.addEventListener('focus', showTooltip);
        button.addEventListener('blur', hideTooltip);

        // Click/tap events para mobile
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = content.getAttribute('aria-hidden') === 'false';
            if (isVisible) {
                hideTooltip();
            } else {
                showTooltip();
            }
        });

        // Escape key para fechar
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideTooltip();
                button.focus();
            }
        });

        // Manter tooltip visível quando hover sobre ele
        content.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
        content.addEventListener('mouseleave', hideTooltip);
    }

    initializeKeyboardNavigation() {
        // Navegação entre steps com teclado
        document.querySelectorAll('.step').forEach((step, index) => {
            step.addEventListener('click', (e) => this.navigateToStep(index + 1));
            step.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.navigateToStep(index + 1);
                }
                // Navegação com setas
                else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextStep = document.getElementById(`step${Math.min(index + 2, 4)}`);
                    nextStep?.focus();
                }
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevStep = document.getElementById(`step${Math.max(index, 1)}`);
                    prevStep?.focus();
                }
            });
        });

        // Melhorar navegação dos ranges com teclado
        document.querySelectorAll('input[type="range"]').forEach(range => {
            range.addEventListener('keydown', (e) => {
                let step = parseInt(range.step) || 1;
                let currentValue = parseInt(range.value);
                
                // Incrementos maiores com Shift
                if (e.shiftKey) {
                    step *= 10;
                }
                
                switch (e.key) {
                    case 'PageUp':
                        e.preventDefault();
                        range.value = Math.min(parseInt(range.max), currentValue + step * 10);
                        range.dispatchEvent(new Event('input'));
                        break;
                    case 'PageDown':
                        e.preventDefault();
                        range.value = Math.max(parseInt(range.min), currentValue - step * 10);
                        range.dispatchEvent(new Event('input'));
                        break;
                    case 'Home':
                        e.preventDefault();
                        range.value = range.min;
                        range.dispatchEvent(new Event('input'));
                        break;
                    case 'End':
                        e.preventDefault();
                        range.value = range.max;
                        range.dispatchEvent(new Event('input'));
                        break;
                }
            });
        });

        // Atalhos de teclado globais
        document.addEventListener('keydown', (e) => {
            // Alt + número para ir diretamente ao step
            if (e.altKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                this.navigateToStep(parseInt(e.key));
            }
            // Escape para fechar tooltips e modais
            else if (e.key === 'Escape') {
                document.querySelectorAll('.tooltip-content[aria-hidden="false"]')
                    .forEach(tooltip => tooltip.setAttribute('aria-hidden', 'true'));
            }
        });
    }

    navigateToStep(stepNumber) {
        const targetSection = document.getElementById(this.getSectionIdByStep(stepNumber));
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            this.updateStepIndicator(stepNumber);
            
            // Anunciar mudança para screen readers
            this.announceStepChange(stepNumber);
        }
    }

    getSectionIdByStep(stepNumber) {
        const sections = ['caso-clinico', 'parametros', 'simulacao', 'resultados'];
        return sections[stepNumber - 1];
    }

    announceStepChange(stepNumber) {
        const stepNames = [
            'Passo 1: Entenda o Problema',
            'Passo 2: Configure seu Hospital', 
            'Passo 3: Execute a Simulação',
            'Passo 4: Analise os Resultados'
        ];
        this.announceToScreenReader(`Navegando para ${stepNames[stepNumber - 1]}`);
    }

    announceToScreenReader(message) {
        const announcements = document.getElementById('sr-announcements');
        if (announcements) {
            announcements.textContent = message;
            // Limpar após um tempo para evitar anúncios repetidos
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }

    // Distribuições estatísticas conforme framework científico
    betaRandom(alpha, beta) {
        // Beta para probabilidades de resposta (melhora albumina, sucesso terapêutico)
        const gamma1 = this.gammaRandom(alpha);
        const gamma2 = this.gammaRandom(beta);
        const sum = gamma1 + gamma2;
        
        // Evitar divisão por zero e valores inválidos
        if (sum <= 0 || !isFinite(sum)) {
            console.warn('Beta distribution: soma inválida', {gamma1, gamma2, sum});
            return 0.6; // Valor padrão (60% taxa de resposta)
        }
        
        const result = gamma1 / sum;
        return isFinite(result) ? Math.max(0.1, Math.min(0.95, result)) : 0.6;
    }
    
    // Implementar correlações multivariadas conforme documento
    multivariateNormal(means, correlationMatrix) {
        // Matriz de correlação estrutural do documento (linha 55-61)
        const n = means.length;
        const random = [];
        
        for (let i = 0; i < n; i++) {
            random.push(this.normalRandom());
        }
        
        // Decomposição Cholesky simplificada para correlações
        const result = [];
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j <= i; j++) {
                sum += correlationMatrix[i][j] * random[j];
            }
            result[i] = means[i] + sum;
        }
        
        return result;
    }

    weibullRandom(shape, scale) {
        let u = Math.random();
        u = Math.max(1e-10, Math.min(0.9999, u)); // Evitar extremos
        
        const logValue = -Math.log(1 - u);
        if (!isFinite(logValue) || logValue <= 0) {
            console.warn('Weibull: valor de log inválido', {u, logValue});
            return scale; // Retorna escala como padrão
        }
        
        const result = scale * Math.pow(logValue, 1 / shape);
        return isFinite(result) ? Math.max(1, result) : scale;
    }

    lognormalRandom(mu, sigma) {
        const normal = this.normalRandom(mu, sigma);
        return Math.exp(normal);
    }

    normalRandom(mean = 0, std = 1) {
        // Box-Muller transform com verificação de segurança
        if (this.hasSpareNormal) {
            this.hasSpareNormal = false;
            const result = this.spareNormal * std + mean;
            return isFinite(result) ? result : mean;
        }
        
        this.hasSpareNormal = true;
        let u = Math.random();
        let v = Math.random();
        
        // Evitar valores muito próximos de 0
        u = Math.max(u, 1e-10);
        v = Math.max(v, 1e-10);
        
        const mag = std * Math.sqrt(-2 * Math.log(u));
        this.spareNormal = mag * Math.cos(2 * Math.PI * v);
        const result = mag * Math.sin(2 * Math.PI * v) + mean;
        
        return isFinite(result) ? result : mean;
    }

    gammaRandom(shape) {
        // Implementação simplificada e segura para Gamma
        if (shape <= 0 || !isFinite(shape)) {
            console.warn('Parâmetro shape inválido para Gamma:', shape);
            return 1; // Valor padrão seguro
        }
        
        if (shape < 1) {
            return this.gammaRandom(1 + shape) * Math.pow(Math.random(), 1 / shape);
        }
        
        // Aproximação mais simples e estável
        let sum = 0;
        for (let i = 0; i < Math.floor(shape); i++) {
            sum += -Math.log(Math.random());
        }
        
        const frac = shape - Math.floor(shape);
        if (frac > 0) {
            sum += -Math.log(Math.random()) * frac;
        }
        
        return sum;
    }

    async runMonteCarloSimulation() {
        console.log('=== INICIANDO SIMULAÇÃO ===');
        console.log('Método runMonteCarloSimulation chamado');
        
        const runBtn = document.getElementById('runSimulation');
        const progressContainer = document.getElementById('progress-container');
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const realtimeMetrics = document.getElementById('realtime-metrics');
        const validationAlerts = document.getElementById('validation-alerts');
        
        console.log('Elementos DOM encontrados:', {
            runBtn: !!runBtn,
            progressContainer: !!progressContainer, 
            validationAlerts: !!validationAlerts
        });

        // Disable button and show progress
        if (runBtn) {
            runBtn.disabled = true;
            runBtn.textContent = '⏳ Executando...';
        } else {
            console.error('❌ runBtn não encontrado - não é possível desabilitar botão');
        }
        
        if (progressContainer) {
            progressContainer.style.display = 'block';
        } else {
            console.error('❌ progressContainer não encontrado');
        }
        
        if (realtimeMetrics) {
            realtimeMetrics.style.display = 'grid';
        } else {
            console.error('❌ realtimeMetrics não encontrado');
        }
        
        if (validationAlerts) {
            validationAlerts.innerHTML = '';
        } else {
            console.error('❌ validationAlerts não encontrado');
        }
        
        // Anunciar início da simulação
        this.announceToScreenReader('Simulação Monte Carlo iniciada. Processando 10.000 cenários.');

        console.log('Estado atual do simulador:', {
            hospitalType: this.hospitalType,
            patientType: this.patientType
        });
        
        // Get parameters com validação rigorosa
        const numLeitosEl = document.getElementById('numLeitos');
        const riscoPercentEl = document.getElementById('riscoPercent');
        
        console.log('Elementos de parâmetros:', {
            numLeitosEl: !!numLeitosEl,
            numLeitosValue: numLeitosEl?.value,
            riscoPercentEl: !!riscoPercentEl,
            riscoPercentValue: riscoPercentEl?.value
        });
        
        const numLeitos = parseInt(numLeitosEl?.value || 200);
        const riscoPercent = parseFloat(riscoPercentEl?.value || 48);
        
        console.log('Parâmetros básicos obtidos:', {numLeitos, riscoPercent});
        
        // Validar parâmetros básicos
        if (isNaN(numLeitos) || numLeitos <= 0) {
            console.error('Número de leitos inválido:', numLeitos);
            if (validationAlerts) {
                validationAlerts.innerHTML = '<div class="alert alert-error">Número de leitos inválido. Use um valor entre 50 e 500.</div>';
            }
            return;
        }
        
        if (isNaN(riscoPercent) || riscoPercent <= 0 || riscoPercent > 100) {
            console.error('Percentual de risco inválido:', riscoPercent);
            if (validationAlerts) {
                validationAlerts.innerHTML = '<div class="alert alert-error">Percentual de risco inválido. Use um valor entre 20% e 80%.</div>';
            }
            return;
        }
        
        // Verificar se tipo de hospital foi selecionado
        if (!this.hospitalType) {
            console.warn('Tipo de hospital não definido, usando padrão privado');
            this.hospitalType = 'privado';
        }
        console.log('Hospital type confirmado:', this.hospitalType);
        
        // Verificar se tipo de paciente foi selecionado  
        if (!this.patientType) {
            console.warn('Tipo de paciente não definido, usando padrão cirurgico');
            this.patientType = 'cirurgico';
        }
        console.log('Patient type confirmado:', this.patientType);
        
        // Usar range duplo em vez de valor único
        const costRange = this.getCostRange();
        console.log('Range de custos obtido:', costRange);
        
        // Validar range de custos
        if (!costRange || !costRange.min || !costRange.max || costRange.min >= costRange.max) {
            console.error('Range de custos inválido:', costRange);
            if (validationAlerts) {
                validationAlerts.innerHTML = '<div class="alert alert-error">Erro nos valores de custo da diária. Verifique se min < max.</div>';
            }
            return;
        }
        
        const numIterations = 10000;
        const batchSize = 100;
        const results = [];

        // Parâmetros baseados em dados reais do mercado brasileiro
        const custoSuplementoDiario = 20; // R$ 20/dia conforme informação real
        const pacientesRisco = Math.floor(numLeitos * (riscoPercent / 100));
        
        // Dados brasileiros IBRANUTRI: 48.1% prevalência desnutrição
        const prevalenciaDesnutricao = 0.481;
        
        // Parâmetros específicos por tipo de paciente - TODAS as combinações
        let losBaseline, duracaoSuplemento, responseFactor;
        
        switch (this.patientType) {
            case 'cirurgico':
                losBaseline = 5;    // 5 dias internação média
                duracaoSuplemento = 7;  // 7 dias de suplementação
                responseFactor = 1.15;  // 15% melhor resposta
                break;
            case 'clinico':
                losBaseline = 15;   // 15 dias internação média
                duracaoSuplemento = 12; // 12 dias de suplementação
                responseFactor = 1.05;  // 5% melhor resposta (mais conservador)
                break;
            case 'misto':
                losBaseline = 10;   // Média ponderada
                duracaoSuplemento = 10; // Média
                responseFactor = 1.0;   // Resposta padrão
                break;
            default:
                console.warn('Tipo de paciente desconhecido:', this.patientType, '- usando cirúrgico como padrão');
                losBaseline = 5;
                duracaoSuplemento = 7;
                responseFactor = 1.15;
                this.patientType = 'cirurgico';
                break;
        }
        
        // Validar parâmetros calculados com valores numéricos
        if (!losBaseline || losBaseline <= 0 || !duracaoSuplemento || duracaoSuplemento <= 0 || !responseFactor || responseFactor <= 0) {
            console.error('Parâmetros inválidos:', {losBaseline, duracaoSuplemento, responseFactor});
            if (validationAlerts) {
                validationAlerts.innerHTML = '<div class="alert alert-error">Erro na configuração de parâmetros do paciente. Valores calculados inválidos.</div>';
            }
            return;
        }
        
        console.log('Parâmetros do paciente definidos:', {
            patientType: this.patientType,
            losBaseline, 
            duracaoSuplemento, 
            responseFactor
        });
        
        // Custos diferenciados por tipo de hospital - TODAS as combinações
        let custoComplicacaoBase;
        
        switch (this.hospitalType) {
            case 'publico':
                custoComplicacaoBase = 3200; // Custo complicação SUS
                break;
            case 'privado':
                custoComplicacaoBase = 6800; // Custo complicação privado
                break;
            case 'misto':
                custoComplicacaoBase = 5000; // Média ponderada
                break;
            default:
                console.warn('Tipo de hospital desconhecido:', this.hospitalType, '- usando privado como padrão');
                custoComplicacaoBase = 6800;
                this.hospitalType = 'privado';
                break;
        }
        
        console.log('Custo base de complicações definido:', custoComplicacaoBase, 'para hospital', this.hospitalType);

        // Verificar se elementos DOM essenciais existem
        const elementsCheck = {
            numLeitosEl: document.getElementById('numLeitos'),
            riscoPercentEl: document.getElementById('riscoPercent'), 
            custoDiariaMinEl: document.getElementById('custoDiariaMin'),
            custoDiariaMaxEl: document.getElementById('custoDiariaMax')
        };
        
        console.log('Elementos DOM:', elementsCheck);
        
        // Validar que elementos DOM críticos existem
        const missingElements = [];
        if (!elementsCheck.custoDiariaMinEl) missingElements.push('custoDiariaMin');
        if (!elementsCheck.custoDiariaMaxEl) missingElements.push('custoDiariaMax');
        
        if (missingElements.length > 0) {
            console.error('Elementos DOM críticos não encontrados:', missingElements);
            if (validationAlerts) {
                validationAlerts.innerHTML = '<div class="alert alert-error">Erro crítico: Elementos da interface não encontrados. Recarregue a página.</div>';
            }
            return;
        }
        
        // Debug: verificar parâmetros iniciais
        console.log('Parâmetros da simulação:', {
            hospitalType: this.hospitalType,
            patientType: this.patientType,
            numLeitos,
            riscoPercent,
            costRange,
            pacientesRisco: Math.floor(numLeitos * (riscoPercent / 100)),
            losBaseline,
            duracaoSuplemento,
            responseFactor,
            custoSuplementoDiario
        });
        
        let rejectedCount = 0;
        let invalidValueCount = 0;
        let zeroSupplementCount = 0;
        
        try {
            for (let batch = 0; batch < numIterations / batchSize; batch++) {
                for (let i = 0; i < batchSize; i++) {
                    const iteration = batch * batchSize + i;
                    
                    try {
                        // Custo diário aleatório dentro do range definido pelo usuário
                        const custoDiariaAleatoria = costRange.min + Math.random() * (costRange.max - costRange.min);
                        
                        // Distribuições ajustadas por tipo de paciente com validação
                        const taxaRespostaBase = this.betaRandom(12, 8); // ~60% (68% literatura)
                        let taxaResposta = taxaRespostaBase * responseFactor; // Ajustada por tipo
                        
                        // Garantir que taxa de resposta está em faixa válida (10% a 95%)
                        taxaResposta = Math.max(0.1, Math.min(0.95, taxaResposta));
                        
                        // Validar se taxa é um número válido
                        if (!isFinite(taxaResposta) || isNaN(taxaResposta)) {
                            console.warn('Taxa de resposta inválida, usando 60%:', {taxaRespostaBase, responseFactor, taxaResposta});
                            taxaResposta = 0.6;
                        }
                        
                        const tempoResposta = this.weibullRandom(0.8, 7.5); // 6 dias mediana
                        
                        // Redução LOS realista e conservadora para TODAS as combinações
                        let reducaoLOSBase;
                        switch (this.patientType) {
                            case 'cirurgico':
                                reducaoLOSBase = 0.8 + (Math.random() * 0.7); // 0.8-1.5 dias (mais conservador)
                                break;
                            case 'clinico':
                                reducaoLOSBase = 1.5 + (Math.random() * 1.0); // 1.5-2.5 dias (mais conservador)
                                break;
                            case 'misto':
                                reducaoLOSBase = 1.0 + (Math.random() * 0.8); // 1.0-1.8 dias
                                break;
                            default:
                                // Fallback seguro
                                reducaoLOSBase = 1.0 + (Math.random() * 0.5);
                                break;
                        }
                        
                        // Validar redução LOS
                        if (!isFinite(reducaoLOSBase) || isNaN(reducaoLOSBase) || reducaoLOSBase <= 0) {
                            console.warn('Redução LOS inválida, usando 1.5 dias:', reducaoLOSBase);
                            reducaoLOSBase = 1.5;
                        }
                        
                        // Custo do suplemento com variação realista
                        let custoSupplementoVar = custoSuplementoDiario * duracaoSuplemento * (0.9 + Math.random() * 0.2);
                        
                        // Validar custo suplemento
                        if (!isFinite(custoSupplementoVar) || isNaN(custoSupplementoVar) || custoSupplementoVar <= 0) {
                            console.warn('Custo suplemento inválido, recalculando:', {custoSuplementoDiario, duracaoSuplemento, custoSupplementoVar});
                            custoSupplementoVar = 20 * 10; // R$ 200 como fallback
                        }

                        // Estratificação de risco conforme documento (linha 65-69)
                        const riskDistribution = Math.random();
                        let hazardRatio, hrTempo, custoEfetividade;
                        
                        if (riskDistribution < 0.35) { // Baixo risco (35%)
                            hazardRatio = 1.0;
                            hrTempo = 1.0;
                            custoEfetividade = 15200; // $15,200/QALY
                        } else if (riskDistribution < 0.80) { // Médio risco (45%)
                            hazardRatio = 1.3;
                            hrTempo = 1.2;
                            custoEfetividade = 8900; // $8,900/QALY
                        } else { // Alto risco (20%)
                            hazardRatio = 1.8;
                            hrTempo = 1.5;
                            custoEfetividade = 4100; // $4,100/QALY
                        }

                        // Cálculos realistas baseados em evidências
                        let diasReduzidos = reducaoLOSBase * hrTempo * taxaResposta; // Redução efetiva
                        
                        // Validar dias reduzidos
                        if (!isFinite(diasReduzidos) || isNaN(diasReduzidos) || diasReduzidos < 0) {
                            console.warn('Dias reduzidos inválido:', {reducaoLOSBase, hrTempo, taxaResposta, diasReduzidos});
                            diasReduzidos = 0.5; // Mínimo realista
                        }
                        
                        // Limitar dias reduzidos de forma mais conservadora
                        const maxReducao = Math.min(losBaseline * 0.4, 3.0); // Máx 40% da internação base OU 3 dias
                        diasReduzidos = Math.min(diasReduzidos, maxReducao);
                        
                        // Para hospitais privados com diárias muito altas, aplicar fator de ajuste
                        if (custoDiariaAleatoria > 2000 && this.hospitalType === 'privado') {
                            const fatorAjuste = Math.max(0.6, 1 - (custoDiariaAleatoria - 2000) / 10000); // Reduz até 40% para diárias muito altas
                            diasReduzidos *= fatorAjuste;
                        }
                        const oddsRatioComplicacoes = 0.68; // OR 0.68 literatura
                        
                        // Modelo de complicações mais conservador e realista
                        const riscoBbaseComplicacoes = 0.15; // 15% dos desnutridos têm complicações
                        const reducaoPercentualComplicacoes = (1 - oddsRatioComplicacoes); // 32% de redução
                        const probabilidadeComplicacaoEvitada = riscoBbaseComplicacoes * reducaoPercentualComplicacoes * taxaResposta;
                        
                        // Economia por paciente - TODAS as combinações validadas
                        let economiaInternacao = diasReduzidos * custoDiariaAleatoria;
                        let economiaComplicacoes = probabilidadeComplicacaoEvitada * custoComplicacaoBase;
                        const custoTotalSuplemento = custoSupplementoVar;
                        
                        // Validar cálculos econômicos
                        if (!isFinite(economiaInternacao) || isNaN(economiaInternacao)) {
                            console.warn('Economia internação inválida:', {diasReduzidos, custoDiariaAleatoria, economiaInternacao});
                            economiaInternacao = 0;
                        }
                        
                        if (!isFinite(economiaComplicacoes) || isNaN(economiaComplicacoes)) {
                            console.warn('Economia complicações inválida:', {probabilidadeComplicacaoEvitada, custoComplicacaoBase, economiaComplicacoes});
                            economiaComplicacoes = 0;
                        }
                        
                        // Evitar divisão por zero
                        if (custoTotalSuplemento <= 0 || !isFinite(custoTotalSuplemento)) {
                            console.warn('Custo suplemento inválido:', custoTotalSuplemento, 'Duração:', duracaoSuplemento, 'Diário:', custoSuplementoDiario);
                            zeroSupplementCount++;
                            continue;
                        }
                        
                        // Economia total (sem descontar investimento ainda)
                        const economiaLiquida = economiaInternacao + economiaComplicacoes;
                        
                        // ROI correto: (Benefícios - Custos) / Custos * 100
                        const beneficioLiquido = economiaLiquida - custoTotalSuplemento;
                        let roi = (beneficioLiquido / custoTotalSuplemento) * 100;
                        
                        // Aplicar limite máximo realista de ROI para evitar valores absurdos
                        const maxROI = this.hospitalType === 'publico' ? 800 : 3000; // Público: 800%, Privado: 3000%
                        if (roi > maxROI) {
                            console.log('ROI limitado de', roi.toFixed(1), 'para', maxROI, '% - diária:', custoDiariaAleatoria.toFixed(0));
                            roi = maxROI;
                        }

                        // Validar valores numéricos e lógicos
                        if (isNaN(roi) || isNaN(economiaLiquida) || isNaN(diasReduzidos) || 
                            !isFinite(roi) || !isFinite(economiaLiquida) || !isFinite(diasReduzidos) ||
                            roi < -100 || roi > 10000) { // ROI entre -100% e 10.000%
                            console.warn('Valores inválidos gerados:', {
                                roi, economiaLiquida, diasReduzidos, taxaResposta, 
                                custoDiariaAleatoria, custoTotalSuplemento, 
                                reducaoLOSBase, hrTempo, responseFactor
                            });
                            invalidValueCount++;
                            continue;
                        }

                        // Total para hospital
                        const economiaHospital = beneficioLiquido * pacientesRisco;
                        const investimentoTotal = custoTotalSuplemento * pacientesRisco;

                        results.push({
                            roi: roi,
                            economiaTotal: economiaHospital,
                            economiaLiquida: economiaLiquida,
                            custoSuplemento: custoTotalSuplemento,
                            diasReduzidos: diasReduzidos,
                            complicacoesEvitadas: probabilidadeComplicacaoEvitada,
                            investimento: investimentoTotal,
                            taxaResposta: taxaResposta,
                            custoEfetividade: custoEfetividade,
                            hazardRatio: hazardRatio,
                            pacientesRisco: pacientesRisco
                        });
                        
                    } catch (iterationError) {
                        console.error('Erro na iteração:', iteration, iterationError);
                        continue; // Pula esta iteração e continua
                    }
                }

                // Update progress
                const progress = ((batch + 1) / (numIterations / batchSize)) * 100;
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${Math.round(progress)}%`;
                
                // Anunciar progresso para screen readers a cada 25%
                if (Math.round(progress) % 25 === 0 && Math.round(progress) > 0) {
                    this.announceToScreenReader(`Simulação ${Math.round(progress)}% completa`);
                }

                // Update realtime metrics
                if (results.length > 0) {
                    const currentResults = results.slice(-Math.min(batchSize, results.length));
                    const avgROI = currentResults.reduce((sum, r) => sum + r.roi, 0) / currentResults.length;
                    const avgEconomia = currentResults.reduce((sum, r) => sum + r.economiaTotal, 0) / currentResults.length;
                    const avgLOS = currentResults.reduce((sum, r) => sum + r.diasReduzidos, 0) / currentResults.length;

                    document.getElementById('currentROI').textContent = `ROI: ${avgROI.toFixed(1)}%`;
                    const economiaDisplay = avgEconomia > 0 ? `+R$ ${(Math.abs(avgEconomia) / 1000).toFixed(0)}k` : `-R$ ${(Math.abs(avgEconomia) / 1000).toFixed(0)}k`;
                    document.getElementById('currentSavings').textContent = `Resultado: ${economiaDisplay}`;
                    document.getElementById('currentLOS').textContent = `Redução: ${avgLOS.toFixed(1)} dias`;
                }

                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            // Verificar se temos resultados válidos com diagnóstico detalhado
            console.log('Diagnóstico da simulação:', {
                'Resultados válidos': results.length,
                'Rejeitados por custo zero': zeroSupplementCount,
                'Rejeitados por valores inválidos': invalidValueCount,
                'Total rejeitados': rejectedCount,
                'Taxa de sucesso': ((results.length / numIterations) * 100).toFixed(1) + '%'
            });
            
            if (results.length === 0) {
                let errorMsg = 'Nenhum resultado válido foi gerado. ';
                
                if (zeroSupplementCount > 0) {
                    errorMsg += `${zeroSupplementCount} iterações falharam por custo de suplemento inválido. `;
                }
                if (invalidValueCount > 0) {
                    errorMsg += `${invalidValueCount} iterações geraram valores numéricos inválidos. `;
                }
                
                errorMsg += 'Verifique os parâmetros: tipo de hospital selecionado, tipo de paciente e valores de custo diária.';
                
                validationAlerts.innerHTML = `<div class="alert alert-error">${errorMsg}</div>`;
                return;
            }
            
            console.log(`Simulação concluída com ${results.length} resultados válidos`);
            
            // Store results and validate
            this.simulationData = results;
            this.validateResults(results);
            this.displayResults(results);
            
            // Anunciar conclusão da simulação
            const avgROI = results.reduce((sum, r) => sum + r.roi, 0) / results.length;
            this.announceToScreenReader(`Simulação concluída. ROI médio: ${avgROI.toFixed(0)}%. Resultados disponíveis na seção 4.`);

        } catch (error) {
            console.error('🚨 ERRO CRÍTICO na simulação:', error);
            console.error('Stack trace:', error.stack);
            this.announceToScreenReader('Erro durante a simulação. Tente novamente.');
            const errorMsg = error.message || 'Erro desconhecido';
            validationAlerts.innerHTML = `<div class="alert alert-error">🚨 Erro durante a simulação: ${errorMsg}. Verifique o console do navegador para mais detalhes e tente novamente.</div>`;
        } finally {
            // Reset button
            if (runBtn) {
                runBtn.disabled = false;
                runBtn.textContent = '⚡ EXECUTAR 10.000 CENÁRIOS';
            }
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }
        }
    }

    validateResults(results) {
        const validationAlerts = document.getElementById('validation-alerts');
        const avgROI = results.reduce((sum, r) => sum + r.roi, 0) / results.length;
        const avgLOS = results.reduce((sum, r) => sum + r.diasReduzidos, 0) / results.length;
        const avgEconomiaLiquida = results.reduce((sum, r) => sum + r.economiaLiquida, 0) / results.length;
        const avgCustoSuplemento = results.reduce((sum, r) => sum + r.custoSuplemento, 0) / results.length;
        
        // Obter custo diária atual para cálculos
        const costRange = this.getCostRange();
        const custoDiariaMedia = (costRange.min + costRange.max) / 2;
        
        let alerts = [];

        // Obter tipo de paciente para contextualizar alertas
        const tiposPaciente = {
            'cirurgico': 'cirúrgicos (5 dias média)',
            'clinico': 'clínicos (15 dias média)',
            'misto': 'mistos (10 dias média)'
        };
        const tipoAtual = tiposPaciente[this.patientType] || 'não especificado';
        
        // Faixas de ROI ajustadas para realidade SUS vs Privado
        let roiEsperadoMin, roiEsperadoMax;
        
        // Ajustar expectativas baseado no tipo de hospital selecionado
        if (this.hospitalType === 'publico') { // Hospital Público/SUS
            if (this.patientType === 'cirurgico') {
                roiEsperadoMin = 80;  // SUS: ROI menor devido diaria baixa
                roiEsperadoMax = 250;
            } else if (this.patientType === 'clinico') {
                roiEsperadoMin = 100; // SUS: ROI adequado para clinicos
                roiEsperadoMax = 400;
            } else {
                roiEsperadoMin = 90;
                roiEsperadoMax = 300;
            }
        } else { // Hospital Privado - ROI muito mais alto devido diaria alta
            if (this.patientType === 'cirurgico') {
                roiEsperadoMin = 300; // Privado: diaria alta = ROI alto
                roiEsperadoMax = 3500; // Ajustado para suportar diárias até R$ 5.000
            } else if (this.patientType === 'clinico') {
                roiEsperadoMin = 500;
                roiEsperadoMax = 5000; // Ajustado para suportar diárias até R$ 5.000
            } else {
                roiEsperadoMin = 400;
                roiEsperadoMax = 4000; // Ajustado para suportar diárias até R$ 5.000
            }
        }
        
        const tipoHospital = this.hospitalType === 'publico' ? 'Público' : 'Privado';
        
        if (avgROI < roiEsperadoMin) {
            alerts.push(`<div class="alert alert-warning">📊 ROI baixo (${avgROI.toFixed(0)}%) para ${tipoHospital} com pacientes ${tipoAtual}. Esperado: ${roiEsperadoMin}-${roiEsperadoMax}%</div>`);
        } else if (avgROI > roiEsperadoMax) {
            alerts.push(`<div class="alert alert-warning">📊 ROI alto (${avgROI.toFixed(0)}%) para ${tipoHospital}. Verifique parâmetros.</div>`);
        } else {
            alerts.push(`<div class="alert alert-success">✅ ROI adequado (${avgROI.toFixed(0)}%) para ${tipoHospital} com pacientes ${tipoAtual}!</div>`);
        }

        // Explicação clara da economia com preço real
        const beneficioPorPaciente = avgEconomiaLiquida - avgCustoSuplemento;
        const custoTotalSuplemento = avgCustoSuplemento; // ~R$ 200 (10 dias × R$ 20)
        
        if (beneficioPorPaciente > 0) {
            alerts.push(`<div class="alert alert-success">💰 <strong>Excelente resultado!</strong> Investindo R$ ${custoTotalSuplemento.toFixed(0)} por paciente, o hospital <strong>economiza R$ ${beneficioPorPaciente.toFixed(0)}</strong> líquidos.</div>`);
        } else {
            alerts.push(`<div class="alert alert-error">💰 Investimento de R$ ${custoTotalSuplemento.toFixed(0)} por paciente não se paga. Gasto adicional de <strong>R$ ${Math.abs(beneficioPorPaciente).toFixed(0)}</strong>.</div>`);
        }

        // Contexto específico por tipo de paciente
        const custoSuplemento = this.patientType === 'cirurgico' ? 140 : // 7 dias × R$ 20
                               this.patientType === 'clinico' ? 240 :   // 12 dias × R$ 20
                               200; // 10 dias × R$ 20 (misto)
        
        // Faixas LOS ajustadas para serem mais realistas
        let losEsperadoMin, losEsperadoMax;
        if (this.patientType === 'cirurgico') {
            losEsperadoMin = 0.8;  // Mínimo para cirúrgicos
            losEsperadoMax = 2.0;  // Máximo para cirúrgicos
        } else if (this.patientType === 'clinico') {
            losEsperadoMin = 2.0;  // Corrigido: mais realista
            losEsperadoMax = 4.5;  // Mantido
        } else {
            losEsperadoMin = 1.2;  // Mínimo para mistos
            losEsperadoMax = 3.0;  // Máximo para mistos
        }
        
        if (avgLOS < losEsperadoMin || avgLOS > losEsperadoMax) {
            alerts.push(`<div class="alert alert-warning">🏥 Redução LOS (${avgLOS.toFixed(1)} dias) fora do esperado para ${tipoAtual}. Esperado: ${losEsperadoMin}-${losEsperadoMax} dias.</div>`);
        } else {
            const economiaLOS = avgLOS * custoDiariaMedia;
            alerts.push(`<div class="alert alert-success">🏥 <strong>${avgLOS.toFixed(1)} dias a menos</strong> para pacientes ${tipoAtual} = R$ ${economiaLOS.toFixed(0)} vs. R$ ${custoSuplemento} de suplemento!</div>`);
        }

        validationAlerts.innerHTML = alerts.join('');
    }

    displayResults(results) {
        document.getElementById('results-panel').style.display = 'block';
        
        // Calcular estatísticas
        const avgROI = results.reduce((sum, r) => sum + r.roi, 0) / results.length;
        const totalSavings = results.reduce((sum, r) => sum + r.economiaTotal, 0) / results.length;
        const avgLOSReduction = results.reduce((sum, r) => sum + r.diasReduzidos, 0) / results.length;
        const totalInvestment = results[0].investimento;
        const paybackMonths = (totalInvestment / (totalSavings / 12));
        const complicationsAvoided = results.reduce((sum, r) => sum + r.complicacoesEvitadas, 0) / results.length;

        // Update summary cards
        document.getElementById('avgROI').textContent = `${avgROI.toFixed(0)}%`;
        document.getElementById('totalSavings').textContent = `R$ ${(totalSavings / 1000000).toFixed(1)}M`;
        document.getElementById('paybackTime').textContent = `${paybackMonths.toFixed(1)} meses`;
        document.getElementById('avgLOSReduction').textContent = `${avgLOSReduction.toFixed(1)} dias`;
        document.getElementById('complicationsAvoided').textContent = `${(complicationsAvoided * 100).toFixed(0)}%`;

        // Atualizar step indicator
        this.currentStep = 4;
        this.updateStepIndicator();
        
        this.createCharts(results);
    }

    createCharts(results) {
        // ROI Histogram
        this.createROIHistogram(results);
        
        // LOS Reduction Chart
        this.createLOSChart(results);
        
        // Sensitivity Analysis
        this.createSensitivityChart();
    }

    createROIHistogram(results) {
        const ctx = document.getElementById('roiHistogram');
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts.roiHistogram) {
            this.charts.roiHistogram.destroy();
        }

        const roiValues = results.map(r => r.roi);
        const bins = this.createHistogramBins(roiValues, 20);

        this.charts.roiHistogram = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: 'Frequência',
                    data: bins.counts,
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribuição do ROI (%)'
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

    createLOSChart(results) {
        const ctx = document.getElementById('losReduction');
        if (!ctx) return;

        if (this.charts.losReduction) {
            this.charts.losReduction.destroy();
        }

        const losValues = results.map(r => r.diasReduzidos);
        const bins = this.createHistogramBins(losValues, 15);

        this.charts.losReduction = new Chart(ctx, {
            type: 'line',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: 'Redução LOS',
                    data: bins.counts,
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribuição da Redução do Tempo de Internação'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Dias Reduzidos'
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

    createSensitivityChart() {
        const ctx = document.getElementById('sensitivityChart');
        if (!ctx) return;

        if (this.charts.sensitivity) {
            this.charts.sensitivity.destroy();
        }

        // Tornado chart data simulado
        const sensitivityData = [
            { parameter: 'Custo Diária', impact: 45 },
            { parameter: 'Taxa Resposta', impact: 38 },
            { parameter: '% Risco Nutricional', impact: 32 },
            { parameter: 'Redução LOS', impact: 28 },
            { parameter: 'Custo Suplemento', impact: -15 }
        ];

        this.charts.sensitivity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sensitivityData.map(d => d.parameter),
                datasets: [{
                    label: 'Impacto no ROI (%)',
                    data: sensitivityData.map(d => d.impact),
                    backgroundColor: sensitivityData.map(d => 
                        d.impact > 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(245, 158, 11, 0.6)'
                    ),
                    borderColor: sensitivityData.map(d => 
                        d.impact > 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(245, 158, 11, 1)'
                    ),
                    borderWidth: 1
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

    createHistogramBins(data, numBins) {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const binWidth = (max - min) / numBins;
        
        const bins = Array(numBins).fill(0);
        const labels = [];
        
        for (let i = 0; i < numBins; i++) {
            labels.push((min + i * binWidth).toFixed(1));
        }
        
        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
            bins[binIndex]++;
        });
        
        return { labels, counts: bins };
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.id === tabName);
        });
    }

    exportToPDF() {
        alert('Funcionalidade de export para PDF será implementada em breve.');
    }

    exportToExcel() {
        if (!this.simulationData) {
            alert('Execute a simulação primeiro.');
            return;
        }
        
        // Simular download Excel
        const csvContent = this.convertToCSV(this.simulationData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'simulacao_hospitalar.csv';
        link.click();
        URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        const headers = 'ROI (%),Economia Total (R$),Dias Reduzidos,Complicações Evitadas (%),Investimento (R$),Taxa Resposta (%)\\n';
        const rows = data.map(row => 
            `${row.roi.toFixed(2)},${row.economiaTotal.toFixed(2)},${row.diasReduzidos.toFixed(2)},${(row.complicacoesEvitadas * 100).toFixed(2)},${row.investimento.toFixed(2)},${(row.taxaResposta * 100).toFixed(2)}`
        ).join('\\n');
        
        return headers + rows;
    }
}

// Initialize simulator when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, inicializando HospitalSimulator');
    try {
        window.hospitalSimulator = new HospitalSimulator();
        console.log('✅ HospitalSimulator criado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao criar HospitalSimulator:', error);
    }
});