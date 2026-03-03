'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, BookOpen, FileText, Newspaper, TrendingUp, Bot, LogOut, Scale, Menu, X, Gavel } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalCitations: 0,
    totalStatutes: 0,
    totalEssays: 0,
    userSearches: 0
  });
  const [popularCitations, setPopularCitations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const journals = [
    { id: 'pld', name: 'Pakistan Law Decisions', abbr: 'PLD' },
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

  useEffect(() => {
    checkUser();
    fetchStats();
    fetchPopularCitations();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    } else {
      setUser(user);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: citationsCount } = await supabase
        .from('citations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: statutesCount } = await supabase
        .from('statutes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setStats({
        totalCitations: citationsCount || 0,
        totalStatutes: statutesCount || 0,
        totalEssays: 0,
        userSearches: 142
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPopularCitations = async () => {
    try {
      const { data, error } = await supabase
        .from('citations')
        .select('*')
        .eq('status', 'active')
        .order('views', { ascending: false })
        .limit(4);

      if (data) setPopularCitations(data);
    } catch (error) {
      console.error('Error fetching popular citations:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
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
          <p className="text-gray-600">Loading...</p>
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
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-xl">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">CasePointAI</h1>
                <p className="text-xs text-gray-500">Legal Research</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <BookOpen className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/search" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg">
                <Search className="w-5 h-5" />
                Search
              </Link>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <Bot className="w-5 h-5" />
                AI Assistant
              </button>
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
              <Link href="/dashboard" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
                <BookOpen className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/search" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
                <Search className="w-5 h-5" />
                Search
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome back, {user?.user_metadata?.full_name || 'User'}!</h1>
          <p className="text-xl text-blue-100 mb-6">Your AI-powered legal research companion</p>
          
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by case name, citation, statute, or legal issue..."
              className="w-full pl-14 pr-4 py-4 text-lg rounded-xl border-0 text-gray-800 focus:ring-4 focus:ring-blue-300"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <Newspaper className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-gray-600 text-sm mb-1">Total Citations</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalCitations}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <BookOpen className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-gray-600 text-sm mb-1">Statutes</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalStatutes}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <FileText className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-gray-600 text-sm mb-1">Essays</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalEssays}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <Search className="w-8 h-8 text-orange-600 mb-3" />
            <p className="text-gray-600 text-sm mb-1">Your Searches</p>
            <p className="text-3xl font-bold text-gray-800">{stats.userSearches}</p>
          </div>
        </div>

        {/* Browse by Journal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              Browse by Journal
            </h3>
            <div className="space-y-2">
              {journals.map(journal => (
                <Link
                  key={journal.id}
                  href={`/search?journal=${journal.id}`}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                >
                  <span className="font-semibold text-blue-600">{journal.abbr}</span> - {journal.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Quick Access
            </h3>
            <div className="space-y-2">
              <Link href="/search?category=constitutional" className="block px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                Constitutional Law
              </Link>
              <Link href="/search?category=criminal" className="block px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                Criminal Law
              </Link>
              <Link href="/search?category=civil" className="block px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                Civil Law
              </Link>
              <Link href="/search?category=tax" className="block px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                Tax Law
              </Link>
              <Link href="/search?category=labour" className="block px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
                Labour Law
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-gray-800">Constitution of Pakistan</p>
                <p className="text-gray-500 text-xs">Viewed • 2 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">PPC Section 302</p>
                <p className="text-gray-500 text-xs">Searched • 5 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-800">Tax Law Cases</p>
                <p className="text-gray-500 text-xs">Downloaded • 1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Citations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Citations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularCitations.map(citation => (
              <Link
                key={citation.id}
                href={`/citation/${citation.id}`}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-6 h-6 text-blue-600" />
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-semibold">
                      {citation.journal?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{citation.views} views</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{citation.title}</h3>
                <p className="text-sm text-blue-600 font-semibold mb-2">{citation.citation_number}</p>
                <p className="text-sm text-gray-600 mb-3">{citation.content?.substring(0, 120)}...</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{citation.court_name}</span>
                  <span>•</span>
                  <span>{citation.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* AI Assistant CTA */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Try Our AI Assistant</h3>
              <p className="text-purple-100">Get instant answers, find counter-arguments, analyze cases</p>
            </div>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Start Chat
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
