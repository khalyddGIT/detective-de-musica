import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isCorrectGuess, calculateScore } from '@/lib/game/matching';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cancion_id, respuesta, pistas_usadas = 1, usuario_id } = body;

    if (!cancion_id || respuesta === undefined) {
      return NextResponse.json(
        { error: 'Se requieren cancion_id y respuesta.' },
        { status: 400 }
      );
    }

    let songDetails = {
      titulo: '',
      artista: '',
      album: '',
      preview_url: ''
    };

    if (cancion_id === 'demo-1') {
      songDetails = {
        titulo: 'Blinding Lights',
        artista: 'The Weeknd',
        album: 'After Hours',
        preview_url: 'https://cdns-preview-e.dzcdn.net/stream/c-e771113e00d2b14502b66236b2b73b22-4.mp3'
      };
    } else if (cancion_id === 'demo-2') {
      songDetails = {
        titulo: 'Bohemian Rhapsody',
        artista: 'Queen',
        album: 'A Night at the Opera',
        preview_url: 'https://cdns-preview-8.dzcdn.net/stream/c-88ab8872b226e64c23f77ea63098e986-5.mp3'
      };
    } else {
      const { data: cancion, error } = await supabaseAdmin
        .from('canciones')
        .select('titulo, artista, album, preview_url')
        .eq('id', cancion_id)
        .single();

      if (error || !cancion) {
        return NextResponse.json({ error: 'Canción no encontrada.' }, { status: 404 });
      }

      songDetails = {
        titulo: cancion.titulo,
        artista: cancion.artista,
        album: cancion.album || '',
        preview_url: cancion.preview_url || ''
      };
    }

    const acerto = isCorrectGuess(respuesta, songDetails.titulo);
    const puntaje = calculateScore(pistas_usadas, acerto);

    // Si hay un usuario registrado, guardar la partida en Supabase
    if (usuario_id && !cancion_id.startsWith('demo-')) {
      const { error: matchError } = await supabaseAdmin.from('partidas').insert([
        {
          usuario_id: usuario_id,
          cancion_id: cancion_id,
          pistas_usadas: pistas_usadas,
          acerto: acerto,
          puntaje: puntaje
        }
      ]);

      if (matchError) {
        console.error('[API game/guess] Error al registrar partida en Supabase:', matchError);
      }
    }

    return NextResponse.json({
      acerto,
      puntaje,
      cancion: songDetails
    });
  } catch (err) {
    console.error('[API game/guess] Error:', err);
    return NextResponse.json({ error: 'Error al procesar la respuesta' }, { status: 500 });
  }
}
