export function generateShareText(title: string, artist: string, score: number, cluesUsed: number): string {
  const stars = cluesUsed === 1 ? '⭐⭐⭐⭐⭐' : cluesUsed === 2 ? '⭐⭐⭐⭐' : cluesUsed === 3 ? '⭐⭐⭐' : cluesUsed === 4 ? '⭐⭐' : '⭐';
  return `🎵 Detective de Música 🎵\n¡Adiviné "${title}" de ${artist} usando solo ${cluesUsed} ${cluesUsed === 1 ? 'pista' : 'pistas'}! ${stars}\n\n🏆 Puntaje: +${score} pts\n\n¿Puedes superarme? Juega en https://detective-de-musica.vercel.app`;
}

export async function copyShareToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.error('Clipboard copy failed:', err);
  }
  return false;
}
