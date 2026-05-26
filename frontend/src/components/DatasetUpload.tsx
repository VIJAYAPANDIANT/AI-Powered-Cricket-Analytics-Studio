'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAnalytics } from '../context/AnalyticsContext';
import { api } from '../utils/api';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCcw, Lock, FileSpreadsheet, Layers } from 'lucide-react';

export const DatasetUpload: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { backendOnline, refreshData } = useAnalytics();
  const [activeTab, setActiveTab] = useState<'matches' | 'deliveries'>('matches');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [metadata, setMetadata] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch file metadata from server
  const fetchMetadata = async () => {
    if (backendOnline && isAuthenticated) {
      try {
        const meta = await api.getMetadata();
        setMetadata(meta);
      } catch (err) {
        console.error('Failed to load file metadata:', err);
      }
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, [backendOnline, isAuthenticated]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setError('');
    setSuccess('');
    setUploading(true);
    setUploadProgress(10);

    // Simulate upload progress interval
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      await api.uploadDataset(file, activeTab);
      setUploadProgress(100);
      setSuccess(`${activeTab === 'matches' ? 'Matches' : 'Deliveries'} CSV uploaded and processed successfully!`);
      
      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh global states
      await refreshData();
      await fetchMetadata();
    } catch (err: any) {
      setError(err.message || 'File ingestion failed. Please verify format.');
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 800);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Find file details in metadata list
  const activeMeta = metadata.find((m) => m.fileType === activeTab);

  if (!backendOnline) {
    return (
      <div className="rounded-xl glass-card p-6 border-amber-500/20 bg-amber-500/[0.02]">
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
          <div className="rounded-full bg-amber-500/10 border border-amber-500/20 p-3 text-amber-500">
            <RefreshCcw className="h-6 w-6 animate-spin-slow" />
          </div>
          <h3 className="text-sm font-extrabold text-amber-500">Local Sandbox Mode Active</h3>
          <p className="text-xs text-foreground/60 max-w-sm">
            The backend REST server is currently offline. You are interacting with the fully loaded local browser database representing complete seasons of statistics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl glass-card overflow-hidden relative min-h-[300px]">
      {/* Lock Screen overlay */}
      {!isAuthenticated && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 backdrop-blur-md text-center p-6 transition-all duration-300">
          <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-primary mb-3 shadow-[0_0_15px_rgba(5,150,105,0.2)]">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-extrabold text-foreground tracking-tight">Dataset Ingestor Locked</h3>
          <p className="text-xs text-foreground/60 max-w-xs mt-1 mb-4">
            Sign in/Authenticate to unlock the CSV CSV parser and ingest customized match and delivery logs.
          </p>
          <span className="text-xxs text-primary font-bold">Use "Access Studio" in header navbar</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-card-border">
        <button
          onClick={() => { setActiveTab('matches'); setError(''); setSuccess(''); }}
          className={`flex-1 py-3 text-xs font-extrabold border-b-2 transition-all ${
            activeTab === 'matches'
              ? 'border-primary text-primary bg-primary-glow/10'
              : 'border-transparent text-foreground/60 hover:text-foreground hover:bg-card-border/10'
          }`}
        >
          <div className="flex items-center justify-center space-x-1.5">
            <FileSpreadsheet className="h-4 w-4" />
            <span>Matches Log (matches.csv)</span>
          </div>
        </button>
        <button
          onClick={() => { setActiveTab('deliveries'); setError(''); setSuccess(''); }}
          className={`flex-1 py-3 text-xs font-extrabold border-b-2 transition-all ${
            activeTab === 'deliveries'
              ? 'border-primary text-primary bg-primary-glow/10'
              : 'border-transparent text-foreground/60 hover:text-foreground hover:bg-card-border/10'
          }`}
        >
          <div className="flex items-center justify-center space-x-1.5">
            <Layers className="h-4 w-4" />
            <span>Deliveries Log (deliveries.csv)</span>
          </div>
        </button>
      </div>

      <div className="p-5 flex flex-col md:flex-row gap-5">
        {/* Upload Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-primary bg-primary-glow/20 shadow-md shadow-primary-glow'
              : 'border-card-border hover:border-primary/50 bg-black/10'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv"
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="h-10 w-10 border-4 border-card-border border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-xxs font-bold text-primary">
                  {uploadProgress}%
                </div>
              </div>
              <span className="text-xs font-bold text-foreground">Ingesting dataset and rebuilding cache...</span>
              <div className="w-40 h-1 bg-card-border rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-card-border/20 text-foreground/60 border border-card-border">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-foreground">Drag and drop file here, or click to browse</p>
              <p className="text-xxs text-foreground/50">Only spreadsheet comma-separated values (.csv) are accepted</p>
            </div>
          )}
        </div>

        {/* File status and requirements summary */}
        <div className="w-full md:w-80 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-foreground tracking-wider uppercase">Dataset Status</h4>

            {activeMeta ? (
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 space-y-1.5 animate-in fade-in">
                <div className="flex items-center space-x-1.5 text-emerald-500 text-xs font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Valid Dataset Online</span>
                </div>
                <div className="text-xxs text-foreground/75 space-y-0.5">
                  <div><span className="font-bold">File:</span> {activeMeta.filename}</div>
                  <div><span className="font-bold">Records:</span> {activeMeta.rowCount.toLocaleString()} lines</div>
                  <div><span className="font-bold">Size:</span> {(activeMeta.sizeBytes / 1024 / 1024).toFixed(2)} MB</div>
                  <div><span className="font-bold">Uploaded:</span> {new Date(activeMeta.uploadedAt).toLocaleString()}</div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-card-border/10 border border-card-border/30 p-3 text-center py-6 text-foreground/60">
                <p className="text-xs font-medium">No custom dataset uploaded.</p>
                <p className="text-xxs mt-0.5 opacity-85">Currently displaying built-in fallback IPL stats.</p>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-500/5 border border-red-500/15 p-3 flex items-start space-x-2 text-red-400 text-xxs leading-relaxed animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/15 p-3 flex items-start space-x-2 text-emerald-400 text-xxs leading-relaxed animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}
          </div>

          <div className="border-t border-card-border/50 pt-3 mt-4">
            <h5 className="text-xxs font-bold text-foreground/50 tracking-wider uppercase mb-1.5">Required Headers</h5>
            <div className="flex flex-wrap gap-1">
              {(activeTab === 'matches'
                ? ['id', 'season', 'team1', 'team2', 'winner', 'venue']
                : ['match_id', 'inning', 'batting_team', 'bowling_team', 'over', 'ball', 'batter', 'bowler', 'total_runs']
              ).map((h) => (
                <span key={h} className="text-xxs font-mono bg-card-border/20 border border-card-border px-1.5 py-0.5 rounded text-foreground/75">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DatasetUpload;
