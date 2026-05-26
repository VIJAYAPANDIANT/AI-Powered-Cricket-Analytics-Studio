'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, AnalyticsFilter } from '../utils/api';
import { getMockMetrics, getMockCharts, getMockInsights, getMockFilterOptions } from '../utils/mockClientData';

interface AnalyticsContextType {
  filters: AnalyticsFilter;
  setFilters: React.Dispatch<React.SetStateAction<AnalyticsFilter>>;
  resetFilters: () => void;
  metrics: {
    totalMatches: number;
    totalTeams: number;
    totalRuns: number;
    totalWickets: number;
    highestTeamScore: number;
    averageMatchScore: number;
  };
  charts: {
    tossImpact: any[];
    matchPhases: any[];
    topBatters: any[];
    topBowlers: any[];
    teamWinDistribution: any[];
    venuePerformance: any[];
    seasonRunTrends: any[];
    strikeRateAnalysis: any[];
    wicketAnalysis: any[];
  } | null;
  insights: string[];
  filterOptions: {
    seasons: string[];
    teams: string[];
    venues: string[];
    batters: string[];
    bowlers: string[];
  };
  backendOnline: boolean;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const defaultMetrics = {
  totalMatches: 0,
  totalTeams: 0,
  totalRuns: 0,
  totalWickets: 0,
  highestTeamScore: 0,
  averageMatchScore: 0
};

const defaultFilterOptions: {
  seasons: string[];
  teams: string[];
  venues: string[];
  batters: string[];
  bowlers: string[];
} = {
  seasons: [],
  teams: [],
  venues: [],
  batters: [],
  bowlers: []
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<AnalyticsFilter>({});
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [charts, setCharts] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);
  
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    
    // Check if backend is alive
    const online = await api.checkHealth();
    setBackendOnline(online);

    if (online) {
      try {
        const [kpis, chartsData, aiInsights, options] = await Promise.all([
          api.getMetrics(filters),
          api.getCharts(filters),
          api.getInsights(filters),
          api.getFilterOptions()
        ]);
        
        setMetrics(kpis);
        setCharts(chartsData);
        setInsights(aiInsights);
        setFilterOptions(options);
      } catch (err) {
        console.error('API fetch failed, falling back to mock data:', err);
        loadMockData(filters);
      }
    } else {
      loadMockData(filters);
    }
    
    setLoading(false);
  }, [filters]);

  const loadMockData = (currentFilters: AnalyticsFilter) => {
    setMetrics(getMockMetrics(currentFilters));
    setCharts(getMockCharts(currentFilters));
    setInsights(getMockInsights(currentFilters));
    setFilterOptions(getMockFilterOptions());
  };

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <AnalyticsContext.Provider
      value={{
        filters,
        setFilters,
        resetFilters,
        metrics,
        charts,
        insights,
        filterOptions,
        backendOnline,
        loading,
        refreshData
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
