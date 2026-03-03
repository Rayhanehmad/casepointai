import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { query, journal, year, court } = await request.json();

    let supabaseQuery = supabase
      .from('citations')
      .select('*')
      .eq('status', 'active');

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,citation_number.ilike.%${query}%,content.ilike.%${query}%`
      );
    }

    if (journal && journal !== 'all') {
      supabaseQuery = supabaseQuery.eq('journal', journal);
    }

    if (year && year !== 'all') {
      supabaseQuery = supabaseQuery.eq('year', year);
    }

    if (court && court !== 'all') {
      supabaseQuery = supabaseQuery.eq('court', court);
    }

    const { data, error } = await supabaseQuery.limit(50);

    if (error) throw error;

    return NextResponse.json({ success: true, results: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
