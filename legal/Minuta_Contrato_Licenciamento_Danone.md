# Proposta de Valor e Estrutura Comercial - Simulador TNO

## 1. Introdução

Esta proposta consolida as visões Técnica (Gerência de Projetos) e Legal/Comercial para o licenciamento da plataforma **Simulador TNO** à Danone. O objetivo é demonstrar não apenas o custo, mas o valor estratégico, a segurança jurídica e a viabilidade técnica da solução.

---

## 2. Perspectiva do Gerente de Projetos: Proposta de Valor

**"Não é apenas uma calculadora, é uma ferramenta de habilitação de vendas e autoridade científica."**

### O Que Estão Comprando?

1. **Dualidade Estratégica (Público + Técnico):**
    * *Módulo Público:* Focado em gestores e licitações. Argumento financeiro robusto para justificar a escolha da Danone em compras públicas.
    * *Módulo Técnico:* Focado em nutricionistas e clínicos. Argumento clínico/científico para adesão ao tratamento.
2. **Experiência do Usuário (UX) Premium:**
    * Interface moderna ("Glassmorphism"), responsiva e alinhada à identidade visual da Danone.
    * Interatividade em tempo real (mudou o parâmetro, o gráfico reage) gera engajamento nas visitas médicas.
3. **Auditoria e Precisão:**
    * Lógica de cálculo validada (Farmacoeconomia).
    * Isenção de erros comuns em planilhas de Excel não controladas.

### Cronograma de Entregas (Setup)

A taxa de setup cobre o esforço de personalização e modernização:

* **Fase 1 (Concluída):** Auditoria lógica e saneamento do "core" matemático.
* **Fase 2 (Em Andamento):** Integração dos simuladores, modernização da UI/UX, implementação de persistência de dados (Firebase).
* **Fase 3 (Entrega):** Testes de carga, validação final e deploy em infraestrutura segura.

---

## 3. Perspectiva Jurídica: Proteção e Conformidade

**"Segurança para a Danone, Proteção para o Desenvolvedor."**

### Modelo SaaS Gerenciado (Software as a Service)

* **Por que isso protege a Danone?** A Danone não assume o passivo técnico. Não precisa alocar TI interna para manter servidores, atualizar patches de segurança ou gerenciar backups. O SLA garante que "simplesmente funciona".
* **LGPD (Blindagem):** A Danone entra como Controladora dos dados, mas o Desenvolvedor atua como Operador qualificado, garantindo criptografia e "Privacy by Design". Isso mitiga riscos de vazamento de dados sensíveis de pacientes.

### Propriedade Intelectual e Exclusividade

* **Exclusividade Temporária (12 meses):** Garante que esta ferramenta específica de vendas (com esta lógica agressiva de custo-efetividade) seja uma vantagem competitiva única da Danone no curto/médio prazo.
* **Retenção do Código-Fonte (IP):** O contrato licença o *uso*, não a *propriedade* do código. Isso permite que o custo seja uma fração do desenvolvimento de um software proprietário do zero (que custaria facilmente >R$ 200k + manutenção).

---

## 4. Proposta Financeira e Forma de Desembolso

Baseado nos valores da Minuta (`setup: 30k`, `anual: 50k`, `mensal: 3.5k`), sugerimos a seguinte estrutura de desembolso para mitigar risco e garantir fluxo de caixa:

### 4.1. Taxa de Setup (Implantação): R$ 30.000,00

Justificativa: Cobre as horas de desenvolvimento de "Customização High-End" e integração.
**Fluxo de Pagamento Sugerido:**

1. **Entrada (40%):** R$ 12.000,00 na assinatura do contrato. (Garante compromisso e inicia Fase 2).
2. **Entrega Beta (30%):** R$ 9.000,00 na aprovação da versão de homologação.
3. **Go-Live (30%):** R$ 9.000,00 no lançamento oficial para a força de vendas.

### 4.2. Licença Anual de Uso (SaaS): R$ 50.000,00/ano

Justificativa: Direito de uso da PI, exclusividade de mercado por 12 meses e infraestrutura de alta disponibilidade.
**Fluxo de Pagamento:**

* Pagamento Integral (Net 30 após Go-Live) ou Parcelado em 2x (Semestral), a depender do budget de Capex vs Opex da Danone. *Sugerimos tentar antecipar para o Go-Live.*

### 4.3. Sustentação Técnica (Fee Mensal): R$ 3.500,00/mês

