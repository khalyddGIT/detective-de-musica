import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: canciones, error } = await supabaseAdmin
      .from('canciones')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ canciones });
  } catch (err) {
    return NextResponse.json({ error: 'Error al obtener canciones' }, { status: 500 });
  }
}
