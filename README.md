🌐 [English version](README.en.md)

# task-cli

Gerenciador de tarefas construído com TypeScript, disponível como **CLI**, **API REST** (Node.js/Express + SQLite) e **interface web** (React). Monorepo organizado em workspaces npm, com um pacote central de tipos e regras de negócio compartilhado entre as três aplicações.

## Descrição

`task-cli` nasceu como uma ferramenta de linha de comando para gerenciar tarefas do dia a dia, e evoluiu para uma arquitetura full-stack:

- **CLI** (`apps/cli`) — continua funcionando de forma independente, com persistência em um arquivo JSON local (`tasks.json`).
- **Server** (`apps/server`) — uma API REST em Express que persiste as tarefas em SQLite (via `node:sqlite`, módulo nativo do Node.js — sem dependências de compilação).
- **Web** (`apps/web`) — uma interface React (Vite) que consome a API REST para adicionar, concluir e remover tarefas pelo navegador.
- **Core** (`packages/core`) — tipos (`Task`) e regras de validação compartilhadas entre CLI e server, garantindo consistência de comportamento.

## Instalação

Pré-requisitos: [Node.js](https://nodejs.org/) **22.5+** (necessário para o módulo nativo `node:sqlite` usado pelo servidor) e npm.

```bash
# Instala as dependências de todos os workspaces (core, cli, server, web)
npm install

# Compila core, cli e server
npm run build
```

## Como rodar cada parte

### CLI

```bash
# Após o build
npm run cli -- add "Comprar leite"
npm run cli -- list

# Ou em modo desenvolvimento (sem compilar)
npm run cli:dev -- add "Comprar leite"
npm run cli:dev -- list
```

### API REST (server)

```bash
npm run server:dev
# API disponível em http://localhost:3001/api/tasks
```

### Interface web (React)

```bash
npm run web:dev
# Interface disponível em http://localhost:5173
```

### Tudo junto (server + web)

```bash
npm run dev
```

## Comandos do CLI

| Comando | Descrição |
|---|---|
| `add "título da tarefa"` | Adiciona uma nova tarefa |
| `list` | Lista todas as tarefas |
| `done <id>` | Marca uma tarefa como concluída |
| `remove <id>` | Remove uma tarefa |
| `help` | Mostra a ajuda com os comandos disponíveis |

### Exemplos de uso (CLI)

```bash
npm run cli -- add "Comprar leite"
# Tarefa adicionada: [ ] #1 Comprar leite

npm run cli -- list
# [ ] #1 Comprar leite

npm run cli -- done 1
# Tarefa concluida: [x] #1 Comprar leite

npm run cli -- remove 1
# Tarefa removida: [x] #1 Comprar leite
```

## Endpoints da API REST

Base URL: `http://localhost:3001`

| Método | Rota | Descrição | Corpo |
|---|---|---|---|
| `GET` | `/api/tasks` | Lista todas as tarefas | — |
| `POST` | `/api/tasks` | Adiciona uma nova tarefa | `{ "title": "..." }` |
| `PATCH` | `/api/tasks/:id/done` | Marca a tarefa como concluída | — |
| `DELETE` | `/api/tasks/:id` | Remove a tarefa | — |

Erros de validação retornam `400`, tarefas não encontradas retornam `404`, ambos no formato `{ "error": "mensagem" }`.

### Exemplo com curl

```bash
curl -X POST http://localhost:3001/api/tasks -H "Content-Type: application/json" -d '{"title":"Estudar TypeScript"}'
curl http://localhost:3001/api/tasks
curl -X PATCH http://localhost:3001/api/tasks/1/done
curl -X DELETE http://localhost:3001/api/tasks/1
```

## Estrutura do projeto

```
task-cli/
├── packages/
│   └── core/                    # Tipos e validação compartilhados (@task-cli/core)
│       └── src/
│           ├── types.ts         # Interface Task
│           ├── validation.ts    # normalizeTitle, parseTaskId, ValidationError
│           └── index.ts
├── apps/
│   ├── cli/                     # CLI standalone (persistência em JSON)
│   │   └── src/
│   │       ├── cli/commands.ts
│   │       ├── data/taskStore.ts
│   │       └── index.ts
│   ├── server/                  # API REST (Express + node:sqlite)
│   │   └── src/
│   │       ├── routes/tasks.ts
│   │       ├── taskRepository.ts
│   │       ├── errors.ts
│   │       ├── app.ts
│   │       └── index.ts
│   └── web/                     # Interface React (Vite)
│       └── src/
│           ├── App.tsx
│           ├── api.ts
│           └── main.tsx
├── package.json                 # Workspaces raiz + scripts de orquestração
├── tsconfig.base.json           # Configuração TypeScript strict compartilhada
└── .gitignore
```

## Tecnologias usadas

- [TypeScript](https://www.typescriptlang.org/) — tipagem estática em todo o monorepo
- [Node.js](https://nodejs.org/) (22.5+) — runtime, incluindo o módulo nativo `node:sqlite`
- [Express](https://expressjs.com/) — API REST
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) — interface web
- npm workspaces — organização do monorepo
- Persistência em JSON (CLI) e SQLite (server), sem dependências nativas de compilação
