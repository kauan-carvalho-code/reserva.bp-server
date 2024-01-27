## Configuração

1. Clone o repositório: `git clone https://github.com/kauan-carvalho-code/reserva.bp-server.git`
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente: copie o arquivo `.env-example` para `.env` e configure as variáveis conforme necessário.

## Rodando em modo de desenvolvimento

1. Inicie o PostgreSQL (caso já não tenha iniciado): `docker compose up -d`.
2. Rode as migrations: `npx prisma migrate dev`.
3. Inicie o modo de desenvolvimento: `npm run dev`.

## Rodando em modo de produção

1. Inicie o PostgreSQL (caso já não tenha iniciado): `docker compose up -d`.
2. Rode as migrations: `npx prisma migrate deploy`.
3. Inicie o modo de produção: `npm run start:prod`.

## Testes

1. Rode os testes: `npm run test`.

## Swagger

A documentação das rotas pode ser acessada em:: `http://localhost:3000/docs`.

## Tecnologias utilizadas

  - Express
  - Prisma
  - Vitest
  - Docker

## Docker

Este projeto utiliza Docker para simplificar o processo de desenvolvimento e implantação. Abaixo estão as instruções para configurar e executar o projeto usando Docker.

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina. Se você ainda não os possui instalados, você pode baixá-los [aqui](https://www.docker.com/get-started).

### Configuração do Docker Compose

O arquivo `docker-compose.yml` define um serviço para o PostgreSQL. Certifique-se de ajustar as configurações, como nome do banco de dados, usuário e senha, conforme necessário.
