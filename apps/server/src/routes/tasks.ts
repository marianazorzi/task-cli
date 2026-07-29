import { Router } from "express";
import { normalizeTitle, parseTaskId } from "@task-cli/core";
import { taskRepository } from "../taskRepository";

export const tasksRouter = Router();

tasksRouter.get("/", (_req, res) => {
  res.json(taskRepository.list());
});

tasksRouter.post("/", (req, res, next) => {
  try {
    const title = normalizeTitle(req.body?.title);
    const task = taskRepository.add(title);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

tasksRouter.patch("/:id/done", (req, res, next) => {
  try {
    const id = parseTaskId(req.params.id);
    const task = taskRepository.markDone(id);
    res.json(task);
  } catch (error) {
    next(error);
  }
});

tasksRouter.delete("/:id", (req, res, next) => {
  try {
    const id = parseTaskId(req.params.id);
    const task = taskRepository.remove(id);
    res.json(task);
  } catch (error) {
    next(error);
  }
});
