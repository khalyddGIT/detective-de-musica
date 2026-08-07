import { NextRequest, NextResponse } from 'next/server';
import { fetchLastFmTrackInfo } from '@/lib/services/lastfm';
import { fetchAudioPreview } from '@/lib/services/audioPreview';
import { buildSongClues } from '@/lib/services/clueBuilder';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { artist, track, year: inputYear, saveToDb = true } = body;

    if (!artist || !track) {
      return NextResponse.json(
        { error: 'Se requieren los campos "artist" y "track".' },
        { status: 400 }
      );
    }

    const [lastfmData, audioData] = await Promise.all([
      fetchLastFmTrackInfo(artist, track),
      fetchAudioPreview(artist, track),
    ]);

    const title = lastfmData?.title || track;
    const finalArtist = lastfmData?.artist || artist;
    const { pistes, year, album, previewUrl } = buildSongClues(
      finalArtist,
      title,
      lastfmData,
      audioData,
      inputYear
    );

    const songData = {
      titulo: title,
      artista: finalArtist,
      album: album,
      anio: year,
      pistas: pistes,
      preview_url: previewUrl,
    };

    if (saveToDb) {
      const { data, error } = await supabaseAdmin
        .from('canciones')
        .insert([songData])
        .select()
        .single();

      if (error) {
        console.error('[API fetch-and-generate] Error al insertar en Supabase:', error);
        return NextResponse.json(
          { error: 'Error guardando la canción en la base de datos.', details: error.message, generatedData: songData },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, song: data });
    }

    return NextResponse.json({ success: true, song: songData });
  } catch (error) {
    console.error('[API fetch-and-generate] Excepción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la canción.' },
      { status: 500 }
    );
  }
}
