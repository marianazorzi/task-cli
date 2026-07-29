import type { Task } from "@task-cli/core";
import { normalizeTitle, parseTaskId } from "@task-cli/core";
import { TaskStore } from "../data/taskStore";

const store = new TaskStore();

function formatTask(task: Task): string {
  const status = task.done ? "[x]" : "[ ]";
  return `${status} #${task.id} ${task.title}`;
}

export function addTask(rawTitle: string | undefined): void {
  const title = normalizeTitle(rawTitle);
  const task = store.add(title);
  console.log(`Tarefa adicionada: ${formatTask(task)}`);
}

export function listTasks(): void {
  const tasks = store.list();
  if (tasks.length === 0) {
    console.log("Nenhuma tarefa cadastrada.");
    return;
  }
  for (const task of tasks) {
    console.log(formatTask(task));
  }
}

export function completeTask(rawId: string | undefined): void {
  const id = parseTaskId(rawId);
  const task = store.markDone(id);
  console.log(`Tarefa concluida: ${formatTask(task)}`);
}

export function removeTask(rawId: string | undefined): void {
  const id = parseTaskId(rawId);
  const task = store.remove(id);
  console.log(`Tarefa removida: ${formatTask(task)}`);
}

export function showHelp(): void {
  console.log(`task-cli - Gerenciador de tarefas via linha de comando

Uso:
  task-cli add "titulo da tarefa"   Adiciona uma nova tarefa
  task-cli list                     Lista todas as tarefas
  task-cli done <id>                Marca uma tarefa como concluida
  task-cli remove <id>              Remove uma tarefa
  task-cli help                     Mostra esta ajuda`);
}
