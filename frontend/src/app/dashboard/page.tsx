'use client';

import React from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { AnalyticsCard } from '../../components/AnalyticsCard';
import { FiltersSection } from '../../components/FiltersSection';
import { SeasonTrendsChart, TeamWinsChart, TossImpactChart } from '../../components/ChartsSection';
import { Trophy, Users, Shield, Zap, Target, Star, BarChart, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { metrics, charts, insights, loading } = useAnalytics();

  return (
    <div className="flex-1 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Dashboard Summary</h1>
          <p className="text-xs text-foreground/50">Overview of metrics and key analytics performance indicators</p>
        </div>
        <Link 
          href="/analytics" 
          className="flex items-center space-x-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          <span>Enter Deep Analytics</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Global Filter Scope */}
      <FiltersSection />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <AnalyticsCard
          title="Total Matches"
          value={metrics.totalMatches}
          icon={Trophy}
          loading={loading}
          trend={{ type: 'neutral', value: 'Scope matches' }}
        />
        <AnalyticsCard
          title="Total Teams"
          value={metrics.totalTeams}
          icon={Users}
          loading={loading}
          description="Registered squads"
        />
        <AnalyticsCard
          title="Total Runs"
          value={metrics.totalRuns.toLocaleString()}
          icon={Zap}
          loading={loading}
          trend={{ type: 'up', value: '+1.2%' }}
          description="Cumulative score"
        />
        <AnalyticsCard
          title="Total Wickets"
          value={metrics.totalWickets}
          icon={Target}
          loading={loading}
          description="Cumulative outs"
        />
        <AnalyticsCard
          title="High Score"
          value={metrics.highestTeamScore}
          icon={Shield}
          loading={loading}
          description="Highest team total"
        />
        <AnalyticsCard
          title="Avg Score"
          value={metrics.averageMatchScore}
          icon={Star}
          loading={loading}
          trend={{ type: 'neutral', value: '1st Innings' }}
          description="Score per match"
        />
      </div>

      {/* Overview Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Season Run Trends */}
        <div className="rounded-xl glass-card p-5">
          <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
            <span className="text-xs font-bold text-foreground/70 uppercase">Season Run Trends (Average Score)</span>
            <BarChart className="h-4 w-4 text-emerald-500" />
          </div>
          {charts ? (
            <SeasonTrendsChart data={charts.seasonRunTrends} />
          ) : (
            <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
          )}
        </div>

        {/* Team Win Distribution */}
        <div className="rounded-xl glass-card p-5">
          <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
            <span className="text-xs font-bold text-foreground/70 uppercase">Squad Victories Distribution</span>
            <Trophy className="h-4 w-4 text-secondary" />
          </div>
          {charts ? (
            <TeamWinsChart data={charts.teamWinDistribution} />
          ) : (
            <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
          )}
        </div>

        {/* Toss impact */}
        <div className="rounded-xl glass-card p-5">
          <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
            <span className="text-xs font-bold text-foreground/70 uppercase">Toss Win Match Win Ratio</span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          {charts ? (
            <TossImpactChart data={charts.tossImpact} />
          ) : (
            <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
          )}
        </div>
      </div>

      {/* AI tactical Insights preview */}
      <div className="rounded-xl glass-card p-5">
        <div className="flex items-center space-x-2 mb-4 border-b border-card-border pb-3">
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-1.5 text-primary">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-foreground tracking-tight">AI Tactical Co-Pilot Highlights</h3>
            <p className="text-xxs text-foreground/50">Primary observations extracted from current analytical scope</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2.5">
            <div className="h-8 rounded bg-card-border/30 animate-pulse"></div>
            <div className="h-8 rounded bg-card-border/30 animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.slice(0, 3).map((insight, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 rounded-lg bg-primary-glow/5 border border-primary-glow/10 p-3 hover:border-primary/20 transition-all text-xs text-foreground/80 font-medium"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <p>{insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
