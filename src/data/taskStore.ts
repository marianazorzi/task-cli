import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import type { Task } from "./task";

const DATA_FILE = resolve(process.cwd(), "tasks.json");

function readTasks(filePath: string = DATA_FILE): Task[] {
  if (!existsSync(filePath)) {
    return [];
  }

  const raw = readFileSync(filePath, "utf-8").trim();
  if (raw.length === 0) {
    return [];
  }

  try {
    return JSON.parse(raw) as Task[];
  } catch {
    throw new Error(`Falha ao ler ${filePath}: arquivo JSON invalido.`);
  }
}

function writeTasks(tasks: Task[], filePath: string = DATA_FILE): void {
  writeFileSync(filePath, JSON.stringify(tasks, null, 2), "utf-8");
}

function nextId(tasks: Task[]): number {
  return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
}

export class TaskStore {
  private readonly filePath: string;

  constructor(filePath: string = DATA_FILE) {
    this.filePath = filePath;
  }

  list(): Task[] {
    return readTasks(this.filePath);
  }

  add(title: string): Task {
    const tasks = readTasks(this.filePath);
    const task: Task = {
      id: nextId(tasks),
      title,
      done: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
    writeTasks(tasks, this.filePath);
    return task;
  }

  markDone(id: number): Task {
    const tasks = readTasks(this.filePath);
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error(`Tarefa com id ${id} nao encontrada.`);
    }
    task.done = true;
    writeTasks(tasks, this.filePath);
    return task;
  }

  remove(id: number): Task {
    const tasks = readTasks(this.filePath);
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Tarefa com id ${id} nao encontrada.`);
    }
    const [removed] = tasks.splice(index, 1);
    writeTasks(tasks, this.filePath);
    return removed as Task;
  }
}
