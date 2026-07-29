import type { Task } from "@task-cli/core";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? `Erro ao chamar ${path} (status ${response.status}).`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  listTasks(): Promise<Task[]> {
    return request<Task[]>("/api/tasks");
  },
  addTask(title: string): Promise<Task> {
    return request<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },
  completeTask(id: number): Promise<Task> {
    return request<Task>(`/api/tasks/${id}/done`, { method: "PATCH" });
  },
  removeTask(id: number): Promise<Task> {
    return request<Task>(`/api/tasks/${id}`, { method: "DELETE" });
  },
};
