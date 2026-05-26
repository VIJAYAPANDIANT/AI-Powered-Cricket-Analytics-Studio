'use client';

import React, { useState } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { FiltersSection } from '../../components/FiltersSection';
import { DatasetUpload } from '../../components/DatasetUpload';
import { AIInsightCards } from '../../components/AIInsightCards';
import {
  TopBattersChart,
  TopBowlersChart,
  MatchPhasesChart,
  WicketAnalysisChart,
  VenuePerformanceChart,
  StrikeRateAnalysisChart
} from '../../components/ChartsSection';
import { Award, Layers, MapPin, Database, Sparkles, Trophy, Target, BarChart3, ScatterChart } from 'lucide-react';

type TabType = 'batting-bowling' | 'match-phases' | 'venue-analysis' | 'ingestion';

export default function AnalyticsPage() {
  const { charts, loading } = useAnalytics();
  const [activeTab, setActiveTab] = useState<TabType>('batting-bowling');

  const tabs = [
    { id: 'batting-bowling', name: 'Batting & Bowling', icon: Trophy },
    { id: 'match-phases', name: 'Phases & Wickets', icon: Layers },
    { id: 'venue-analysis', name: 'Venue Performance', icon: MapPin },
    { id: 'ingestion', name: 'Dataset Upload', icon: Database }
  ];

  return (
    <div className="flex-1 space-y-6 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Deep Analytics Studio</h1>
        <p className="text-xs text-foreground/50">Run multi-field statistical scopes and ingest customized delivery logs</p>
      </div>

      {/* Global query filters */}
      <FiltersSection />

      {/* Analytics Tabs switcher */}
      <div className="flex border-b border-card-border overflow-x-auto whitespace-nowrap scrollbar-none gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center space-x-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary-glow/10'
                  : 'border-transparent text-foreground/60 hover:text-foreground hover:bg-card-border/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        {activeTab === 'ingestion' && (
          <div className="animate-in fade-in duration-200">
            <DatasetUpload />
          </div>
        )}

        {activeTab === 'batting-bowling' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* Top Batters */}
            <div className="rounded-xl glass-card p-5">
              <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-bold text-foreground/75 uppercase">Top 10 Batters (Runs scored)</span>
                </div>
              </div>
              {charts ? (
                <TopBattersChart data={charts.topBatters} />
              ) : (
                <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
              )}
            </div>

            {/* Top Bowlers */}
            <div className="rounded-xl glass-card p-5">
              <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-foreground/75 uppercase">Top 10 Bowlers (Wickets taken)</span>
                </div>
              </div>
              {charts ? (
                <TopBowlersChart data={charts.topBowlers} />
              ) : (
                <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
              )}
            </div>

            {/* Strike Rate Scatter Analysis */}
            <div className="lg:col-span-2 rounded-xl glass-card p-5">
              <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-bold text-foreground/75 uppercase">Strike Rate vs Runs Analysis (Minimum 50 balls faced)</span>
                </div>
              </div>
              {charts ? (
                <StrikeRateAnalysisChart data={charts.strikeRateAnalysis} />
              ) : (
                <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'match-phases' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
            {/* Match Phase analysis (PP vs Middle vs Death) */}
            <div className="rounded-xl glass-card p-5">
              <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-bold text-foreground/75 uppercase">Game Phase Run Rate vs Wickets Lost</span>
                </div>
              </div>
              {charts ? (
                <MatchPhasesChart data={charts.matchPhases} />
              ) : (
                <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
              )}
            </div>

            {/* Wickets Analysis (Dismissal types) */}
            <div className="rounded-xl glass-card p-5">
              <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold text-foreground/75 uppercase">Dismissal Methods Distribution</span>
                </div>
              </div>
              {charts ? (
                <WicketAnalysisChart data={charts.wicketAnalysis} />
              ) : (
                <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'venue-analysis' && (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-200">
            {/* Venue Performance Bar Chart */}
            <div className="rounded-xl glass-card p-5">
              <div className="flex items-center justify-between mb-4 border-b border-card-border pb-2.5">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold text-foreground/75 uppercase">Venue Performance (Matches Played vs Average 1st Innings Score)</span>
                </div>
              </div>
              {charts ? (
                <VenuePerformanceChart data={charts.venuePerformance} />
              ) : (
                <div className="h-64 bg-card-border/10 rounded-lg animate-pulse"></div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI tactical Insights and prompt agent (always displayed on Analytics for immediate co-pilot usage!) */}
      {activeTab !== 'ingestion' && (
        <div className="pt-4">
          <AIInsightCards />
        </div>
      )}
    </div>
  );
}
