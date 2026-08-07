import { StreakInfo } from '@/types/game';

const STREAK_KEY = 'detective_musica_streak';

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function loadStreak(): StreakInfo {
  if (typeof window === 'undefined') return { rachaActual: 0, mejorRacha: 0 };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading streak:', err);
  }
  return { rachaActual: 0, mejorRacha: 0 };
}

export function updateStreak(acerto: boolean): StreakInfo {
  const current = loadStreak();
  let rachaActual = current.rachaActual;
  let mejorRacha = current.mejorRacha;

  if (acerto) {
    rachaActual += 1;
    if (rachaActual > mejorRacha) {
      mejorRacha = rachaActual;
    }
  } else {
    rachaActual = 0;
  }

  const updated: StreakInfo = { rachaActual, mejorRacha };

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving streak:', err);
  }

  return updated;
}
