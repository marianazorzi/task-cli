🌐 [English version](README.en.md)

# task-cli

Gerenciador de tarefas via linha de comando (CLI), construído com TypeScript e Node.js, com persistência em JSON e um código tipado e organizado.

## Descrição

`task-cli` é uma ferramenta de linha de comando para gerenciar tarefas do dia a dia. As tarefas são salvas em um arquivo JSON local (`tasks.json`), permitindo adicionar, listar, concluir e remover tarefas de forma simples e rápida, sem depender de bancos de dados externos.

## Instalação

Pré-requisitos: [Node.js](https://nodejs.org/) 18+ e npm.

```bash
# Instale as dependências
npm install

# Compile o projeto TypeScript
npm run build
```

Após o build, o CLI pode ser executado com:

```bash
node dist/index.js <comando>
```

Ou, durante o desenvolvimento, sem precisar compilar:

```bash
npm run dev -- <comando>
```

## Comandos disponíveis

| Comando | Descrição |
|---|---|
| `add "título da tarefa"` | Adiciona uma nova tarefa |
| `list` | Lista todas as tarefas |
| `done <id>` | Marca uma tarefa como concluída |
| `remove <id>` | Remove uma tarefa |
| `help` | Mostra a ajuda com os comandos disponíveis |

### Exemplos de uso

```bash
# Adicionar uma nova tarefa
node dist/index.js add "Comprar leite"
# Tarefa adicionada: [ ] #1 Comprar leite

# Listar todas as tarefas
node dist/index.js list
# [ ] #1 Comprar leite

# Marcar a tarefa #1 como concluída
node dist/index.js done 1
# Tarefa concluida: [x] #1 Comprar leite

# Remover a tarefa #1
node dist/index.js remove 1
# Tarefa removida: [x] #1 Comprar leite

# Ver a ajuda
node dist/index.js help
```

As tarefas são persistidas no arquivo `tasks.json`, criado automaticamente no diretório onde o comando é executado.

## Estrutura do projeto

```
task-cli/
├── src/
│   ├── cli/
│   │   └── commands.ts     # Lógica dos comandos do CLI (add, list, done, remove, help)
│   ├── data/
│   │   ├── task.ts         # Tipos/interfaces da entidade Task
│   │   └── taskStore.ts    # Camada de persistência (leitura/escrita do JSON)
│   └── index.ts            # Ponto de entrada do CLI (parsing de argumentos)
├── dist/                   # Código compilado (gerado pelo build)
├── tasks.json              # Arquivo de dados local (gerado em tempo de execução)
├── package.json
├── tsconfig.json
└── .gitignore
```

## Tecnologias usadas

- [TypeScript](https://www.typescriptlang.org/) — tipagem estática e código mais seguro
- [Node.js](https://nodejs.org/) — runtime de execução
- [ts-node](https://typestrong.org/ts-node/) — execução direta de TypeScript em desenvolvimento
- Persistência baseada em arquivo JSON, sem dependências externas de banco de dados
