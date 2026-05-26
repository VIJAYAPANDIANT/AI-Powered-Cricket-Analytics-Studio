'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnalytics } from '../context/AnalyticsContext';
import { X, ShieldCheck, FileText, Lock, BarChart2, Database, AlertTriangle } from 'lucide-react';

/* ─── Modal ─────────────────────────────────────────────────────────────── */
interface ModalProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, icon, children, onClose }) => {
  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-white/10 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg,#0b1520 0%,#070e18 100%)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(5,150,105,0.15)',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {icon}
            </div>
            <h2 className="text-sm font-extrabold text-slate-100 tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto scrollbar-thin px-6 py-5 space-y-5 text-xs text-slate-400 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

/* ─── Section helper ─────────────────────────────────────────────────────── */
const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-slate-200 font-bold text-[11px] uppercase tracking-widest">
      <span className="text-emerald-400">{icon}</span>
      {title}
    </div>
    <div className="pl-5 text-slate-400 space-y-1.5">{children}</div>
  </div>
);

/* ─── Footer ─────────────────────────────────────────────────────────────── */
export const Footer: React.FC = () => {
  const { backendOnline } = useAnalytics();
  const currentYear = new Date().getFullYear();
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className="border-t border-card-border bg-background/50 py-4 px-6 mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/50">
          <p>© {currentYear} IPL InsightX – AI Powered Cricket Analytics Studio. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="font-semibold">Engine status:</span>
              <span className={backendOnline ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                {backendOnline ? 'LIVE API' : 'CLIENT FALLBACK'}
              </span>
            </div>
            <span>|</span>
            <button
              onClick={() => setModal('privacy')}
              className="hover:text-primary cursor-pointer transition-colors underline-offset-2 hover:underline"
            >
              Privacy Scope
            </button>
            <span>|</span>
            <button
              onClick={() => setModal('terms')}
              className="hover:text-primary cursor-pointer transition-colors underline-offset-2 hover:underline"
            >
              Analytical Terms
            </button>
          </div>
        </div>
      </footer>

      {/* ── Privacy Scope Modal ── */}
      {modal === 'privacy' && (
        <Modal title="Privacy Scope" icon={<ShieldCheck className="h-4 w-4" />} onClose={() => setModal(null)}>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            IPL InsightX operates as a self-contained analytical studio. This document outlines how data is
            handled within the platform.
          </p>

          <Section icon={<Database className="h-3.5 w-3.5" />} title="Data Collection">
            <p>IPL InsightX only processes data that you explicitly upload via the Dataset Upload panel.</p>
            <p>No personal data is harvested, transmitted to third parties, or stored on external servers without your consent.</p>
            <p>Uploaded CSV files (<strong className="text-slate-300">matches.csv</strong>, <strong className="text-slate-300">deliveries.csv</strong>) are processed in-memory by the Express.js backend and are not persisted to a permanent database.</p>
          </Section>

          <Section icon={<Lock className="h-3.5 w-3.5" />} title="Authentication & Sessions">
            <p>User credentials are hashed using <strong className="text-slate-300">bcrypt</strong> before storage.</p>
            <p>Session tokens are signed <strong className="text-slate-300">JSON Web Tokens (JWT)</strong> with a configurable expiry. Tokens are stored in browser memory only and are never written to LocalStorage or cookies by default.</p>
            <p>You may log out at any time to invalidate your session token.</p>
          </Section>

          <Section icon={<ShieldCheck className="h-3.5 w-3.5" />} title="File Validation">
            <p>All uploaded files are validated for MIME type, file extension, and column schema before processing.</p>
            <p>Files exceeding the configured size limit are automatically rejected.</p>
            <p>No uploaded file content is ever forwarded to AI vendors or external APIs.</p>
          </Section>

          <Section icon={<AlertTriangle className="h-3.5 w-3.5" />} title="Data Retention">
            <p>Uploaded datasets are retained only for the duration of the server session. Restarting the backend clears all in-memory records.</p>
            <p>Generated PDF reports are stored temporarily in the <strong className="text-slate-300">/uploads</strong> directory and can be deleted at any time.</p>
          </Section>

          <p className="text-slate-600 text-[10px] pt-2 border-t border-white/5">
            Last updated: May 2026 · IPL InsightX v1.0 · For questions contact the platform administrator{' '}
            <a href="mailto:vijayapandian112007@gmail.com" className="text-emerald-500 hover:text-emerald-400 transition-colors">
              Vijayapandian T
            </a>.
          </p>
        </Modal>
      )}

      {/* ── Analytical Terms Modal ── */}
      {modal === 'terms' && (
        <Modal title="Analytical Terms of Use" icon={<FileText className="h-4 w-4" />} onClose={() => setModal(null)}>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            By using IPL InsightX, you agree to the following analytical usage terms. These terms govern how
            the platform's data processing, visualizations, and AI-generated insights may be used.
          </p>

          <Section icon={<BarChart2 className="h-3.5 w-3.5" />} title="Intended Use">
            <p>IPL InsightX is designed for <strong className="text-slate-300">analytical, educational, and tactical research</strong> purposes related to Indian Premier League cricket data.</p>
            <p>The platform must not be used for illegal data manipulation, match-fixing analysis, or any activity that violates the BCCI's or IPL's intellectual property guidelines.</p>
            <p>Insights generated by the AI co-pilot are probabilistic and <strong className="text-slate-300">should not be used as the sole basis</strong> for high-stakes decisions.</p>
          </Section>

          <Section icon={<Database className="h-3.5 w-3.5" />} title="Data Accuracy">
            <p>Pre-loaded mock datasets are synthetic approximations of historical IPL data used for demonstration purposes only.</p>
            <p>When using your own uploaded CSVs, IPL InsightX processes the data as-is. The platform is <strong className="text-slate-300">not responsible for inaccuracies</strong> in source data provided by the user.</p>
            <p>All analytics metrics (run rates, economy rates, win ratios) are computed in real time from the loaded dataset using standard cricket statistical formulae.</p>
          </Section>

          <Section icon={<FileText className="h-3.5 w-3.5" />} title="Report & Export Usage">
            <p>PDF reports, PNG chart exports, and CSV data exports generated by the platform may be used freely for internal analysis, presentations, or academic research.</p>
            <p>Commercial redistribution of IPL InsightX-generated reports <strong className="text-slate-300">requires explicit written permission</strong> from the platform administrator.</p>
            <p>Reports must clearly attribute IPL InsightX as the source when published externally.</p>
          </Section>

          <Section icon={<AlertTriangle className="h-3.5 w-3.5" />} title="Disclaimer">
            <p>IPL InsightX is provided <strong className="text-slate-300">"as is"</strong> without warranty of any kind. The platform does not guarantee the completeness or accuracy of analytical outputs.</p>
            <p>The developers are not liable for decisions made based on insights, trends, or reports generated by this system.</p>
          </Section>

          <p className="text-slate-600 text-[10px] pt-2 border-t border-white/5">
            Last updated: May 2026 · IPL InsightX v1.0 · Continued use of the platform constitutes acceptance of these terms.
          </p>
        </Modal>
      )}
    </>
  );
};

export default Footer;
