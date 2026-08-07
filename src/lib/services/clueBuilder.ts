import { Pista } from '@/types/game';
import { LastFmTrackData } from './lastfm';
import { AudioPreviewData } from './audioPreview';

export function sanitizeTitle(text: string, title: string): string {
  if (!text || !title) return text;
  // Escapar caracteres especiales para usar en RegExp
  const regex = new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return text.replace(regex, '███████');
}

export function buildSongClues(
  artist: string,
  title: string,
  lastfmData: LastFmTrackData | null,
  audioData: AudioPreviewData,
  manualYear?: number
): { pistes: Pista[]; year: number | null; album: string | null; previewUrl: string | null } {
  const year = manualYear || audioData.releaseYear || lastfmData?.year || null;
  const album = audioData.albumName || lastfmData?.album || null;
  const previewUrl = audioData.previewUrl;

  const tags = lastfmData?.tags || [];
  if (audioData.genreName && !tags.includes(audioData.genreName)) {
    tags.unshift(audioData.genreName);
  }
  const mainGenres = tags.slice(0, 4).join(', ') || 'Pop / Rock General';

  let rawSummary = lastfmData?.summary || `Canción emblemática del catálogo musical de ${artist}.`;
  const cleanSummary = sanitizeTitle(rawSummary, title);

  const pistes: Pista[] = [
    {
      orden: 1,
      tipo: 'anio',
      titulo: 'Pista 1: Año de Lanzamiento',
      contenido: year 
        ? `Lanzada oficialmente en el año ${year} (década de los ${Math.floor(year / 10) * 10}).`
        : 'Canción lanzada en la época dorada de la música moderna.'
    },
    {
      orden: 2,
      tipo: 'genero',
      titulo: 'Pista 2: Género y Estilo',
      contenido: `Catalogada bajo los géneros y estilos: ${mainGenres}.`
    },
    {
      orden: 3,
      tipo: 'colaboradores',
      titulo: 'Pista 3: Álbum y Artista',
      contenido: album
        ? `Pertenece al álbum "${album}" interpretado por ${artist}.`
        : `Canción lanzada por el reconocido artista / grupo ${artist}.`
    },
    {
      orden: 4,
      tipo: 'letra',
      titulo: 'Pista 4: Resumen y Contexto',
      contenido: cleanSummary
    },
    {
      orden: 5,
      tipo: 'audio',
      titulo: 'Pista 5: Muestra de Audio (30s)',
      contenido: previewUrl ? previewUrl : 'Muestra de audio no disponible. ¡Último intento!'
    }
  ];

  return {
    pistes,
    year,
    album,
    previewUrl
  };
}
