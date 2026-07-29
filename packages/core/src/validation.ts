export class ValidationError extends Error {}

export function normalizeTitle(rawTitle: string | undefined): string {
  const title = rawTitle?.trim() ?? "";
  if (title.length === 0) {
    throw new ValidationError("O titulo da tarefa nao pode ser vazio.");
  }
  if (title.length > 200) {
    throw new ValidationError("O titulo da tarefa nao pode ter mais de 200 caracteres.");
  }
  return title;
}

export function parseTaskId(rawId: string | number | undefined): number {
  if (rawId === undefined || rawId === "") {
    throw new ValidationError("O id da tarefa e obrigatorio.");
  }
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(`Id invalido: "${rawId}". Informe um numero inteiro positivo.`);
  }
  return id;
}
