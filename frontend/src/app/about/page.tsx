'use client';

import React from 'react';
import { ShieldCheck, Database, Award, Cpu, Code2, Server, HelpCircle, User, Mail, Crown } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto w-full py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">About InsightX</h1>
        <p className="text-xs text-foreground/50">Technical specifications and architecture details behind the Cricket Analytics Studio</p>
      </div>

      {/* Overview Card */}
      <div className="rounded-xl glass-card p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="h-6 w-6 text-secondary" />
          <h2 className="text-lg font-bold text-foreground">Platform Vision</h2>
        </div>
        <p className="text-xs text-foreground/75 leading-relaxed font-medium">
          IPL InsightX is an advanced AI-powered cricket analytics studio that turns raw, ball-by-ball delivery log sheets and match scoreboards into actionable, tactical summaries. By ingestion of standardized sports statistics layouts, coaches, players, and analysts can query pitch boundaries behaviors, death-overs run rates, batter strike-rate scatter plots, and toss bias distributions, backed by an interactive co-pilot assistant.
        </p>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Frontend Spec */}
        <div className="rounded-xl glass-card p-5 space-y-3">
          <div className="flex items-center space-x-2 border-b border-card-border pb-2.5">
            <Code2 className="h-5 w-5 text-secondary" />
            <span className="text-xs font-bold text-foreground/85 uppercase">Frontend Client Spec</span>
          </div>
          <ul className="space-y-2 text-xs text-foreground/75">
            <li><span className="font-bold text-foreground">React & Next.js 15:</span> Modular pages architecture utilizing the Next.js App Router for layout scoping.</li>
            <li><span className="font-bold text-foreground">Tailwind CSS v4:</span> Premium neon glassmorphic overlays, custom stadium background mesh, and scrollbars.</li>
            <li><span className="font-bold text-foreground">Recharts:</span> Responsive, client-side SVG graphing of 9 sports visualizations with hydration checks.</li>
            <li><span className="font-bold text-foreground">Framer Motion:</span> Micro-animations and bouncy state transitions.</li>
          </ul>
        </div>

        {/* Backend Spec */}
        <div className="rounded-xl glass-card p-5 space-y-3">
          <div className="flex items-center space-x-2 border-b border-card-border pb-2.5">
            <Server className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold text-foreground/85 uppercase">Backend Server Spec</span>
          </div>
          <ul className="space-y-2 text-xs text-foreground/75">
            <li><span className="font-bold text-foreground">Node.js & Express:</span> REST API routing for authentication, metadata lists, filters, and charts providers.</li>
            <li><span className="font-bold text-foreground">In-Memory CSV Engine:</span> Ball-by-ball parsing using <code>csv-parser</code>, caching records into indexed memory grids.</li>
            <li><span className="font-bold text-foreground">JWT Authentication:</span> Session security protecting CSV upload endpoints via Express middlewares.</li>
            <li><span className="font-bold text-foreground">PDFKit Reporting:</span> High-fidelity PDF compiling converting scope metrics directly into downloadable document streams.</li>
          </ul>
        </div>
      </div>

      {/* System Architecture Section */}
      <div className="rounded-xl glass-card p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-extrabold text-foreground tracking-tight">Full-Stack Flow Architecture</h3>
        </div>
        
        <p className="text-xs text-foreground/70 leading-relaxed font-medium">
          The diagram below outlines the communication cycle between the frontend dashboard view, Express authentication services, in-memory statistics resolvers, and document creation engines:
        </p>

        {/* Mermaid Diagram block */}
        <div className="bg-black/20 rounded-lg p-4 border border-card-border overflow-x-auto">
          <pre className="text-xs font-mono text-foreground/80 leading-relaxed">
{`    +-------------------------------------------------------------+
    |                     React/Next.js Client                    |
    |  - Filter selections (Season, Team, Player, Venue)         |
    |  - Interactive SVG Charts (Recharts) & AI Chat Co-Pilot     |
    +------------------------------+------------------------------+
                                   |
                     GET API Requests (with JWT)
                                   v
    +-------------------------------------------------------------+
    |                     Express.js Web Server                   |
    |  - CORS filters, logging and request body parsers           |
    |  - JWT authorization checking middlewares                   |
    +---------+--------------------------+------------------+-----+
              |                          |                  |
       Auth & Metadata           Ingestion Files       Query Filter
              v                          v                  v
    +-------------------+      +-----------------+  +-----------------+
    |   JSON Local DB   |      |   Multer Ingest |  |  Analytics Eng  |
    |  - User profiles  |      |  - Save CSVs    |  |  - In-Memory    |
    |  - File upload    |      |  - Check headers|  |    Data Caches  |
    |    metadata log   |      |  - Reload cache |  |  - Filter logic |
    +-------------------+      +-----------------+  +--------+--------+
                                                             |
                                                       PDF Generator
                                                             v
                                                    +-----------------+
                                                    |  PDFKit Stream  |
                                                    |  - A4 Cover     |
                                                    |  - Metrics grid |
                                                    +-----------------+`}
          </pre>
        </div>
      </div>

      {/* FAQ Box */}
      <div className="rounded-xl glass-card p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-secondary" />
          <h4 className="text-sm font-extrabold text-foreground tracking-tight">Frequently Asked Questions</h4>
        </div>
        <div className="space-y-3 text-xs leading-relaxed text-foreground/75 font-medium">
          <div>
            <span className="font-bold text-foreground block">Q: How do I upload my own IPL datasets?</span>
            <span>A: First, authenticate an account using the "Access Studio" button in the navigation header. Then, navigate to the Deep Analytics page and click on the "Dataset Upload" tab to upload your CSV files.</span>
          </div>
          <div>
            <span className="font-bold text-foreground block">Q: What column layout should my CSV files follow?</span>
            <span>A: The Matches CSV must contain columns: <code>id</code>, <code>season</code>, <code>team1</code>, <code>team2</code>, <code>winner</code>, and <code>venue</code>. The Deliveries CSV must contain: <code>match_id</code>, <code>inning</code>, <code>batting_team</code>, <code>bowling_team</code>, <code>over</code>, <code>ball</code>, <code>batter</code>, <code>bowler</code>, and <code>total_runs</code>.</span>
          </div>
        </div>
      </div>

      {/* Admin Contact Card */}
      <div className="rounded-xl glass-card p-6 space-y-4 border border-emerald-500/15" style={{ background: 'linear-gradient(135deg,rgba(5,150,105,0.07) 0%,rgba(7,12,20,0.8) 100%)' }}>
        <div className="flex items-center space-x-2 border-b border-card-border pb-3">
          <Crown className="h-5 w-5 text-secondary" />
          <h4 className="text-sm font-extrabold text-foreground tracking-tight">Platform Administrator</h4>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 text-primary text-2xl font-black shadow-[0_0_20px_rgba(5,150,105,0.2)]">
            VP
          </div>
          {/* Info */}
          <div className="space-y-2 flex-1">
            <div>
              <p className="text-base font-extrabold text-foreground tracking-tight">Vijayapandian T</p>
              <span className="inline-flex items-center gap-1 mt-0.5 rounded-full bg-secondary/10 border border-secondary/25 px-2 py-0.5 text-[10px] font-bold text-secondary">
                <Crown className="h-3 w-3" /> Platform Admin
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 text-xs">
              <a
                href="mailto:vijayapandian112007@gmail.com"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors group"
              >
                <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                vijayapandian112007@gmail.com
              </a>
            </div>
          </div>
          {/* Contact CTA */}
          <a
            href="mailto:vijayapandian112007@gmail.com"
            className="shrink-0 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 hover:border-emerald-500/50 px-4 py-2.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact Admin
          </a>
        </div>
      </div>
    </div>
  );
}
