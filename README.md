# Blog API

Esta é uma API para validação e gerenciamento de um blog, desenvolvida com TypeScript, Fastify, Prisma e PostgreSQL.

## Tecnologias Utilizadas

- **TypeScript**: Linguagem de programação que adiciona tipagem estática ao JavaScript.
- **Fastify**: Framework web rápido e de baixa sobrecarga para Node.js.
- **Prisma**: ORM (Object-Relational Mapping) para Node.js e TypeScript.
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.

## Requisitos

- Node.js v20 ou superior
- PostgreSQL

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Dh-Pe/blog_api.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd blog-api
   ```
3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente:

   Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:

   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
   ```

5. Execute as migrações do banco de dados:
   ```bash
   npx prisma db push
   ```

## Uso

1. Inicie o servidor de desenvolvimento:

   ```bash
   npm run start:dev
   ```

2. A API estará disponível em http://localhost:3000.

## Endpoints

### Autenticação

`POST /auth/login`: Login de um usuário.

### Posts

- `GET /post`: Lista todos os posts.
- `GET /post/:id`: Obtém um post pelo ID.
- `POST /post`: Cria um novo post.
- `PUT /post/:id`: Atualiza um post pelo ID.
- `DELETE /post/:id`: Remove um post pelo ID.

### Usuários

- `GET /user`: Lista todos os usuários.
- `GET /user/:id`: Obtém um usuário pelo ID.
- `POST /user`: Cria um novo usuário.
- `PUT /user/:id`: Atualiza um usuário pelo ID.
- `DELETE /user/:id`: Remove um usuário pelo ID.

## Scripts Disponíveis

- `npm run start:dev`: Inicia o servidor em modo de desenvolvimento.
- `npm run build`: Compila o projeto TypeScript.
- `npm start:prd`: Inicia o servidor com o código compilado.
- `npx prisma studio`: Abre o Prisma Studio para gerenciar o banco de dados visualmente.
- `npx prisma db push`: Gera estrutura do banco de dados diretamente a partir do esquema.
- `npx prisma generate`: Gera o cliente Prisma a partir do esquema.

## Estrutura do Projeto

```bash
blog-api/
├── prisma/
│ ├── schema.prisma
├── src/
│ ├── controllers/
│ ├── config/
│ ├── routes/
│ ├── middlewares/
│ ├── index.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.