Justificativa: "Seguro" contra indisponibilidade, atualizações de segurança e monitoramento de banco de dados.
**Fluxo de Pagamento:**

* Faturamento mensal recorrente (Boleta/NF), iniciando 30 dias após o Go-Live.

---

## 5. Considerações Finais e Próximos Passos

* **Validar o Orçamento:** A Danone possui budget de Marketing (verba de propaganda) ou Trade? O modelo SaaS facilita (Opex), enquanto Setup pode entrar como projeto pontual.
* **Aprovação da Minuta:** Enviar a Minuta de Contrato revisada junto com este racional de valor.

---
---

# MINUTA DE CONTRATO DE LICENCIAMENTO DE USO DE SOFTWARE (SaaS)

**PARTES:**

* **LICENCIANTE:** [Seu Nome/Sua Empresa], desenvolvedora da plataforma "Simulador TNO".
* **LICENCIADA:** DANONE LTDA (Divisão de Nutrição Especializada).

---

## 1. DO OBJETO

1.1. O presente contrato tem por objeto o licenciamento do direito de uso (SaaS) dos softwares "Simulador TNO - Módulo Público" e "Simulador TNO - Módulo Técnico".
1.2. A LICENCIANTE mantém a plena e exclusiva propriedade intelectual sobre o código-fonte, algoritmos de cálculo, design de interface e estrutura de dados ("Blueprint").

## 2. DA HOSPEDAGEM E INFRAESTRUTURA (CLAÚSULA CRÍTICA)

2.1. **Modelo SaaS Gerenciado:** O software ficará hospedado em infraestrutura em nuvem (Ex: Vercel/AWS) gerenciada EXCLUSIVAMENTE pela LICENCIANTE.
2.2. **Segurança da PI:** A LICENCIADA **não terá acesso ao código-fonte** ou aos arquivos de build do servidor, apenas ao painel administrativo e front-end via navegador.

2.3. **Custos de Nuvem:**
    ***Opção A (Incluso):** Os custos de servidor estão inclusos na mensalidade de manutenção até o limite de X acessos/mês.
    *   **Opção B (Repasse):** Custos excedentes de tráfego/armazenamento serão faturados à parte.
2.4. **Dados:** A LICENCIADA é proprietária dos DADOS gerados pelos seus usuários (pacientes/médicos), e a LICENCIANTE atua como operadora desses dados conforme a LGPD.
2.5. **Inteligência de Dados:** A LICENCIANTE poderá utilizar dados anonimizados e agregados para fins estatísticos e de aprimoramento da plataforma ("Inteligência Agregada"), sem identificar a LICENCIADA ou seus usuários finais.

## 3. VALORES E PAGAMENTOS

3.1. **Taxa de Setup (Implantação/Redesign):** R$ 30.000,00 (Pagamento Único).
3.2. **Licença Anual de Uso:** R$ 50.000,00 (Renovável anualmente).
3.3. **Sustentação Técnica (Mensal):** R$ 3.500,00/mês.
    *Inclui: Monitoramento de uptime, correção de bugs e atualizações de segurança.
    *   Não inclui: Desenvolvimento de novas funcionalidades (serão orçadas à parte).
3.4. **Reajuste:** Os valores estipulados neste contrato serão reajustados anualmente pela variação positiva do IPCA/IBGE acumulado no período.

## 4. DA EXCLUSIVIDADE

4.1. A LICENCIANTE concede exclusividade de uso da **Lógica de Farmacoeconomia TNO** para o mercado de **Nutrição Clínica no Brasil** pelo período de 12 meses.
4.2. Após este período, ou em caso de não renovação, a LICENCIANTE fica livre para comercializar a solução para outros players.

## 5. NÍVEL DE SERVIÇO (SLA)

5.1. **Disponibilidade:** A LICENCIANTE garante disponibilidade de 99,0% ao mês.
5.2. **Suporte:** Atendimento a chamados críticos em até 24h úteis.
5.3. **Penalidades (SLA):** O descumprimento da meta de disponibilidade (99,0%) garantirá à LICENCIADA um desconto de 5% na mensalidade do mês subsequente para cada 1% abaixo da meta, limitado a 50% do valor mensal.

## 6. DA CONFIDENCIALIDADE

6.1. As partes comprometem-se a manter o mais absoluto sigilo sobre quaisquer dados, informações técnicas, comerciais ou estratégicas a que tiverem acesso em razão deste contrato ("Informações Confidenciais").
6.2. Esta obrigação de confidencialidade perdurará pela vigência deste contrato e por um período de 5 (cinco) anos após o seu encerramento.

