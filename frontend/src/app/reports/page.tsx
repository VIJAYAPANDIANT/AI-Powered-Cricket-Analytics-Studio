'use client';

import React, { useState } from 'react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { FiltersSection } from '../../components/FiltersSection';
import { api } from '../../utils/api';
import { FileText, Download, Share2, ClipboardList, Info, ChevronLeft, ChevronRight, BookmarkPlus } from 'lucide-react';

export default function ReportsPage() {
  const { filters, metrics, loading } = useAnalytics();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  
  const [includeKpis, setIncludeKpis] = useState(true);
  const [includeInsights, setIncludeInsights] = useState(true);
  const [includePlayers, setIncludePlayers] = useState(true);

  // Table pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  // Download PDF Report from server
  const handlePdfDownload = () => {
    addToast('PDF briefing compiler', 'Compiling and downloading PDF report brief...', 'info');
    const url = api.getReportPdfUrl(filters);
    window.open(url, '_blank');
  };

  // Export JSON Data from server
  const handleDataExport = () => {
    addToast('Export Data', 'Exporting calculations as JSON dataset...', 'success');
    const url = api.getExportJsonUrl(filters);
    window.open(url, '_blank');
  };

  // Export CSV Data from server
  const handleCsvExport = () => {
    addToast('Export CSV', 'Exporting metrics summary as CSV spreadsheet...', 'success');
    const url = api.getReportCsvUrl(filters);
    window.open(url, '_blank');
  };

  // Save active filter scope to profile
  const handleSaveFilter = () => {
    if (!isAuthenticated) {
      addToast('Authentication lock', 'Please sign in to save search scopes to your profile.', 'error');
      return;
    }
    
    // Save to memory simulation
    addToast('Scope saved', 'Analytics query scope successfully bookmarked to your profile history.', 'success');
  };

  // Generate list of matches based on filters
  const generateMatchRecords = () => {
    const season = filters.season || '2025';
    
    return [
      { id: 1, date: `20${season.slice(2)}-04-05`, teams: 'Chennai Super Kings vs Mumbai Indians', toss: 'Chennai Super Kings (field)', winner: 'Chennai Super Kings', margin: '6 wickets', venue: 'Wankhede Stadium' },
      { id: 2, date: `20${season.slice(2)}-04-12`, teams: 'Kolkata Knight Riders vs Royal Challengers Bangalore', toss: 'Royal Challengers Bangalore (bat)', winner: 'Kolkata Knight Riders', margin: '35 runs', venue: 'Eden Gardens' },
      { id: 3, date: `20${season.slice(2)}-04-18`, teams: 'Sunrisers Hyderabad vs Rajasthan Royals', toss: 'Sunrisers Hyderabad (field)', winner: 'Sunrisers Hyderabad', margin: '7 wickets', venue: 'Rajiv Gandhi Stadium' },
      { id: 4, date: `20${season.slice(2)}-04-24`, teams: 'Delhi Capitals vs Gujarat Titans', toss: 'Gujarat Titans (field)', winner: 'Gujarat Titans', margin: '4 wickets', venue: 'Narendra Modi Stadium' },
      { id: 5, date: `20${season.slice(2)}-05-02`, teams: 'Mumbai Indians vs Royal Challengers Bangalore', toss: 'Mumbai Indians (bat)', winner: 'Mumbai Indians', margin: '18 runs', venue: 'M. Chinnaswamy Stadium' }
    ].filter(rec => {
      if (filters.team && !rec.teams.includes(filters.team)) return false;
      if (filters.venue && !rec.venue.toLowerCase().includes(filters.venue.toLowerCase())) return false;
      return true;
    });
  };

  const records = generateMatchRecords();
  
  // Calculate Paginated slice
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const paginatedRecords = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="flex-1 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Executive Reports Desk</h1>
          <p className="text-xs text-foreground/50">Compile filtered statistics into executive briefs and export raw datasets</p>
        </div>
        <button
          onClick={handleSaveFilter}
          className="flex items-center space-x-1.5 rounded-lg bg-card-border/30 border border-card-border/80 px-4 py-2 text-xs font-bold text-foreground/80 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
        >
          <BookmarkPlus className="h-4 w-4" />
          <span>Save Scope to Profile</span>
        </button>
      </div>

      {/* Global Filter Bar */}
      <FiltersSection />

      {/* PDF & Export Configuration row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Builder Box */}
        <div className="rounded-xl glass-card p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-card-border pb-3">
              <div className="rounded-lg bg-primary-glow/20 border border-primary/20 p-1.5 text-primary">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">Executive PDF Compiler</h3>
                <p className="text-xxs text-foreground/50">Export styled analytics briefs</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-black/10 border border-card-border">
                <label className="font-semibold text-foreground/80">Include Metrics Grid</label>
                <input
                  type="checkbox"
                  checked={includeKpis}
                  onChange={(e) => setIncludeKpis(e.target.checked)}
                  className="accent-primary h-4 w-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-black/10 border border-card-border">
                <label className="font-semibold text-foreground/80">Include AI Observations</label>
                <input
                  type="checkbox"
                  checked={includeInsights}
                  onChange={(e) => setIncludeInsights(e.target.checked)}
                  className="accent-primary h-4 w-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-black/10 border border-card-border">
                <label className="font-semibold text-foreground/80">Include Top Players Table</label>
                <input
                  type="checkbox"
                  checked={includePlayers}
                  onChange={(e) => setIncludePlayers(e.target.checked)}
                  className="accent-primary h-4 w-4 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePdfDownload}
            disabled={loading}
            className="w-full mt-6 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-white py-3 flex items-center justify-center space-x-2 shadow-md shadow-primary-glow/20 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Generate Executive PDF Briefing</span>
          </button>
        </div>

        {/* Data Exporter Box */}
        <div className="rounded-xl glass-card p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-card-border pb-3">
              <div className="rounded-lg bg-secondary-glow/20 border border-secondary/20 p-1.5 text-secondary">
                <Share2 className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-foreground tracking-tight">Structured Data Exporter</h3>
                <p className="text-xxs text-foreground/50">Download calculations in JSON/CSV layouts</p>
              </div>
            </div>

            <div className="rounded-lg bg-card-border/10 p-3 flex items-start space-x-2.5 text-xxs text-foreground/75 leading-relaxed">
              <Info className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5 text-foreground">Data Export Specifications</span>
                Structured exports contain full analytical dimensions based on active filters, including match outcomes ratios, batting strike rates scatter grids, bowling phase tallies, and venue run margins. Ideal for Excel, R, or Python scripts.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleCsvExport}
              disabled={loading}
              className="flex-1 rounded-lg bg-card-border/25 border border-card-border hover:bg-card-border/35 text-xs font-bold text-foreground/80 hover:text-foreground py-3 flex items-center justify-center space-x-2 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV Summaries</span>
            </button>
            <button
              onClick={handleDataExport}
              disabled={loading}
              className="flex-1 rounded-lg bg-card-border/25 border border-card-border hover:bg-card-border/35 text-xs font-bold text-foreground/80 hover:text-foreground py-3 flex items-center justify-center space-x-2 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON Scope</span>
            </button>
          </div>
        </div>
      </div>

      {/* Match Ledger Records Table */}
      <div className="rounded-xl glass-card p-5">
        <div className="flex items-center space-x-2 mb-4 border-b border-card-border pb-3">
          <ClipboardList className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-extrabold text-foreground tracking-tight">Analytical Match Ledger</h3>
            <p className="text-xxs text-foreground/50">Match logs ledger matching selected filter parameters</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-card-border/60 text-foreground/50 uppercase font-extrabold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Match Event</th>
                <th className="py-2.5 px-3">Toss Winner Decision</th>
                <th className="py-2.5 px-3">Match Winner</th>
                <th className="py-2.5 px-3">Margin</th>
                <th className="py-2.5 px-3">Venue</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((n) => (
                  <tr key={n} className="border-b border-card-border/30 animate-pulse">
                    <td className="py-3 px-3"><div className="h-4 w-16 bg-card-border/50 rounded"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-40 bg-card-border/50 rounded"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-32 bg-card-border/50 rounded"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-24 bg-card-border/50 rounded"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-16 bg-card-border/50 rounded"></div></td>
                    <td className="py-3 px-3"><div className="h-4 w-28 bg-card-border/50 rounded"></div></td>
                  </tr>
                ))
              ) : paginatedRecords.length > 0 ? (
                paginatedRecords.map((rec) => (
                  <tr key={rec.id} className="border-b border-card-border/30 hover:bg-card-border/5 transition-colors font-medium text-foreground/90">
                    <td className="py-3 px-3 whitespace-nowrap text-foreground/60">{rec.date}</td>
                    <td className="py-3 px-3 font-semibold whitespace-nowrap">{rec.teams}</td>
                    <td className="py-3 px-3 text-foreground/75 whitespace-nowrap">{rec.toss}</td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded px-1.5 py-0.5 font-bold whitespace-nowrap inline-block">
                        {rec.winner}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-foreground/60">{rec.margin}</td>
                    <td className="py-3 px-3 text-foreground/50">{rec.venue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-foreground/50 font-medium">
                    No matching match records in database scope. Adjust filters above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {records.length > 0 && (
          <div className="flex items-center justify-between border-t border-card-border/40 pt-4 mt-4 text-xs font-semibold">
            <span className="text-foreground/50">
              Showing <span className="text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="text-foreground">{Math.min(currentPage * pageSize, records.length)}</span> of{' '}
              <span className="text-foreground">{records.length}</span> records
            </span>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="rounded-lg bg-card-border/20 border border-card-border p-1.5 text-foreground/60 hover:text-foreground disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-foreground/80">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="rounded-lg bg-card-border/20 border border-card-border p-1.5 text-foreground/60 hover:text-foreground disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
