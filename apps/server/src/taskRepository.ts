import { DatabaseSync } from "node:sqlite";
import { resolve } from "path";
import type { Task } from "@task-cli/core";
import { NotFoundError } from "./errors";

const DB_PATH = resolve(__dirname, "..", "data.sqlite");

const db = new DatabaseSync(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`);

interface TaskRow {
  id: number;
  title: string;
  done: number;
  createdAt: string;
}

function toTask(row: TaskRow): Task {
  return { id: row.id, title: row.title, done: row.done === 1, createdAt: row.createdAt };
}

export const taskRepository = {
  list(): Task[] {
    const rows = db.prepare("SELECT * FROM tasks ORDER BY id").all() as unknown as TaskRow[];
    return rows.map(toTask);
  },

  add(title: string): Task {
    const createdAt = new Date().toISOString();
    const info = db
      .prepare("INSERT INTO tasks (title, done, createdAt) VALUES (?, 0, ?)")
      .run(title, createdAt);
    return { id: Number(info.lastInsertRowid), title, done: false, createdAt };
  },

  markDone(id: number): Task {
    const result = db.prepare("UPDATE tasks SET done = 1 WHERE id = ?").run(id);
    if (Number(result.changes) === 0) {
      throw new NotFoundError(id);
    }
    const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as unknown as TaskRow;
    return toTask(row);
  },

  remove(id: number): Task {
    const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as unknown as TaskRow | undefined;
    if (!row) {
      throw new NotFoundError(id);
    }
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
    return toTask(row);
  },
};
