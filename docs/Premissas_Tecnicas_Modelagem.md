# Manual de Premissas Técnicas e Parâmetros do Modelo TNO

**Destinatário:** Equipe de Nutrição Técnica e Gestão de Produto
**Propósito:** Detalhar as variáveis e constantes assumidas no algoritmo do Simulador TNO (Módulo Público) para validação e solicitação de ajustes.

---

## 1. Introdução

O Simulador TNO utiliza um modelo determinístico para calcular o impacto econômico e clínico da Terapia Nutricional Oral. Este modelo baseia-se em perfis pré-configurados ("Hospitais" e "Pacientes") que alimentam o algoritmo.

> **Nota:** Todos os valores abaixo são padrões do sistema (*defaults*). O "Simulador Técnico" permite a sobreposição manual de todas essas variáveis.

---

## 2. Perfis de Estabelecimento (Hospitais)

O tipo de hospital selecionado define os custos basais utilizados no cálculo de ROI (Return on Investment).

| Perfil | Custo Diário do Leito (R$) | Custo por Complicação (R$) | Descrição |
| :--- | :--- | :--- | :--- |
| **Público / SUS** | R$ 380,00 | R$ 1.500,00 | Foco em custo-efetividade e atendimento universal. |
| **Privado** | R$ 1.200,00 | R$ 5.000,00 | Convênios e particulares; custos operacionais mais elevados. |
| **Misto** | R$ 600,00 | R$ 3.000,00 | Média ponderada entre atendimento público e privado. |

*Fonte: `src/context/SimulatorContext.tsx`*

---

## 3. Perfis Base de Pacientes

O perfil do paciente define a "linha de base" (o que acontece *sem* intervenção) e o "potencial de resposta" à terapia.

| Variável | Cirúrgico | Clínico | Misto | Definição |
| :--- | :--- | :--- | :--- | :--- |
| **Tempo de Internação (Base)** | 6 dias | 14 dias | 10 dias | Média de dias no hospital sem uso de TNO. |
| **Taxa de Complicações (Base)** | 28% | 35% | 30% | Probabilidade de evento adverso sem TNO. |
| **Fator Redução Complicações (Teto)** | **45%** | **35%** | **40%** | Redução máxima teórica no número de complicações. |
| **Fator Redução Internação (Teto)** | **30%** | **25%** | **28%** | Redução máxima teórica nos dias de leito. |

### ⚠️ Importante: Lógica dos "Tetos de Redução"

Os valores de **Fator Redução** na tabela acima representam o **cenário perfeito** (100% de Eficácia TNO e 100% de Adesão). O resultado real exibido ao usuário é calculado pela fórmula:

$$
\text{Redução Real} = (\text{Eficácia Input} \times \text{Adesão Input}) \times \text{Fator Teto}
$$

*Exemplo: Se o usuário define Eficácia de 80% e Adesão de 90% para um paciente Cirúrgico (Fator Teto 30%):*
`0.80 * 0.90 * 0.30 = 0.216` -> **21,6% de redução real no tempo de internação.**

---

## 4. Configurações Padrão de Inicialização

Ao abrir o simulador pela primeira vez, estes são os valores carregados:

| Parâmetro | Valor Padrão | Intervalo Permitido (Slider) |
| :--- | :--- | :--- |
| **População** | 10.000 pacientes | 1.000 - 50.000 |
| **Eficácia TNO** | 75% | 30% - 95% |
| **Adesão** | 80% | 40% - 95% |
| **Custo TNO** | R$ 15,00 / dia | R$ 5,00 - R$ 50,00 |

As referências bibliográficas para estes parâmetros (ex: Philipson et al., 2013 para eficácia) estão visíveis na interface via *tooltips*.

---

## 5. Como Solicitar Alterações

Caso a equipe técnica identifique que alguma premissa (especialmente os Fatores Teto ou Custos Basais) está desatualizada frente à nova literatura ou realidade de mercado:

1. Abra um chamado referenciando este documento.
2. Especifique qual **Perfil** e qual **Variável** deve ser alterada.
3. Forneça o novo valor desejado.

*Exemplo: "Alterar o custo diário do Hospital Público de R$ 380 para R$ 450."*
