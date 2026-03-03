'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Download, Star, FileText, Scale, LogOut, Menu, X, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedJournal, setSelectedJournal] = useState(searchParams.get('journal') || 'all');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'all');
  const [selectedCourt, setSelectedCourt] = useState(searchParams.get('court') || 'all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const journals = [
    { id: 'pld', name: 'Pakistan Legal Decisions', abbr: 'PLD' },
    { id: 'scmr', name: 'Supreme Court Monthly Review', abbr: 'SCMR' },
    { id: 'mld', name: 'Monthly Law Digest', abbr: 'MLD' },
    { id: 'clc', name: 'Civil Law Cases', abbr: 'CLC' },
    { id: 'ylr', name: 'Yearly Law Reporter', abbr: 'YLR' },
    { id: 'pcrlj', name: 'Pakistan Criminal Law Journal', abbr: 'PCRLJ' },
    { id: 'ptd', name: 'Pakistan Tax Decisions', abbr: 'PTD' },
    { id: 'ptcl', name: 'Pakistan Tax Corporate Law Reports', abbr: 'PTCL' },
    { id: 'plc', name: 'Pakistan Labour Cases', abbr: 'PLC' },
    { id: 'cld', name: 'Corporate Law Decisions', abbr: 'CLD' },
    { id: 'blr', name: 'Banking Law Reports', abbr: 'BLR' },
    { id: 'plj', name: 'Pakistan Law Journal', abbr: 'PLJ' },
    { id: 'ald', name: 'All Law Decisions', abbr: 'ALD' },
    { id: 'nlr', name: 'National Law Reports', abbr: 'NLR' },
    { id: 'lhc', name: 'Lahore High Court Reports', abbr: 'LHC' },
    { id: 'shc', name: 'Sindh High Court Reports', abbr: 'SHC' },
    { id: 'ihc', name: 'Islamabad High Court Reports', abbr: 'IHC' },
    { id: 'pesh', name: 'Peshawar High Court', abbr: 'Pesh.' },
    { id: 'kar', name: 'Karachi (Bench / Registry reference)', abbr: 'Kar.' },

  ];

  const courts = [
    { id: 'all', name: 'All Courts' },
    { id: 'sc', name: 'Supreme Court' },
    { id: 'lhc', name: 'Lahore High Court' },
    { id: 'shc', name: 'Sindh High Court' },
    { id: 'phc', name: 'Peshawar High Court' },
  ];

  useEffect(() => {
    if (searchQuery || selectedJournal !== 'all' || selectedYear !== 'all' || selectedCourt !== 'all') {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          journal: selectedJournal,
          year: selectedYear,
          court: selectedCourt,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

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
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg">
                <BookOpen className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/search" className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <Search className="w-5 h-5" />
                Search
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-red-600">
                <LogOut className="w-5 h-5" />
              </button>
            </nav>

            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-6">
            <button onClick={() => setSidebarOpen(false)} className="mb-6">
              <X className="w-6 h-6" />
            </button>
            <nav className="space-y-4">
              <Link href="/dashboard" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
                <BookOpen className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/search" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
                <Search className="w-5 h-5" />
                Search
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search citations by name, number, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedJournal}
              onChange={(e) => setSelectedJournal(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {journals.map(j => (
                <option key={j.id} value={j.id}>{j.abbr}</option>
              ))}
            </select>

            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              {courts.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Years</option>
              {Array.from({ length: 30 }, (_, i) => 2024 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <p className="text-gray-600 mt-4 text-sm">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-600">Try different keywords or filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map(citation => (
              <div key={citation.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{citation.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-semibold">
                            {citation.journal?.toUpperCase()}
                          </span>
                          <p className="text-blue-600 font-semibold text-sm">{citation.citation_number}</p>
                        </div>
                      </div>
                      {citation.category && (
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                          {citation.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{citation.content?.substring(0, 200)}...</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{citation.court_name}</span>
                      <span>•</span>
                      <span>{citation.year}</span>
                      <span>•</span>
                      <span>{citation.views || 0} views</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/citation/${citation.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        View Full Citation
                      </Link>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-semibold flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
