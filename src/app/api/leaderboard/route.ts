import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: leaderboard, error } = await supabaseAdmin
      .from('partidas')
      .select('id, puntaje, pistas_usadas, acerto, creado_en, usuarios(nombre, avatar_url, email)')
      .eq('acerto', true)
      .order('puntaje', { ascending: false })
      .order('creado_en', { ascending: false })
      .limit(10);

    if (error) {
      console.warn('[Leaderboard API] Warning Supabase:', error.message);
      return NextResponse.json({
        leaderboard: [
          { id: '1', nombre: 'Melómano99', puntaje: 500, pistas_usadas: 1 },
          { id: '2', nombre: 'BeatMaster', puntaje: 380, pistas_usadas: 2 },
          { id: '3', nombre: 'Rockstar88', puntaje: 240, pistas_usadas: 3 },
        ]
      });
    }

    const formattedLeaderboard = leaderboard.map((item: any, index: number) => ({
      id: item.id || `pos-${index}`,
      nombre: item.usuarios?.nombre || item.usuarios?.email?.split('@')[0] || `Jugador #${index + 1}`,
      avatar: item.usuarios?.avatar_url || null,
      puntaje: item.puntaje,
      pistas_usadas: item.pistas_usadas,
      fecha: item.creado_en
    }));

    return NextResponse.json({ leaderboard: formattedLeaderboard });
  } catch (err) {
    return NextResponse.json({ error: 'Error al cargar leaderboard' }, { status: 500 });
  }
}
