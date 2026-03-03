'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Download, Star, Bot, TrendingUp, Scale, LogOut, ArrowLeft, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CitationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [citation, setCitation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCitation();
  }, [params.id]);

  const fetchCitation = async () => {
    try {
      const { data, error } = await supabase
        .from('citations')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;

      setCitation(data);

      // Increment views
      await supabase
        .from('citations')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', params.id);
    } catch (error) {
      console.error('Error fetching citation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Scale className="w-16 h-16 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading citation...</p>
        </div>
      </div>
    );
  }

  if (!citation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Citation not found</h2>
          <Link href="/search" className="text-blue-600 hover:text-blue-700">
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-xl">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">CasePointAI</h1>
                <p className="text-xs text-gray-500">Legal Research</p>
              </div>
            </Link>
            
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-600">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Results
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold">
                {citation.journal?.toUpperCase()}
              </span>
              {citation.category && (
                <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                  {citation.category}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4">{citation.title}</h1>
            <div className="flex gap-6 text-blue-100">
              <span className="font-semibold">{citation.citation_number}</span>
              <span>•</span>
              <span>{citation.court_name}</span>
              <span>•</span>
              <span>{citation.year}</span>
              <span>•</span>
              <span>{citation.views} views</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition font-semibold flex items-center gap-2">
                <Star className="w-5 h-5" />
                Save
              </button>
              <button className="bg-purple-100 text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-200 transition font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Ask AI
              </button>
            </div>

            {/* Keywords */}
            {citation.keywords && citation.keywords.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Keywords</h3>
                <div className="flex gap-2 flex-wrap">
                  {citation.keywords.map((keyword, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Summary</h3>
              <p className="text-gray-700 leading-relaxed">{citation.content}</p>
            </div>

            {/* Full Judgment */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-800 mb-4">Full Judgment</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {citation.full_content || citation.content}
                </p>
              </div>
            </div>

            {/* Counter Arguments CTA */}
            <div className="mt-6 bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Find Counter Arguments
              </h3>
              <p className="text-gray-700 mb-4">
                AI can help you find opposing precedents and distinguishing factors for this case.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                Find Opposing Cases
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
