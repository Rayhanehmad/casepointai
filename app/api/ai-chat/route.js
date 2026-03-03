import { NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { message, userId } = await request.json();

    const { data: citations } = await supabase
      .from('citations')
      .select('title, citation_number, content, category')
      .textSearch('content', message)
      .limit(3);

    const context = citations
      ?.map(c => `${c.title} (${c.citation_number}) - ${c.category}\n${c.content.substring(0, 500)}`)
      .join('\n\n') || 'No relevant citations found.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a Pakistani legal research assistant. Answer questions using the provided case law citations. Be precise, cite sources, and provide counter-arguments when relevant.`,
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${message}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const response = completion.choices[0].message.content;
    const citationNumbers = citations?.map(c => c.citation_number) || [];

    if (userId) {
      await supabase.from('chat_history').insert([
        {
          user_id: userId,
          message,
          response,
          citations: citationNumbers,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      response,
      citations: citationNumbers,
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
