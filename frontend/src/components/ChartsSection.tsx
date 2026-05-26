'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

// Check if mounted on the client to avoid server hydration issues
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-xs text-foreground/40 font-semibold animate-pulse bg-card-border/10 rounded-xl">
        Hydrating Analytics Visuals...
      </div>
    );
  }
  return <>{children}</>;
};

// SVG-to-PNG high-resolution canvas exporter wrapper
const ChartWrapper: React.FC<{ children: React.ReactNode; filename: string }> = ({ children, filename }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleExportPng = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    try {
      const svgString = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(svgBlob);

      const image = new Image();
      const width = svgEl.clientWidth || svgEl.getBoundingClientRect().width || 500;
      const height = svgEl.clientHeight || svgEl.getBoundingClientRect().height || 300;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        // Render at 2x resolution for crisp high-dpi exports
        canvas.width = width * 2;
        canvas.height = height * 2;
        const context = canvas.getContext('2d');
        if (context) {
          context.scale(2, 2);
          // Draw solid stadium dark background
          context.fillStyle = '#0d1425';
          context.fillRect(0, 0, width, height);
          // Draw SVG image onto canvas
          context.drawImage(image, 0, 0, width, height);

          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `${filename}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        DOMURL.revokeObjectURL(url);
      };
      image.src = url;
    } catch (err) {
      console.error('Failed to export chart to PNG canvas:', err);
    }
  };

  return (
    <div className="relative group/chart" ref={containerRef}>
      {/* Floating Export Icon */}
      <button
        onClick={handleExportPng}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover/chart:opacity-100 transition-opacity duration-200 rounded bg-card-border/40 border border-card-border p-1 text-foreground/70 hover:text-primary hover:bg-card-border/70"
        title="Export Chart as PNG Image"
      >
        <Download className="h-3.5 w-3.5" />
      </button>
      {children}
    </div>
  );
};

// Sports Color Palettes
const COLORS = [
  '#059669', '#fbbf24', '#ef4444', '#3b82f6', '#8b5cf6', 
  '#ec4899', '#14b8a6', '#f97316', '#64748b', '#a855f7'
];

interface ChartProps {
  data: any[];
}

// 1. Toss Winner vs Match Winner Chart
export const TossImpactChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="toss_winner_impact">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : '#ef4444'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: 'var(--foreground)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};

// 2. Powerplay vs Middle vs Death Overs Chart
export const MatchPhasesChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="match_phases_performance">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWkts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" name="Run Rate" dataKey="runRate" stroke="#fbbf24" fillOpacity={1} fill="url(#colorRr)" />
              <Area type="monotone" name="Wickets Lost" dataKey="wickets" stroke="#ef4444" fillOpacity={1} fill="url(#colorWkts)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};

// 3. Top 10 Batters Horizontal Bar Chart
export const TopBattersChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="top_10_batters">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
              <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={9} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
              <Bar dataKey="runs" name="Runs" fill="#fbbf24" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#d97706'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};

// 4. Top 10 Bowlers Chart
export const TopBowlersChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="top_10_bowlers">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} interval={0} angle={-30} textAnchor="end" height={50} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
              <Bar dataKey="wickets" name="Wickets" fill="#059669" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#059669'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};

// 5. Team Win Distribution Pie Chart
export const TeamWinsChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="team_win_distribution">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={70}
                dataKey="value"
                label={({ name, percent }) => `${String(name || '').split(' ').map(w => w[0] || '').join('')} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={8}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};

// 6. Venue Performance Bar Chart
export const VenuePerformanceChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="venue_performance">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={8} tickLine={false} interval={0} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="avgScore" name="Avg Inning runs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="matches" name="Matches Played" fill="#fbbf24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};

// 7. Season Run Trends Line Chart
export const SeasonTrendsChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="season_run_trends">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="season" stroke="#9ca3af" fontSize={10} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
              <Line type="monotone" name="Avg Match Score" dataKey="avgRuns" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};

// 8. Strike Rate Scatter Chart
export const StrikeRateAnalysisChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="batter_strike_rate_scatter">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
              <XAxis type="number" dataKey="runs" name="Runs" stroke="#9ca3af" fontSize={10} label={{ value: 'Runs', position: 'insideBottomRight', offset: -5, fill: '#9ca3af', fontSize: 10 }} />
              <YAxis type="number" dataKey="strikeRate" name="Strike Rate" stroke="#9ca3af" fontSize={10} label={{ value: 'S/R', angle: -90, position: 'insideLeft', fill: '#9ca3af', fontSize: 10 }} />
              <ZAxis type="category" dataKey="name" name="Player" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                labelFormatter={(value) => `Player Details`}
              />
              <Scatter name="Batters" data={data} fill="#fbbf24" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};

// 9. Wicket Type Distribution Pie Chart
export const WicketAnalysisChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ClientOnly>
      <ChartWrapper filename="wicket_type_distribution">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={75}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${String(name || '')}: ${((percent || 0) * 100).toFixed(0)}%`}
                fontSize={8}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d1423', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartWrapper>
    </ClientOnly>
  );
};
