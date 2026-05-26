'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  loading?: boolean;
  trend?: {
    type: 'up' | 'down' | 'neutral';
    value: string;
  };
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  loading = false,
  trend
}) => {
  if (loading) {
    return (
      <div className="rounded-xl glass-card p-5 animate-pulse min-h-[120px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-card-border/60"></div>
          <div className="h-8 w-8 rounded-lg bg-card-border/60"></div>
        </div>
        <div className="mt-4">
          <div className="h-7 w-20 rounded bg-card-border/80"></div>
          <div className="h-3.5 w-36 rounded bg-card-border/40 mt-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl glass-card p-5 flex flex-col justify-between relative overflow-hidden group">
      {/* Visual top bar glow on hover */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary/50 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground/60 tracking-wide uppercase">{title}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card-border/20 border border-card-border text-primary group-hover:text-secondary group-hover:bg-primary-glow/20 transition-all duration-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3">
        <span className="text-2xl font-extrabold tracking-tight text-foreground">{value}</span>
        
        {/* Sub-label or Trend */}
        <div className="flex items-center mt-1 space-x-1.5">
          {trend && (
            <span
              className={`text-xxs font-bold px-1.5 py-0.5 rounded ${
                trend.type === 'up'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : trend.type === 'down'
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                  : 'bg-card-border/30 text-foreground/50 border border-card-border'
              }`}
            >
              {trend.value}
            </span>
          )}
          {description && (
            <span className="text-xxs text-foreground/50 font-medium truncate">{description}</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default AnalyticsCard;
