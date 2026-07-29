export class NotFoundError extends Error {
  constructor(id: number) {
    super(`Tarefa com id ${id} nao encontrada.`);
  }
}
