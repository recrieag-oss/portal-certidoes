# Portal Certidões

Aplicativo Next.js 14 com TypeScript, Tailwind CSS, React Hook Form, Zod, Framer Motion, Lucide React e integração com Mercado Pago.

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.local.example .env.local
```

3. Preencha as variáveis em `.env.local`:

- `MERCADOPAGO_ACCESS_TOKEN`
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`
- `NEXT_PUBLIC_BASE_URL`

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000)

## Scripts úteis

- `npm run dev` — executa o ambiente de desenvolvimento
- `npm run build` — gera a versão de produção
- `npm start` — inicia a aplicação em modo de produção
- `npm run lint` — executa o ESLint

## Estrutura principal

- `app/layout.tsx` — layout global com header e footer
- `app/page.tsx` — landing page principal
- `app/certidao/*` — formulários de solicitação de certidões
- `app/checkout/page.tsx` — página de checkout com Mercado Pago
- `app/sucesso/page.tsx`, `app/pendente/page.tsx`, `app/falha/page.tsx` — páginas pós-pagamento
- `app/acompanhar/page.tsx` — consulta de status por código
- `app/api/create-preference/route.ts` — cria preferência Mercado Pago
- `app/api/webhook/route.ts` — recebe notificações do Mercado Pago
- `components/ui` — componentes reutilizáveis
- `components/forms` — passos do formulário multi-step
- `components/checkout` — resumo do pedido e fluxo de pagamento
- `lib` — constantes, validações, máscaras, tipos e integração com Mercado Pago

## Observações

- A página de checkout está preparada para gerar preferência de pagamento e redirecionar para o Mercado Pago.
- Esta base está pronta para integração futura com banco de dados e deployment.
