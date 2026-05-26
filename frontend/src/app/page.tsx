'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Sparkles, BarChart3, FileText, BrainCircuit, UploadCloud, ChevronRight, Zap } from 'lucide-react';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full py-8 md:py-16">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {/* Hero Banner Section */}
        <div className="text-center space-y-4">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center space-x-1.5 rounded-full bg-secondary-glow/10 border border-secondary/20 px-3.5 py-1 text-xs font-bold text-secondary shadow-[0_0_15px_rgba(251,191,36,0.1)]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Next-Generation Cricket Analytics</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            IPL InsightX <br />
            <span className="text-gradient font-black">AI-Powered Analytics Studio</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-sm md:text-lg text-foreground/60 max-w-2xl mx-auto font-medium"
          >
            A premium full-stack analytical platform designed for coaches, tacticians, and cricket enthusiasts. Ingest delivery logs, run instant game phase visualizations, and query our interactive AI co-pilot.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link 
              href="/dashboard"
              className="flex items-center space-x-1.5 rounded-xl bg-primary hover:bg-primary/95 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary-glow hover:translate-y-[-1px] active:translate-y-[0px] transition-all"
            >
              <span>Enter Analytics Studio</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/about"
              className="flex items-center space-x-1.5 rounded-xl bg-card-border/20 border border-card-border hover:bg-card-border/30 px-6 py-3 text-sm font-bold text-foreground/80 hover:text-foreground transition-all"
            >
              <span>Read Documentation</span>
            </Link>
          </motion.div>
        </div>

        {/* Live Insight Ticker Banner */}
        <motion.div 
          variants={itemVariants}
          className="rounded-xl glass-card border border-primary/20 p-4 bg-primary-glow/5 relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 h-full w-[4px] bg-primary"></div>
          <div className="flex items-center space-x-3 text-xs">
            <Zap className="h-5 w-5 text-secondary shrink-0 animate-pulse" />
            <span className="font-extrabold text-foreground tracking-wider uppercase shrink-0">Real-Time Insight Ticker:</span>
            <div className="w-full overflow-hidden whitespace-nowrap text-foreground/80 font-medium">
              <span className="inline-block animate-pulse">
                "Pace bowling accounts for 74% of powerplay wickets at Wankhede Stadium. Defending target win ratios average 62% under lights."
              </span>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {[
            {
              title: 'CSV Data Ingestor',
              desc: 'Upload standard match logs (matches.csv) and ball-by-ball actions (deliveries.csv) to rebuild in-memory charts.',
              icon: UploadCloud,
              color: 'text-primary'
            },
            {
              title: 'Interactive Visualizations',
              desc: 'Analyze 9 sports charts showing over phase run rates, player averages, win distributions, and scatter grids.',
              icon: BarChart3,
              color: 'text-secondary'
            },
            {
              title: 'Tactical AI Co-Pilot',
              desc: 'Query our interactive NLP co-pilot for immediate cricket breakdowns and match situational biases.',
              icon: BrainCircuit,
              color: 'text-purple-400'
            },
            {
              title: 'Executive PDF Summaries',
              desc: 'Compile filtered analytics scopes into styled PDF executive briefs containing metric performance records.',
              icon: FileText,
              color: 'text-blue-400'
            }
          ].map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="rounded-2xl glass-card p-6 flex items-start space-x-4 group"
              >
                <div className={`rounded-xl bg-card-border/20 border border-card-border p-3 ${feat.color} group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors">{feat.title}</h3>
                  <p className="text-xs text-foreground/60 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Platform Architecture Status Badge */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-xxs text-foreground/40 font-semibold"
        >
          IPL InsightX Cricket Studio is active in sandbox environment. Port: 5000 REST Client.
        </motion.div>
      </motion.div>
    </div>
  );
}
