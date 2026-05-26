'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, BarChart3, FileText, Info, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Home Studio', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Deep Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Reports Desk', href: '/reports', icon: FileText },
    { name: 'About Studio', href: '/about', icon: Info },
  ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Trigger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg md:hidden border border-emerald-500/20"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-64 bg-background border-r border-card-border p-4 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="flex items-center space-x-2 pt-2 px-2">
                <img src="/logo.png" alt="IPL InsightX Logo" className="h-5 w-5 object-contain rounded" />
                <div className="text-sm font-bold text-gradient tracking-wider uppercase opacity-80">IPL InsightX</div>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-white font-bold'
                          : 'text-foreground/75 hover:bg-card-border/20 hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="text-xxs text-foreground/40 text-center pb-4 border-t border-card-border/50 pt-4">
              IPL InsightX Studio v1.0
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between border-r border-card-border bg-background transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        } shrink-0`}
      >
        <div className="flex flex-col">
          {/* Header spacer or collapse toggler */}
          <div className={`flex h-12 items-center ${collapsed ? 'justify-center' : 'justify-between pl-3 pr-2'} border-b border-card-border/50`}>
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <img src="/logo.png" alt="IPL InsightX Logo" className="h-5 w-5 object-contain rounded" />
                <span className="text-xs font-bold text-gradient tracking-wider uppercase">IPL InsightX</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="rounded-lg p-1.5 text-foreground/50 hover:bg-card-border/25 hover:text-foreground"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-white font-bold shadow-md shadow-primary-glow/50'
                      : 'text-foreground/70 hover:bg-card-border/20 hover:text-foreground'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="ml-3 font-semibold">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-card-border/50">
          {!collapsed ? (
            <div className="rounded-lg bg-card-border/10 border border-card-border/30 p-2.5 text-center">
              <span className="text-xxs font-medium text-foreground/50 block">AI CO-PILOT ACTIVE</span>
              <span className="text-xs font-bold text-emerald-500">SYSTEM STABLE</span>
            </div>
          ) : (
            <div className="flex justify-center text-emerald-500 font-bold text-xs" title="AI co-pilot online">
              ●
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
