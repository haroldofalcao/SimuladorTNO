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

## 3. VALORES E PAGAMENTOS

3.1. **Taxa de Setup (Implantação/Redesign):** R$ 30.000,00 (Pagamento Único).
3.2. **Licença Anual de Uso:** R$ 50.000,00 (Renovável anualmente).
3.3. **Sustentação Técnica (Mensal):** R$ 3.500,00/mês.
    *Inclui: Monitoramento de uptime, correção de bugs e atualizações de segurança.
    *   Não inclui: Desenvolvimento de novas funcionalidades (serão orçadas à parte).

## 4. DA EXCLUSIVIDADE

4.1. A LICENCIANTE concede exclusividade de uso da **Lógica de Farmacoeconomia TNO** para o mercado de **Nutrição Clínica no Brasil** pelo período de 12 meses.
4.2. Após este período, ou em caso de não renovação, a LICENCIANTE fica livre para comercializar a solução para outros players.

## 5. NÍVEL DE SERVIÇO (SLA)

5.1. **Disponibilidade:** A LICENCIANTE garante disponibilidade de 99,0% ao mês.
5.2. **Suporte:** Atendimento a chamados críticos em até 24h úteis.

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