## 7. DA LIMITAÇÃO DE RESPONSABILIDADE

7.1. Em nenhuma hipótese a LICENCIANTE será responsável por danos indiretos, incidentais, especiais, punitivos ou lucros cessantes.
7.2. A responsabilidade total da LICENCIANTE por quaisquer danos relacionados a este contrato, seja por contrato, ato ilícito ou qualquer outra teoria legal, limita-se ao valor efetivamente pago pela LICENCIADA nos 12 (doze) meses anteriores ao evento gerador do dano.

## 8. DA VIGÊNCIA E RESCISÃO

8.1. **Vigência:** O presente contrato entra em vigor na data de sua assinatura e terá validade de 12 (doze) meses, sendo renovado automaticamente por iguais períodos, salvo manifestação em contrário.
8.2. **Rescisão Imotivada:** Qualquer das partes poderá rescindir este contrato mediante aviso prévio por escrito de 60 (sessenta) dias.
    *Em caso de rescisão antecipada por parte da LICENCIADA antes do término do período anual vigente, será devida uma multa equivalente a 50% do valor das parcelas mensais restantes.
    *   A Taxa de Setup (Cláusula 3.1) não é reembolsável em nenhuma hipótese.
8.3. **Rescisão Motivada:** O contrato poderá ser rescindido imediatamente em caso de violação de suas cláusulas, falência ou recuperação judicial de qualquer das partes.

## 9. DO FORO

9.1. Fica eleito o Foro da Comarca da Capital do Estado da LICENCIANTE para dirimir quaisquer dúvidas ou litígios oriundos deste contrato, com renúncia a qualquer outro, por mais privilegiado que seja.

---

# ANEXO I: ESPECIFICAÇÃO DE INFRAESTRUTURA

Para garantir a performance, escalabilidade e segurança do **Simulador TNO**, a solução será hospedada e executada utilizando a seguinte arquitetura tecnológica de ponta:

## 1. Front-end e Aplicação (Compute)

* **Framework:** Next.js 15 (React).
* **Hospedagem (Cloud):** Vercel ou AWS (Amazon Web Services).
* **Arquitetura:** Serverless / Edge Functions para menor latência global.
* **CDN (Content Delivery Network):** Distribuição global de ativos estáticos para carregamento rápido em qualquer região do Brasil.

## 2. Banco de Dados e Backend

* **Provedor:** Google Firebase.
* **Banco de Dados:** Firestore (NoSQL, escalabilidade automática e tempo real).
* **Autenticação:** Firebase Auth (Gestão segura de identidades e acessos).
* **Storage:** Firebase Storage (Armazenamento seguro de mídias e documentos, se aplicável).

## 3. Integrações e APIs

* A comunicação entre o front-end e o banco de dados é criptografada via HTTPS (SSL/TLS).

---

# ANEXO II: POLÍTICA DE BACKUP, SEGURANÇA E PRIVACIDADE

## 1. Segurança da Informação

* **Criptografia em Trânsito:** Todo o tráfego de dados entre o navegador do usuário e os servidores é protegido por criptografia TLS 1.2 ou superior (HTTPS).
* **Criptografia em Repouso:** Os dados armazenados no banco de dados (Firestore) são criptografados pelo provedor (Google Cloud Platform).
* **Controle de Acesso:** O acesso administrativo ao banco de dados é restrito à equipe técnica da LICENCIANTE, protegido por autenticação de dois fatores (2FA).

## 2. Política de Backup

* **Frequência:** Backups automáticos diários dos dados críticos.
* **Retenção:** Os backups são mantidos por um período de 30 dias (Rolling Window).
* **Disaster Recovery:** Procedure de restauração testado para garantir a recuperação dos dados em caso de falha catastrófica do serviço de nuvem.

## 3. Privacidade e LGPD

* **Minimização de Dados:** O sistema coleta apenas os dados estritamente necessários para a realização dos cálculos e simulações.
* **Direitos dos Titulares:** A plataforma possui mecanismos (ou a LICENCIANTE proverá suporte manual) para atender a requisições de exclusão ou exportação de dados solicitados pela LICENCIADA em nome de seus usuários finais.

---

# ANEXO III: MANUAL DE PREMISSAS TÉCNICAS E PARÂMETROS DO MODELO TNO

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
