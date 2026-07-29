#!/usr/bin/env node
import { addTask, completeTask, listTasks, removeTask, showHelp } from "./cli/commands";

function main(): void {
  const [command, ...args] = process.argv.slice(2);

  try {
    switch (command) {
      case "add":
        addTask(args.join(" "));
        break;
      case "list":
        listTasks();
        break;
      case "done":
        completeTask(args[0]);
        break;
      case "remove":
        removeTask(args[0]);
        break;
      case "help":
      case undefined:
        showHelp();
        break;
      default:
        console.error(`Comando desconhecido: "${command}"\n`);
        showHelp();
        process.exitCode = 1;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Erro: ${message}`);
    process.exitCode = 1;
  }
}

main();
