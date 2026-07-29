🌐 [Versão em português](README.md)

# task-cli

A task manager built with TypeScript, available as a **CLI**, a **REST API** (Node.js/Express + SQLite), and a **web interface** (React). Organized as an npm workspaces monorepo, with a shared core package holding types and business rules used by all three apps.

## Description

`task-cli` started as a command-line tool for managing everyday tasks, and grew into a full-stack architecture:

- **CLI** (`apps/cli`) — still works standalone, persisting tasks to a local JSON file (`tasks.json`).
- **Server** (`apps/server`) — an Express REST API that persists tasks to SQLite (via `node:sqlite`, Node.js's built-in native module — no compiled dependencies required).
- **Web** (`apps/web`) — a React (Vite) interface that consumes the REST API to add, complete, and remove tasks from the browser.
- **Core** (`packages/core`) — shared `Task` types and validation rules used by both the CLI and the server, keeping behavior consistent.

## Installation

Prerequisites: [Node.js](https://nodejs.org/) **22.5+** (required for the `node:sqlite` native module used by the server) and npm.

```bash
# Install dependencies for all workspaces (core, cli, server, web)
npm install

# Build core, cli, and server
npm run build
```

## Running each part

### CLI

```bash
# After building
npm run cli -- add "Buy milk"
npm run cli -- list

# Or in development mode (no build needed)
npm run cli:dev -- add "Buy milk"
npm run cli:dev -- list
```

### REST API (server)

```bash
npm run server:dev
# API available at http://localhost:3001/api/tasks
```

### Web interface (React)

```bash
npm run web:dev
# Interface available at http://localhost:5173
```

### Everything together (server + web)

```bash
npm run dev
```

## CLI commands

| Command | Description |
|---|---|
| `add "task title"` | Adds a new task |
| `list` | Lists all tasks |
| `done <id>` | Marks a task as completed |
| `remove <id>` | Removes a task |
| `help` | Shows help with available commands |

### Usage examples (CLI)

```bash
npm run cli -- add "Buy milk"
# Tarefa adicionada: [ ] #1 Buy milk

npm run cli -- list
# [ ] #1 Buy milk

npm run cli -- done 1
# Tarefa concluida: [x] #1 Buy milk

npm run cli -- remove 1
# Tarefa removida: [x] #1 Buy milk
```

## REST API endpoints

Base URL: `http://localhost:3001`

| Method | Route | Description | Body |
|---|---|---|---|
| `GET` | `/api/tasks` | Lists all tasks | — |
| `POST` | `/api/tasks` | Adds a new task | `{ "title": "..." }` |
| `PATCH` | `/api/tasks/:id/done` | Marks the task as completed | — |
| `DELETE` | `/api/tasks/:id` | Removes the task | — |

Validation errors return `400`, not-found tasks return `404`, both shaped as `{ "error": "message" }`.

### curl example

```bash
curl -X POST http://localhost:3001/api/tasks -H "Content-Type: application/json" -d '{"title":"Learn TypeScript"}'
curl http://localhost:3001/api/tasks
curl -X PATCH http://localhost:3001/api/tasks/1/done
curl -X DELETE http://localhost:3001/api/tasks/1
```

## Project structure

```
task-cli/
├── packages/
│   └── core/                    # Shared types and validation (@task-cli/core)
│       └── src/
│           ├── types.ts         # Task interface
│           ├── validation.ts    # normalizeTitle, parseTaskId, ValidationError
│           └── index.ts
├── apps/
│   ├── cli/                     # Standalone CLI (JSON persistence)
│   │   └── src/
│   │       ├── cli/commands.ts
│   │       ├── data/taskStore.ts
│   │       └── index.ts
│   ├── server/                  # REST API (Express + node:sqlite)
│   │   └── src/
│   │       ├── routes/tasks.ts
│   │       ├── taskRepository.ts
│   │       ├── errors.ts
│   │       ├── app.ts
│   │       └── index.ts
│   └── web/                     # React interface (Vite)
│       └── src/
│           ├── App.tsx
│           ├── api.ts
│           └── main.tsx
├── package.json                 # Root workspaces config + orchestration scripts
├── tsconfig.base.json           # Shared strict TypeScript configuration
└── .gitignore
```

## Technologies used

- [TypeScript](https://www.typescriptlang.org/) — static typing across the whole monorepo
- [Node.js](https://nodejs.org/) (22.5+) — runtime, including the built-in `node:sqlite` module
- [Express](https://expressjs.com/) — REST API
- [React](https://react.dev/) + [Vite](https://vitejs.dev/) — web interface
- npm workspaces — monorepo organization
- JSON persistence (CLI) and SQLite persistence (server), with no native compiled dependencies
