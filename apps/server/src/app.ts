import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { ValidationError } from "@task-cli/core";
import { tasksRouter } from "./routes/tasks";
import { NotFoundError } from "./errors";

export function createApp(): express.Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/tasks", tasksRouter);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor." });
  });

  return app;
}
