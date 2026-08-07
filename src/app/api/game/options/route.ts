import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

const DEMO_DISTRACTORS: Record<string, string[]> = {
  'demo-1': ['Blinding Lights', 'Save Your Tears', 'Starboy', 'The Hills'],
  'demo-2': ['Bohemian Rhapsody', 'Don\'t Stop Me Now', 'We Will Rock You', 'Another One Bites the Dust']
};

export async function POST(req: NextRequest) {
  try {
    const { cancion_id } = await req.json();

    if (!cancion_id) {
      return NextResponse.json({ error: 'Se requiere cancion_id' }, { status: 400 });
    }

    if (cancion_id.startsWith('demo-')) {
      const choices = DEMO_DISTRACTORS[cancion_id] || ['Opción A', 'Opción B', 'Opción C', 'Opción D'];
      // Mezclar opciones
      const shuffled = [...choices].sort(() => Math.random() - 0.5);
      return NextResponse.json({ opciones: shuffled });
    }

    // Obtener la canción correcta
    const { data: targetSong } = await supabaseAdmin
      .from('canciones')
      .select('titulo')
      .eq('id', cancion_id)
      .single();

    if (!targetSong) {
      return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 });
    }

    // Obtener otras 3 canciones para los distractores
    const { data: otherSongs } = await supabaseAdmin
      .from('canciones')
      .select('titulo')
      .neq('id', cancion_id)
      .limit(10);

    const distractors = (otherSongs || [])
      .map((s) => s.titulo)
      .filter((t) => t !== targetSong.titulo);

    // Fallbacks si hay pocas canciones en la BD
    const fallbackTitles = ['Hotel California', 'Shape of You', 'Smooth Criminal', 'Rolling in the Deep', 'Smells Like Teen Spirit'];
    while (distractors.length < 3) {
      const extra = fallbackTitles.pop();
      if (extra && extra !== targetSong.titulo && !distractors.includes(extra)) {
        distractors.push(extra);
      }
    }

    const selectedDistractors = distractors.slice(0, 3);
    const allOptions = [targetSong.titulo, ...selectedDistractors].sort(() => Math.random() - 0.5);

    return NextResponse.json({ opciones: allOptions });
  } catch (err) {
    console.error('[API game/options] Error:', err);
    return NextResponse.json({ error: 'Error al generar opciones de comodín' }, { status: 500 });
  }
}
