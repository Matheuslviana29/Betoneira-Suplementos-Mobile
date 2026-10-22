# Betoneira Suplementos

Aplicativo de loja de suplementos desenvolvido com React Native, Expo e Expo Router. O projeto apresenta a navegação e os principais fluxos de uma loja, usando dados simulados.

> **Projeto em andamento:** telas, funcionalidades e estrutura estão sujeitos a alterações. As operações de login, recuperação de senha, cadastro e compra são simulações; não há envio de e-mail, pagamento ou persistência em um servidor.

## Funcionalidades

- Login, cadastro e tela de recuperação de senha com validação de formulários.
- Página inicial com banner de ofertas e produtos em destaque.
- Catálogo com busca e filtro por categoria.
- Lista de favoritos e carrinho com ajuste de quantidades e resumo do pedido.
- Checkout com endereço e forma de pagamento simulados.
- Área do perfil com dados pessoais, pedidos, endereços, formas de pagamento e alteração de senha.
- Avisos e confirmações exibidos por toast.

## Tecnologias

React Native, Expo, Expo Router, Zod e Toastify React Native.

## Como executar

Com Node.js e npm instalados, execute na pasta do projeto:

```bash
npm install
npx expo start -c
```

No menu do Expo, escolha Android, iOS ou web. Também é possível iniciar diretamente com `npm run android`, `npm run ios` ou `npm run web`.

## Estrutura principal

- `src/app/`: telas e rotas do aplicativo.
- `src/components/`: componentes de interface.
- `src/hooks/`: lógica reutilizável dos formulários e filtros.
- `src/mocks/`: dados simulados de produtos, usuário, pedidos, carrinho e pagamentos.
- `src/schemas/`: validação dos formulários.
