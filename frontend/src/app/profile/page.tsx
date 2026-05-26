'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { User, Shield, Mail, Calendar, Key, Bookmark, Download, Trash2, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { setFilters } = useAnalytics();

  // Mock list of saved reports under this profile
  const savedReports = [
    { id: 1, name: 'Mumbai Indians Wankhede Analysis', season: '2024', team: 'Mumbai Indians', venue: 'Wankhede Stadium', date: '2026-05-25' },
    { id: 2, name: 'CSK Chepauk Defensive Spin bias', season: '2023', team: 'Chennai Super Kings', venue: 'MA Chidambaram Stadium', date: '2026-05-22' }
  ];

  const handleApplyFilter = (rep: typeof savedReports[0]) => {
    setFilters({
      season: rep.season,
      team: rep.team,
      venue: rep.venue
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto text-center py-16">
        <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 p-4 text-primary mb-4 shadow-[0_0_15px_rgba(5,150,105,0.15)] animate-bounce">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">Access Control Protection</h2>
        <p className="text-xs text-foreground/60 mt-1 mb-6">
          This portal contains sensitive profile specifications. Please authenticate your credentials in the studio co-panel.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-primary hover:bg-primary/95 text-xs font-bold text-white px-5 py-2.5 shadow-md shadow-primary-glow"
        >
          Return to Home Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto w-full py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">User Profile Center</h1>
        <p className="text-xs text-foreground/50">Manage credentials, saved query parameters, and analytical history logs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 rounded-xl glass-card p-5 space-y-4">
          <div className="flex flex-col items-center text-center py-4 border-b border-card-border/50">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-primary mb-3 text-2xl font-black">
              {user?.username.slice(0, 2).toUpperCase()}
            </div>
            <h2 className="text-base font-extrabold text-foreground tracking-tight">{user?.username}</h2>
            <span className="inline-flex items-center space-x-1 mt-1 rounded bg-secondary-glow/10 border border-secondary/20 px-2 py-0.5 text-xxs font-bold text-secondary">
              <Shield className="h-3 w-3 mr-0.5" />
              <span>{user?.role ? user.role.toUpperCase() : 'USER'}</span>
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center space-x-2.5 text-foreground/80 font-medium">
              <Mail className="h-4.5 w-4.5 text-foreground/40 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2.5 text-foreground/80 font-medium">
              <Calendar className="h-4.5 w-4.5 text-foreground/40 shrink-0" />
              <span>Joined: May 26, 2026</span>
            </div>
          </div>
        </div>

        {/* Saved Filters & Logs */}
        <div className="md:col-span-2 space-y-6">
          {/* Saved Reports / Scopes */}
          <div className="rounded-xl glass-card p-5">
            <div className="flex items-center space-x-2 mb-4 border-b border-card-border pb-3">
              <Bookmark className="h-5 w-5 text-secondary" />
              <div>
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">Saved Analytical Scopes</h3>
                <p className="text-xxs text-foreground/50">Quick-launch saved filter parameters</p>
              </div>
            </div>

            <div className="space-y-3">
              {savedReports.map((rep) => (
                <div 
                  key={rep.id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-lg bg-black/10 border border-card-border hover:border-primary/20 transition-all gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground block">{rep.name}</span>
                    <span className="text-xxs text-foreground/50 font-medium block">
                      Scope: Season {rep.season}  •  {rep.team}  •  {rep.venue}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <Link
                      href="/dashboard"
                      onClick={() => handleApplyFilter(rep)}
                      className="flex items-center space-x-1 rounded bg-primary-glow/10 border border-primary/20 hover:bg-primary/20 text-xxs font-bold text-primary px-3 py-1.5 transition-all cursor-pointer"
                    >
                      <span>Load Studio</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <button className="rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xxs font-bold text-red-400 p-1.5 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security details (Placeholder) */}
          <div className="rounded-xl glass-card p-5">
            <div className="flex items-center space-x-2 mb-4 border-b border-card-border pb-3">
              <Key className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">Security Credentials</h3>
                <p className="text-xxs text-foreground/50">Modify access passwords</p>
              </div>
            </div>

            <form className="space-y-4 text-xs" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-foreground/75 font-semibold mb-1.5">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg bg-black/10 border border-card-border px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-foreground/75 font-semibold mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg bg-black/10 border border-card-border px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button className="rounded-lg bg-primary hover:bg-primary/95 text-xxs font-bold text-white px-4 py-2 shadow-md shadow-primary-glow">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
