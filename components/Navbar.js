'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Home, Search, Bot, LogOut, Menu, X, BookOpen, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function Navbar({ user, isAdmin = false }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
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
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition">
                <Home className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/search" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition">
                <Search className="w-5 h-5" />
                Search
              </Link>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                <Bot className="w-5 h-5" />
                AI Assistant
              </button>
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition">
                  <Shield className="w-5 h-5" />
                  Admin
                </Link>
              )}
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
                <Home className="w-5 h-5" />
                Dashboard
              </Link>
              <Link href="/search" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">
                <Search className="w-5 h-5" />
                Search
              </Link>
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600">
                  <Shield className="w-5 h-5" />
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-red-600">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
