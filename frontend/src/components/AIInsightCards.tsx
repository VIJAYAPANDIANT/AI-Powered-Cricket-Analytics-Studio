'use client';

import React, { useState } from 'react';
import { useAnalytics } from '../context/AnalyticsContext';
import { Sparkles, Send, Bot, User, BrainCircuit } from 'lucide-react';

export const AIInsightCards: React.FC = () => {
  const { insights, filters, metrics, loading } = useAnalytics();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Welcome! I am the InsightX Cricket Co-Pilot. I have analyzed the active dataset. Ask me any tactical query (e.g. "Which stadium has the highest run rate?" or "Who is the top bowler?").'
    }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setQuery('');
    setAiTyping(true);

    // Simulate AI thinking and responding based on heuristic keywords
    setTimeout(() => {
      let response = '';
      const lower = userMsg.toLowerCase();

      const seasonText = filters.season ? `Season ${filters.season}` : 'all recorded seasons';
      const teamText = filters.team ? `representing ${filters.team}` : 'across all teams';

      if (lower.includes('stadium') || lower.includes('venue') || lower.includes('pitch') || lower.includes('ground')) {
        response = `My analysis of venues ${sfText()} shows M. Chinnaswamy Stadium, Bangalore as the most run-friendly surface (average score: 202). Conversely, MA Chidambaram Stadium (Chepauk) indicates high grip and spin assistance, lowering average match run rates to 172. Defending teams win 58.3% of games there.`;
      } else if (lower.includes('batter') || lower.includes('batting') || lower.includes('runs') || lower.includes('strike rate')) {
        response = `Top-order batting logs ${sfText()} show Virat Kohli leading cumulative runs (741 runs, average: 61.8). However, for pure explosive impact in the Powerplay overs, Travis Head strikes at a formidable 191.6, scoring 567 runs.`;
      } else if (lower.includes('bowler') || lower.includes('bowling') || lower.includes('wickets') || lower.includes('economy')) {
        response = `Jasprit Bumrah is the most efficient bowling asset in this dataset. He boasts an economy of 6.48 runs per over while securing 20 wickets. Harshal Patel holds the highest wicket tally (24 wickets), but maintains a higher economy of 8.8.`;
      } else if (lower.includes('toss') || lower.includes('chase') || lower.includes('defend')) {
        response = `Toss impact analysis shows that winning the toss grants a general 54.2% advantage. In night matches, dew factors tilt this heavily toward chasing teams, where captains who win the toss and bowl first secure a 61.2% win ratio.`;
      } else {
        response = `Analyzing the active scope (${metrics.totalMatches} matches, ${metrics.totalRuns.toLocaleString()} runs, ${metrics.totalWickets} wickets): The team win distribution shows Kolkata Knight Riders and Sunrisers Hyderabad as dominant forces. Let me know if you would like me to compile a deep phase-by-phase run rate chart for them!`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
      setAiTyping(false);
    }, 1200);
  };

  const sfText = () => {
    const season = filters.season ? `for season ${filters.season}` : '';
    const team = filters.team ? `for ${filters.team}` : '';
    return [season, team].filter(Boolean).join(' ') || 'in the active scope';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Dynamic Insights list */}
      <div className="lg:col-span-2 rounded-xl glass-card p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-1.5 text-primary">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-foreground tracking-tight">AI Generated Tactical Insights</h3>
              <p className="text-xxs text-foreground/50">Strategic patterns detected in match delivery logs</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-10 rounded-lg bg-card-border/40 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3.5">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 rounded-lg bg-primary-glow/5 border border-primary-glow/10 p-3 hover:border-primary/25 transition-colors group"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 text-xxs font-bold group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    {index + 1}
                  </span>
                  <p className="text-xs text-foreground/80 leading-relaxed font-medium">{insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-card-border/50 pt-3 mt-4 text-xxs text-foreground/40 flex items-center justify-between">
          <span>Updates dynamically as you apply filters</span>
          <span>Powered by InsightX Analytics Model v1.0</span>
        </div>
      </div>

      {/* Interactive AI Chat Prompt Helper */}
      <div className="rounded-xl glass-card p-5 flex flex-col justify-between h-[360px]">
        {/* Header */}
        <div className="flex items-center space-x-2 border-b border-card-border pb-3">
          <BrainCircuit className="h-5 w-5 text-secondary animate-pulse" />
          <div>
            <h4 className="text-xs font-extrabold text-foreground tracking-tight">Tactical Chat Co-Pilot</h4>
            <p className="text-xxs text-foreground/50">Ask follow-up analytical questions</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 text-xs">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
                msg.sender === 'ai' 
                  ? 'bg-emerald-500/15 border border-emerald-500/20 text-primary' 
                  : 'bg-secondary-glow/15 border border-secondary-glow/20 text-secondary'
              }`}>
                {msg.sender === 'ai' ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
              </div>
              <div className={`rounded-lg px-3 py-2 leading-relaxed max-w-[80%] ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white font-medium' 
                  : 'bg-card-border/30 border border-card-border text-foreground/90'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {aiTyping && (
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/15 text-primary border border-emerald-500/20">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-lg bg-card-border/30 border border-card-border px-3 py-2 flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleQuerySubmit} className="relative mt-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={aiTyping}
            placeholder="Type tactical query..."
            className="w-full rounded-lg bg-black/15 border border-card-border pl-3.5 pr-10 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={aiTyping || !query.trim()}
            className="absolute right-2.5 top-2.5 text-foreground/60 hover:text-primary disabled:text-foreground/30 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default AIInsightCards;
