const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AnalyticsFilter {
  season?: string;
  team?: string;
  batter?: string;
  bowler?: string;
  venue?: string;
}

const buildQueryString = (filters: AnalyticsFilter): string => {
  const params = new URLSearchParams();
  if (filters.season) params.append('season', filters.season);
  if (filters.team) params.append('team', filters.team);
  if (filters.batter) params.append('batter', filters.batter);
  if (filters.bowler) params.append('bowler', filters.bowler);
  if (filters.venue) params.append('venue', filters.venue);
  
  const queryStr = params.toString();
  return queryStr ? `?${queryStr}` : '';
};

// Helper for authorized headers
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ipl_insightx_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const api = {
  // Check backend health
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_URL}/`);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Auth endpoints
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(username: string, email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  // Analytics endpoints
  async getMetrics(filters: AnalyticsFilter) {
    const query = buildQueryString(filters);
    const res = await fetch(`${API_URL}/api/analytics/metrics${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch metrics');
    return data.metrics;
  },

  async getCharts(filters: AnalyticsFilter) {
    const query = buildQueryString(filters);
    const res = await fetch(`${API_URL}/api/analytics/charts${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch charts');
    return data.charts;
  },

  async getInsights(filters: AnalyticsFilter) {
    const query = buildQueryString(filters);
    const res = await fetch(`${API_URL}/api/analytics/insights${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch insights');
    return data.insights;
  },

  async getFilterOptions() {
    const res = await fetch(`${API_URL}/api/analytics/filters`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch filters');
    return data.options;
  },

  // Dataset Ingestion
  async uploadDataset(file: File, type: 'matches' | 'deliveries') {
    const formData = new FormData();
    formData.append(type, file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('ipl_insightx_token') : '';
    const res = await fetch(`${API_URL}/api/dataset/upload/${type}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Upload of ${type} failed.`);
    return data;
  },

  async getMetadata() {
    const res = await fetch(`${API_URL}/api/dataset/metadata`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch upload metadata');
    return data.metadata;
  },

  // Download PDF Report Link helper
  getReportPdfUrl(filters: AnalyticsFilter): string {
    const query = buildQueryString(filters);
    return `${API_URL}/api/reports/report/pdf${query}`;
  },

  // Export JSON Data URL helper
  getExportJsonUrl(filters: AnalyticsFilter): string {
    const query = buildQueryString(filters);
    return `${API_URL}/api/reports/report/export${query}`;
  },

  // Export CSV Data URL helper
  getReportCsvUrl(filters: AnalyticsFilter): string {
    const query = buildQueryString(filters);
    return `${API_URL}/api/reports/report/csv${query}`;
  }
};
export default api;
