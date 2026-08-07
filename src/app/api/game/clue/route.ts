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
          { orden: 5, tipo: 'audio', titulo: 'Pista 5: Preview de Audio', contenido: 'https://cdns-preview-e.dzcdn.net/stream/c-e771113e00d2b14502b66236b2b73b22-4.mp3' }
        ];
      } else {
        songPistas = [
          { orden: 1, tipo: 'anio', titulo: 'Pista 1: Década de lanzamiento', contenido: 'Publicada en la década de 1970 (1975).' },
          { orden: 2, tipo: 'genero', titulo: 'Pista 2: Género y Estilo', contenido: 'Rock progresivo, Ópera rock sin estribillo tradicional.' },
          { orden: 3, tipo: 'colaboradores', titulo: 'Pista 3: Álbum y Artista', contenido: 'Escrita por Freddie Mercury para Queen. Álbum: A Night at the Opera.' },
          { orden: 4, tipo: 'letra', titulo: 'Pista 4: Fragmento de letra', contenido: 'Is this the real life? Is this just fantasy?...' },
          { orden: 5, tipo: 'audio', titulo: 'Pista 5: Preview de Audio', contenido: 'https://cdns-preview-8.dzcdn.net/stream/c-88ab8872b226e64c23f77ea63098e986-5.mp3' }
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
