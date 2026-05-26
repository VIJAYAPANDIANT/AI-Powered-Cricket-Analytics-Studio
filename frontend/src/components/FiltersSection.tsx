'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAnalytics } from '../context/AnalyticsContext';
import {
  Filter, RotateCcw, Calendar, Users,
  Trophy, Target, MapPin, ChevronDown, Check,
} from 'lucide-react';

/* ─── Portal Dropdown ─────────────────────────────────────────────────────── */
interface DropdownProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  icon, label, value, options, allLabel, onChange, disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* Compute portal position from trigger rect */
  const openDropdown = () => {
    if (disabled) return;
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: r.bottom + 6,
        left: r.left,
        width: Math.max(r.width, 180),
      });
    }
    setOpen(true);
  };

  /* Close on outside click or scroll */
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const allOptions = [
    { value: 'all', label: allLabel },
    ...options.map(o => ({ value: o, label: o })),
  ];
  const current = allOptions.find(o => o.value === value) ?? allOptions[0];

  const handleSelect = useCallback((val: string) => {
    onChange(val);
    setOpen(false);
  }, [onChange]);

  /* Portal panel — stops propagation so the outside-click handler doesn't fire
     on the panel itself */
  const panel = open && typeof window !== 'undefined'
    ? createPortal(
        <div
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: coords.width,
            zIndex: 99999,
            background: 'linear-gradient(145deg, #0b1520 0%, #070e18 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '14px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.85), 0 0 0 1px rgba(5,150,105,0.14)',
            overflow: 'hidden',
          }}
          role="listbox"
          aria-label={label}
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
            <span className="text-emerald-400/80 shrink-0">{icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {label}
            </span>
          </div>

          {/* Options */}
          <div className="max-h-56 overflow-y-auto scrollbar-thin py-1">
            {allOptions.map(opt => {
              const isSel = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSel}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium
                    text-left transition-all duration-150 group
                    ${isSel
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}
                  `}
                >
                  {/* Check circle */}
                  <span className={`
                    h-4 w-4 shrink-0 flex items-center justify-center rounded-full
                    transition-all duration-150
                    ${isSel
                      ? 'bg-emerald-500/20 border border-emerald-500/50'
                      : 'border border-white/10 group-hover:border-white/20'}
                  `}>
                    {isSel && <Check className="h-2.5 w-2.5 text-emerald-400" />}
                  </span>

                  {/* Label */}
                  <span className="flex-1 truncate">
                    {opt.value === 'all'
                      ? <span className="text-slate-500">{opt.label}</span>
                      : opt.label}
                  </span>

                  {/* Active pip */}
                  {isSel && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.85)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={openDropdown}
        className={`
          w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold
          border transition-all duration-200 select-none text-slate-200
          ${open
            ? 'bg-[#0d1a12] border-emerald-500/60 shadow-[0_0_16px_rgba(5,150,105,0.25)]'
            : 'bg-[#0a0f16] border-white/8 hover:border-emerald-500/30 hover:bg-[#0d1a12]'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="shrink-0 text-emerald-400/70">{icon}</span>
        <span className="flex-1 text-left truncate">
          {current.value === 'all'
            ? <span className="text-slate-400">{allLabel}</span>
            : <span className="text-slate-100">{current.label}</span>}
        </span>
        <ChevronDown className={`
          h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-200
          ${open ? 'rotate-180 text-emerald-400' : ''}
        `} />
      </button>

      {/* Portal panel */}
      {panel}
    </div>
  );
};

/* ─── FiltersSection ──────────────────────────────────────────────────────── */
export const FiltersSection: React.FC = () => {
  const { filters, setFilters, resetFilters, filterOptions, loading } = useAnalytics();

  const handleChange = useCallback((key: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const next = { ...prev };
      if (!value || value === 'all') delete next[key];
      else next[key] = value;
      return next;
    });
  }, [setFilters]);

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div
      className="rounded-2xl mb-6 p-4 border border-white/6"
      style={{
        background: 'linear-gradient(135deg,rgba(10,16,24,0.95) 0%,rgba(7,12,20,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

        {/* Title */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-1.5 text-emerald-400">
            <Filter className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 tracking-tight">Scope Filters</h3>
            <p className="text-[10px] text-slate-500 font-medium">Refine analytics dynamically</p>
          </div>
          {activeFilterCount > 0 && (
            <span className="ml-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25 shadow-[0_0_8px_rgba(52,211,153,0.15)]">
              {activeFilterCount} Active
            </span>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full">
          <CustomDropdown
            icon={<Calendar className="h-3.5 w-3.5" />}
            label="Season"
            value={filters.season || 'all'}
            options={filterOptions.seasons}
            allLabel="All Seasons"
            onChange={v => handleChange('season', v)}
            disabled={loading}
          />
          <CustomDropdown
            icon={<Users className="h-3.5 w-3.5" />}
            label="Team"
            value={filters.team || 'all'}
            options={filterOptions.teams}
            allLabel="All Teams"
            onChange={v => handleChange('team', v)}
            disabled={loading}
          />
          <CustomDropdown
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Batter"
            value={filters.batter || 'all'}
            options={filterOptions.batters}
            allLabel="All Batters"
            onChange={v => handleChange('batter', v)}
            disabled={loading}
          />
          <CustomDropdown
            icon={<Target className="h-3.5 w-3.5" />}
            label="Bowler"
            value={filters.bowler || 'all'}
            options={filterOptions.bowlers}
            allLabel="All Bowlers"
            onChange={v => handleChange('bowler', v)}
            disabled={loading}
          />
          <CustomDropdown
            icon={<MapPin className="h-3.5 w-3.5" />}
            label="Venue"
            value={filters.venue || 'all'}
            options={filterOptions.venues}
            allLabel="All Venues"
            onChange={v => handleChange('venue', v)}
            disabled={loading}
          />
        </div>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 rounded-xl bg-red-500/8 border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-300 transition-all shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FiltersSection;
