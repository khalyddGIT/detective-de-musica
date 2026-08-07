import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Pista } from '@/types/game';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { cancion_id, orden } = await req.json();

    if (!cancion_id || !orden) {
      return NextResponse.json({ error: 'Se requieren cancion_id y orden.' }, { status: 400 });
    }

    let songPistas: Pista[] = [];

    if (cancion_id.startsWith('demo-')) {
      if (cancion_id === 'demo-1') {
        songPistas = [
          { orden: 1, tipo: 'anio', titulo: 'Pista 1: Año de lanzamiento', contenido: 'Lanzada a finales de 2019 como sencillo principal.' },
          { orden: 2, tipo: 'genero', titulo: 'Pista 2: Género y Estilo', contenido: 'Synthwave, Synth-pop con influencias de los 80s.' },
          { orden: 3, tipo: 'colaboradores', titulo: 'Pista 3: Álbum y Producción', contenido: 'Producida por Max Martin. Álbum: After Hours.' },
          { orden: 4, tipo: 'letra', titulo: 'Pista 4: Fragmento de letra', contenido: 'I said, ooh, I\'m blinded by the lights...' },
          { orden: 5, tipo: 'audio', titulo: 'Pista 5: Preview de Audio', contenido: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioVideo115/v4/a4/bc/7c/a4bc7c3e-862a-89a3-5c8e-3243f7cbef10/mzaf_15783350172551460309.plus.aac.p.m4a' }
        ];
      } else {
        songPistas = [
          { orden: 1, tipo: 'anio', titulo: 'Pista 1: Década de lanzamiento', contenido: 'Publicada en la década de 1970 (1975).' },
          { orden: 2, tipo: 'genero', titulo: 'Pista 2: Género y Estilo', contenido: 'Rock progresivo, Ópera rock sin estribillo tradicional.' },
          { orden: 3, tipo: 'colaboradores', titulo: 'Pista 3: Álbum y Artista', contenido: 'Escrita por Freddie Mercury para Queen. Álbum: A Night at the Opera.' },
          { orden: 4, tipo: 'letra', titulo: 'Pista 4: Fragmento de letra', contenido: 'Is this the real life? Is this just fantasy?...' },
          { orden: 5, tipo: 'audio', titulo: 'Pista 5: Preview de Audio', contenido: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioVideo116/v4/b8/b6/25/b8b625c2-c0cb-22e7-9d7e-7c5f87b8d4f4/mzaf_16259021235129668478.plus.aac.p.m4a' }
        ];
      }
    } else {
      const { data: cancion, error } = await supabaseAdmin
        .from('canciones')
        .select('pistas')
        .eq('id', cancion_id)
        .single();

      if (error || !cancion) {
        return NextResponse.json({ error: 'Canción no encontrada.' }, { status: 404 });
      }

      songPistas = Array.isArray(cancion.pistas) ? cancion.pistas : JSON.parse(cancion.pistas as any);
    }

    const pistaSolicitada = songPistas.find((p) => p.orden === Number(orden));

    if (!pistaSolicitada) {
      return NextResponse.json({ error: 'No hay más pistas disponibles.' }, { status: 404 });
    }

    return NextResponse.json({ pista: pistaSolicitada });
  } catch (err) {
    console.error('[API game/clue] Error:', err);
    return NextResponse.json({ error: 'Error al obtener la pista.' }, { status: 500 });
  }
}
