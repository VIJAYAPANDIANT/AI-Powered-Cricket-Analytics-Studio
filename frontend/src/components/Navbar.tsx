'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { Sun, Moon, LogIn, LogOut, ShieldAlert, Award, User, RefreshCw, X } from 'lucide-react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const { user, logout, login, register, isAuthenticated } = useAuth();
  const { backendOnline, refreshData, loading } = useAnalytics();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Auth modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-force');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-force');
      document.documentElement.classList.add('dark');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isRegister) {
        await register(username, email, password);
        setIsRegister(false);
        setAuthError('Account created! Please log in.');
      } else {
        await login(email, password);
        setIsModalOpen(false);
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="IPL InsightX Logo" className="h-7 w-7 object-contain rounded-md" />
            <Link href="/" className="text-xl font-bold tracking-tight text-gradient">
              IPL InsightX
            </Link>
          </div>

          {/* Right menu bar */}
          <div className="flex items-center space-x-4">
            {/* Backend Health Badge */}
            <div className="flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-xs border bg-card-border/10 border-card-border">
              <span className={`h-2.5 w-2.5 rounded-full ${backendOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
              <span className="hidden sm:inline text-xs text-foreground/80 font-medium">
                {backendOnline ? 'Server: Connected' : 'Server: Offline'}
              </span>
              <button 
                onClick={refreshData} 
                disabled={loading} 
                title="Refresh analytical cache"
                className="ml-1 text-foreground/60 hover:text-emerald-500 disabled:animate-spin"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>

            {/* Light/Dark Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-foreground/60 hover:bg-card-border/20 hover:text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link href="/profile" className="hidden sm:flex flex-col items-end text-xs hover:opacity-85">
                  <span className="font-semibold text-foreground">{user?.username}</span>
                  <span className="text-xxs text-foreground/60">{user?.email}</span>
                </Link>
                <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-600/35 hover:scale-105 transition-all">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 rounded-lg bg-accent/10 border border-accent/20 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthError('');
                  setIsModalOpen(true);
                }}
                className="flex items-center space-x-1.5 rounded-lg bg-primary hover:bg-primary/95 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary-glow"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Access Studio</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl glass-card border border-card-border p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-foreground/60 hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h2 className="text-xl font-extrabold text-foreground mb-1 tracking-tight">
              {isRegister ? 'Create Studio Account' : 'Authenticate Account'}
            </h2>
            <p className="text-xs text-foreground/60 mb-6">
              {isRegister ? 'Register to manage datasets and save report parameters.' : 'Sign in to access secure dataset upload & ingestion controllers.'}
            </p>

            {authError && (
              <div className="mb-4 flex items-center space-x-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-foreground/70 mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="virat_king_18"
                    className="w-full rounded-lg bg-black/10 border border-card-border px-3.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coach@insightx.com"
                  className="w-full rounded-lg bg-black/10 border border-card-border px-3.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1.5">Secure Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-black/10 border border-card-border px-3.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary hover:bg-primary/95 text-sm font-bold text-white py-2.5 mt-2 transition-all shadow-md shadow-primary-glow"
              >
                {isRegister ? 'Sign Up' : 'Authenticate Credentials'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-foreground/60 border-t border-card-border pt-4">
              {isRegister ? (
                <span>
                  Already have an account?{' '}
                  <button onClick={() => setIsRegister(false)} className="font-bold text-primary hover:underline">
                    Log In
                  </button>
                </span>
              ) : (
                <span>
                  New to InsightX?{' '}
                  <button onClick={() => setIsRegister(true)} className="font-bold text-primary hover:underline">
                    Create Account
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Navbar;
