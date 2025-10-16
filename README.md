# NutriPath Analyzer - Simulador TNO

Simulador didático de Terapia Nutricional Oral para profissionais de saúde. Este projeto foi migrado para Next.js 15 com Tailwind CSS 4.

## 🚀 Tecnologias

- **Next.js 15.5.5** - Framework React com Turbopack
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Chart.js** - Gráficos interativos
- **Firebase** - Analytics e backend
- **Biome** - Linter e formatador

## 📁 Estrutura do Projeto

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout raiz com providers
│   │   ├── page.tsx         # Página principal
│   │   └── globals.css      # Estilos globais
│   ├── components/
│   │   ├── Header.tsx       # Cabeçalho com progresso
│   │   ├── NavigationButtons.tsx
│   │   └── sections/
│   │       ├── Introducao.tsx
│   │       ├── Solucao.tsx
│   │       ├── ConfiguracaoHospital.tsx
│   │       ├── ParametrosPersonalizaveis.tsx
│   │       ├── Simulacao.tsx
│   │       └── Referencias.tsx
│   ├── context/
│   │   └── SimulatorContext.tsx  # Estado global da aplicação
│   ├── lib/
│   │   └── firebase.ts      # Configuração do Firebase
│   └── types/
│       └── index.ts         # Tipos TypeScript
├── public/                  # Arquivos estáticos
├── package.json
└── tsconfig.json
```

## 🛠️ Instalação

```bash
# Entre na pasta do projeto
cd my-app

# Instale as dependências
bun install
# ou
npm install
```

## 🎯 Comandos

```bash
# Desenvolvimento
bun dev
# ou
npm run dev

# Build para produção
bun run build
# ou
npm run build

# Iniciar servidor de produção
bun start
# ou
npm start

# Linter
bun run lint
# ou
npm run lint

# Formatação
bun run format
# ou
npm run format
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver o resultado.

## 🎨 Características Principais

### 1. **Navegação por Seções**
- 6 seções educacionais sobre TNO
- Indicador de progresso visual
- Navegação sequencial

### 2. **Configuração Personalizada**
- Seleção de tipo de hospital (Público/Privado/Misto)
- Perfil de pacientes (Cirúrgico/Clínico/Misto)
- Parâmetros ajustáveis (população, eficácia, adesão, custos)

### 3. **Simulação Interativa**
- Simulação Monte Carlo de pacientes virtuais
- Comparação de cenários COM e SEM TNO
- Cálculo de ROI e economia

### 4. **Visualização de Dados**
- Gráficos interativos com Chart.js
- KPIs comparativos
- Análise de custo-efetividade

### 5. **Base Científica**
- Referências bibliográficas completas
- Metodologia baseada em evidências
- Diretrizes clínicas internacionais

## 🔧 Contexto Global

O projeto usa React Context API para gerenciar o estado:

```typescript
// Acesso ao contexto em qualquer componente
const { 
  currentSection, 
  config, 
  resultados,
  setCurrentSection,
  updateConfig,
  setResultados 
} = useSimulator();
```

## 📊 Fluxo de Dados

1. **Configuração Inicial**: Usuário seleciona tipo de hospital e paciente
2. **Personalização**: Ajusta parâmetros da simulação
3. **Execução**: Algoritmo simula cenários COM e SEM TNO
4. **Resultados**: Exibição de KPIs, gráficos e conclusões

## 🎨 Tailwind CSS

O projeto usa Tailwind CSS 4 com classes utilitárias:

```tsx
<div className="bg-white rounded-xl p-8 shadow-md">
  <h1 className="text-4xl font-bold text-blue-600">
    Título
  </h1>
</div>
```

## 🔥 Firebase

Analytics configurado para rastrear:
- Visualizações de página
- Execução de simulações
- Navegação entre seções

## 📱 Responsividade

Totalmente responsivo com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deploy

O projeto está pronto para deploy em plataformas como:

- **Vercel** (recomendado)
- **Netlify**
- **AWS Amplify**

```bash
# Deploy na Vercel
vercel

# Ou usando o CLI do Vercel
npm i -g vercel
vercel --prod
```

## 🔄 Migração do Projeto Original

Este projeto foi migrado de Vite + Vanilla JS para Next.js:

- ✅ HTML convertido para componentes React
- ✅ CSS inline convertido para Tailwind CSS
- ✅ JavaScript ES6 convertido para TypeScript
- ✅ Estado global com Context API
- ✅ Gráficos com react-chartjs-2
- ✅ Firebase integrado
- ✅ SSR/SSG com Next.js

---

**Feito com ❤️ para profissionais de saúde**

