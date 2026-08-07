import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Pista } from '@/types/game';

export const dynamic = 'force-dynamic';

const FALLBACK_SONGS = [
  {
    id: 'demo-1',
    titulo: 'Blinding Lights',
    artista: 'The Weeknd',
    album: 'After Hours',
    anio: 2019,
    preview_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioVideo115/v4/a4/bc/7c/a4bc7c3e-862a-89a3-5c8e-3243f7cbef10/mzaf_15783350172551460309.plus.aac.p.m4a',
    pistas: [
      { orden: 1, tipo: 'anio', titulo: 'Pista 1: Año de lanzamiento', contenido: 'Lanzada a finales de 2019 como sencillo principal de un álbum aclamado.' },
      { orden: 2, tipo: 'genero', titulo: 'Pista 2: Género y Estilo', contenido: 'Synthwave, Synth-pop con influencias de los 80s.' },
      { orden: 3, tipo: 'colaboradores', titulo: 'Pista 3: Álbum y Producción', contenido: 'Producida por Max Martin y Oscar Holter. Álbum: After Hours.' },
      { orden: 4, tipo: 'letra', titulo: 'Pista 4: Fragmento de letra', contenido: 'I said, ooh, I\'m blinded by the lights / No, I can\'t sleep until I feel your touch...' },
      { orden: 5, tipo: 'audio', titulo: 'Pista 5: Preview de Audio (30s)', contenido: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioVideo115/v4/a4/bc/7c/a4bc7c3e-862a-89a3-5c8e-3243f7cbef10/mzaf_15783350172551460309.plus.aac.p.m4a' }
    ]
  },
  {
    id: 'demo-2',
    titulo: 'Bohemian Rhapsody',
    artista: 'Queen',
    album: 'A Night at the Opera',
    anio: 1975,
    preview_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioVideo116/v4/b8/b6/25/b8b625c2-c0cb-22e7-9d7e-7c5f87b8d4f4/mzaf_16259021235129668478.plus.aac.p.m4a',
    pistas: [
      { orden: 1, tipo: 'anio', titulo: 'Pista 1: Década de lanzamiento', contenido: 'Publicada en la década de 1970 (1975).' },
      { orden: 2, tipo: 'genero', titulo: 'Pista 2: Género y Estilo', contenido: 'Rock progresivo, Ópera rock sin estribillo tradicional.' },
      { orden: 3, tipo: 'colaboradores', titulo: 'Pista 3: Álbum y Artista', contenido: 'Escrita por Freddie Mercury para Queen. Álbum: A Night at the Opera.' },
      { orden: 4, tipo: 'letra', titulo: 'Pista 4: Fragmento de letra', contenido: 'Is this the real life? Is this just fantasy? Caught in a landslide...' },
      { orden: 5, tipo: 'audio', titulo: 'Pista 5: Preview de Audio (30s)', contenido: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioVideo116/v4/b8/b6/25/b8b625c2-c0cb-22e7-9d7e-7c5f87b8d4f4/mzaf_16259021235129668478.plus.aac.p.m4a' }
    ]
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') || 'aleatorio';

    let filteredFallback = [...FALLBACK_SONGS];
    if (mode === 'clasicos') {
      filteredFallback = FALLBACK_SONGS.filter((s) => s.anio && s.anio <= 1999);
    } else if (mode === 'modernos') {
      filteredFallback = FALLBACK_SONGS.filter((s) => s.anio && s.anio >= 2010);
    }

    if (filteredFallback.length === 0) {
      filteredFallback = [...FALLBACK_SONGS];
    }

    let songObj = filteredFallback[Math.floor(Math.random() * filteredFallback.length)];

    // Consultar Supabase
    try {
      let query = supabaseAdmin.from('canciones').select('id, pistas, anio');
      if (mode === 'clasicos') {
        query = query.lte('anio', 1999);
      } else if (mode === 'modernos') {
        query = query.gte('anio', 2010);
      }

      const { data: canciones } = await query;
      if (canciones && canciones.length > 0) {
        songObj = canciones[Math.floor(Math.random() * canciones.length)] as any;
      }
    } catch (dbErr) {
      console.warn('[API game/random] Supabase fallback to demo songs:', dbErr);
    }

    const pistasRaw = songObj.pistas;
    const pistas: Pista[] = Array.isArray(pistasRaw)
      ? pistasRaw
      : typeof pistasRaw === 'string'
      ? JSON.parse(pistasRaw)
      : [];

    const primeraPista = pistas.find((p) => p.orden === 1) || pistas[0] || {
      orden: 1,
      tipo: 'anio',
      titulo: 'Pista 1: Año',
      contenido: 'Año de lanzamiento no especificado'
    };

    return NextResponse.json({
      cancion_id: songObj.id,
      total_pistas: pistas.length || 5,
      primera_pista: primeraPista,
    });
  } catch (err) {
    console.error('[API game/random] Error grave, enviando demo fallback:', err);
    const fallbackObj = FALLBACK_SONGS[0];
    return NextResponse.json({
      cancion_id: fallbackObj.id,
      total_pistas: 5,
      primera_pista: fallbackObj.pistas[0],
    });
  }
}
