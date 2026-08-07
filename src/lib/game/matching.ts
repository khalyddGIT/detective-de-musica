/**
  * Normaliza una cadena removiendo tildes, signos de puntuación, mayúsculas y espacios extra.
  */
export function normalizeSongTitle(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
    .replace(/[^a-z0-9]/g, '')       // Eliminar todo lo que no sea letra o número
    .trim();
}

/**
  * Evalúa si la respuesta del usuario coincide de manera aceptable con el título real de la canción.
  */
export function isCorrectGuess(userGuess: string, actualTitle: string): boolean {
  const normalizedUser = normalizeSongTitle(userGuess);
  const normalizedActual = normalizeSongTitle(actualTitle);

  if (!normalizedUser || !normalizedActual) return false;

  // Coincidencia exacta tras normalización
  if (normalizedUser === normalizedActual) return true;

  // Si la respuesta incluye el título completo o viceversa (para títulos con subtítulos o paréntesis)
  if (normalizedActual.length > 4 && normalizedUser.includes(normalizedActual)) return true;
  if (normalizedUser.length > 4 && normalizedActual.includes(normalizedUser)) return true;

  return false;
}

/**
  * Calcula el puntaje según las pistas utilizadas (1 a 5).
  */
export function calculateScore(pistasUsadas: number, acerto: boolean): number {
  if (!acerto) return 0;
  // 1 pista -> 100, 2 pistas -> 80, 3 -> 60, 4 -> 40, 5 -> 20
  const score = 120 - Math.min(Math.max(pistasUsadas, 1), 5) * 20;
  return Math.max(score, 20);
}
