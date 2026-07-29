import type { Task } from "../data/task";
import { TaskStore } from "../data/taskStore";

const store = new TaskStore();

function formatTask(task: Task): string {
  const status = task.done ? "[x]" : "[ ]";
  return `${status} #${task.id} ${task.title}`;
}

export function addTask(title: string | undefined): void {
  if (!title || title.trim().length === 0) {
    throw new Error('Titulo da tarefa nao pode ser vazio. Uso: add "titulo da tarefa"');
  }
  const task = store.add(title.trim());
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

function parseId(rawId: string | undefined): number {
  if (!rawId) {
    throw new Error("Id da tarefa e obrigatorio.");
  }
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Id invalido: "${rawId}". Informe um numero inteiro positivo.`);
  }
  return id;
}

export function completeTask(rawId: string | undefined): void {
  const id = parseId(rawId);
  const task = store.markDone(id);
  console.log(`Tarefa concluida: ${formatTask(task)}`);
}

export function removeTask(rawId: string | undefined): void {
  const id = parseId(rawId);
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
