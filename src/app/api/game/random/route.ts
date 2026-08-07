import { NextResponse } from 'next/server';
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
    preview_url: 'https://cdns-preview-e.dzcdn.net/stream/c-e771113e00d2b14502b66236b2b73b22-4.mp3',
    pistas: [
      { orden: 1, tipo: 'anio', titulo: 'Pista 1: Año de lanzamiento', contenido: 'Lanzada a finales de 2019 como sencillo principal.' },
      { orden: 2, tipo: 'genero', titulo: 'Pista 2: Género y Estilo', contenido: 'Synthwave, Synth-pop con influencias de los 80s.' },
      { orden: 3, tipo: 'colaboradores', titulo: 'Pista 3: Álbum y Producción', contenido: 'Producida por Max Martin. Álbum: After Hours.' },
      { orden: 4, tipo: 'letra', titulo: 'Pista 4: Fragmento de letra', contenido: 'I said, ooh, I\'m blinded by the lights...' },
      { orden: 5, tipo: 'audio', titulo: 'Pista 5: Preview de Audio', contenido: 'https://cdns-preview-e.dzcdn.net/stream/c-e771113e00d2b14502b66236b2b73b22-4.mp3' }
    ]
  },
  {
    id: 'demo-2',
    titulo: 'Bohemian Rhapsody',
    artista: 'Queen',
    album: 'A Night at the Opera',
    anio: 1975,
    preview_url: 'https://cdns-preview-8.dzcdn.net/stream/c-88ab8872b226e64c23f77ea63098e986-5.mp3',
    pistas: [
      { orden: 1, tipo: 'anio', titulo: 'Pista 1: Década de lanzamiento', contenido: 'Publicada en la década de 1970 (1975).' },
      { orden: 2, tipo: 'genero', titulo: 'Pista 2: Género y Estilo', contenido: 'Rock progresivo, Ópera rock sin estribillo tradicional.' },
      { orden: 3, tipo: 'colaboradores', titulo: 'Pista 3: Álbum y Artista', contenido: 'Escrita por Freddie Mercury para Queen. Álbum: A Night at the Opera.' },
      { orden: 4, tipo: 'letra', titulo: 'Pista 4: Fragmento de letra', contenido: 'Is this the real life? Is this just fantasy?...' },
      { orden: 5, tipo: 'audio', titulo: 'Pista 5: Preview de Audio', contenido: 'https://cdns-preview-8.dzcdn.net/stream/c-88ab8872b226e64c23f77ea63098e986-5.mp3' }
    ]
  }
];

export async function GET() {
  try {
    const { data: canciones, error } = await supabaseAdmin
      .from('canciones')
      .select('id, pistas');

    let songObj;

    if (error || !canciones || canciones.length === 0) {
      songObj = FALLBACK_SONGS[Math.floor(Math.random() * FALLBACK_SONGS.length)];
    } else {
      const selected = canciones[Math.floor(Math.random() * canciones.length)];
      songObj = selected;
    }

    const pistas: Pista[] = Array.isArray(songObj.pistas) ? songObj.pistas : JSON.parse(songObj.pistas as any);
    const primeraPista = pistas.find((p) => p.orden === 1) || pistas[0];

    return NextResponse.json({
      cancion_id: songObj.id,
      total_pistas: pistas.length,
      primera_pista: primeraPista,
    });
  } catch (err) {
    console.error('[API game/random] Error:', err);
    return NextResponse.json({ error: 'Error al iniciar partida al azar' }, { status: 500 });
  }
}
