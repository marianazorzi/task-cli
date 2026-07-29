import { useEffect, useState, type FormEvent } from "react";
import type { Task } from "@task-cli/core";
import { api } from "./api";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks(): Promise<void> {
    try {
      setLoading(true);
      setTasks(await api.listTasks());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (newTitle.trim().length === 0) {
      return;
    }
    try {
      const task = await api.addTask(newTitle);
      setTasks((current) => [...current, task]);
      setNewTitle("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleToggleDone(task: Task): Promise<void> {
    if (task.done) {
      return;
    }
    try {
      const updated = await api.completeTask(task.id);
      setTasks((current) => current.map((t) => (t.id === updated.id ? updated : t)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleRemove(task: Task): Promise<void> {
    try {
      await api.removeTask(task.id);
      setTasks((current) => current.filter((t) => t.id !== task.id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <main className="app">
      <h1>task-cli</h1>
      <p className="subtitle">Gerenciador de tarefas</p>

      <form className="add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nova tarefa..."
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : tasks.length === 0 ? (
        <p className="empty">Nenhuma tarefa cadastrada.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "done" : ""}>
              <label>
                <input type="checkbox" checked={task.done} onChange={() => handleToggleDone(task)} />
                <span>{task.title}</span>
              </label>
              <button className="remove" onClick={() => handleRemove(task)} aria-label="Remover tarefa">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
