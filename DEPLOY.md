# Guia de Deploy - Simulador TNO

Este guia descreve o processo para preparar e publicar o Simulador TNO em produção.

## 1. Validação Pré-Deploy

Antes de enviar o código para produção, execute o script de validação para garantir que não há erros de tipagem ou falhas no build.

**Comando:**

```powershell
.\scripts\prepare-deploy.ps1
```

**O que ele faz:**

1. Limpa o cache (`.next`)
2. Executa verificação de Tipos (`tsc`)
3. Executa o Build de Produção (`next build`)

## 2. Deploy na Vercel (Recomendado)

O projeto está otimizado para a Vercel.

1. Instale a Vercel CLI (opcional) ou conecte o repositório GitHub ao painel da Vercel.
2. **Configuração de Ambiente:**
   No painel da Vercel (Settings > Environment Variables), adicione:
   - `JWT_SECRET`: (Gere um valor seguro ou use um UUID)

3. **Deploy Automático:**
   Ao fazer push para a branch `main`, a Vercel iniciará o build automaticamente.

### Comandos de Push (Simples)

Se você já tem o repositório conectado:

```bash
git add .
git commit -m "chore: prepare release 1.0"
git push
```

## 3. Teste Local de Produção

Para simular o ambiente de produção na sua máquina:

```bash
npm run build
npm start
```

Acesse `http://localhost:3000` para validar performance e comportamento.

## 4. Checklist de Performance

- [ ] **Imagens**: Verifique se todas as imagens novas estão em `/public` e usando o componente `<Image />` do Next.js quando possível.
- [ ] **Mobile**: Teste a navegação nas rotas `/public` e `/technical` em simulador mobile (Chrome DevTools).
- [ ] **Erros de Console**: Abra o console (F12) e verifique se há erros vermelhos durante a navegação.
