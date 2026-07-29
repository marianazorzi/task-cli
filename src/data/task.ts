export interface Task {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
}

export type NewTask = Pick<Task, "title">;
