# Betoneira Suplementos

Aplicativo de loja de suplementos desenvolvido com React Native, Expo e Expo Router. O frontend consome a API REST do projeto para autenticação, catálogo, favoritos, carrinho, perfil, endereços, formas de pagamento e pedidos. Apenas a recuperação de senha continua simulada.

## Como executar

Use dois terminais. No primeiro, inicie o backend:

```bash
cd backend
npm run db:seed
npm start
```

O `db:seed` só precisa ser executado para popular ou restaurar os dados iniciais. Ele é seguro para ser executado novamente.

No segundo terminal, inicie o Expo:

```bash
cd frontend
npx expo start -c
```

Para testar no navegador, pressione `w` no terminal do Expo ou execute `npm run web`. O endereço padrão da API é `http://localhost:3333/api/v1`.

### Celular físico

Crie `frontend/.env.local` e substitua `SEU_IP` pelo IP local do computador:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:3333/api/v1
```

O celular e o computador devem estar na mesma rede. Inclua a origem exibida pelo Expo em `CORS_ORIGINS` no arquivo `backend/.env` se o navegador informar bloqueio de CORS.

## Estrutura principal

- `src/app/`: telas e rotas.
- `src/components/`: componentes de interface.
- `src/contextos/`: sessão e autenticação compartilhadas.
- `src/hooks/`: consultas e lógica reutilizável.
- `src/services/`: comunicação com a API e armazenamento seguro da sessão.
- `src/schemas/`: validação dos formulários.
- `src/utils/`: adaptação e formatação dos dados da API.

## Observação sobre pagamentos

O cadastro atual armazena somente bandeira, quatro últimos dígitos e validade para permitir o teste do checkout. Nenhum número completo de cartão ou código de segurança é armazenado. A tokenização será integrada ao Mercado Pago em uma etapa futura.
