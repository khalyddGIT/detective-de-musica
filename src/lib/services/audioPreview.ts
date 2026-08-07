export interface AudioPreviewData {
  previewUrl: string | null;
  releaseYear: number | null;
  albumName: string | null;
  genreName: string | null;
}

export async function fetchAudioPreview(artist: string, track: string): Promise<AudioPreviewData> {
  try {
    // 1. Intentar con iTunes Search API (gratuita, rápida, sin API Key)
    const query = `${artist} ${track}`;
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=3`;
    
    const res = await fetch(itunesUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        const releaseYear = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
        
        return {
          previewUrl: item.previewUrl || null,
          releaseYear: releaseYear && !isNaN(releaseYear) ? releaseYear : null,
          albumName: item.collectionName || null,
          genreName: item.primaryGenreName || null,
        };
      }
    }

    // 2. Intentar como fallback con Deezer API
    const deezerUrl = `https://api.deezer.com/search?q=${encodeURIComponent(`artist:"${artist}" track:"${track}"`)}`;
    const deezerRes = await fetch(deezerUrl);
    if (deezerRes.ok) {
      const data = await deezerRes.json();
      if (data.data && data.data.length > 0) {
        const item = data.data[0];
        return {
          previewUrl: item.preview || null,
          releaseYear: null,
          albumName: item.album?.title || null,
          genreName: null,
        };
      }
    }
  } catch (error) {
    console.error('[AudioPreview Service] Error obteniendo muestra de audio:', error);
  }

  return {
    previewUrl: null,
    releaseYear: null,
    albumName: null,
    genreName: null,
  };
}
