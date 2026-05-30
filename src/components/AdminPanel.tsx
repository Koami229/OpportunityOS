/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Database, Shield, Zap, Sparkles, AlertCircle, RefreshCw, Layers, Terminal, Server } from 'lucide-react';
import { AdminStats } from '../types';
import { motion } from 'motion/react';

interface AdminPanelProps {
  onResetDB: () => Promise<void>;
  stats: AdminStats;
  scrapesCount: number;
}

export default function AdminPanel({ onResetDB, stats, scrapesCount }: AdminPanelProps) {
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'System: Booting OpportunityOS administrative console... OK',
    'BrightData: Host pool ready, 128 active IP clusters matched.',
    'Gemini: Server-side cognitive loops initialized.',
    'Database: Connected to durable local JSON schemas.'
  ]);

  const triggerReset = async () => {
    if (!window.confirm('Reset all databases, matching roadmaps, and settings to original seeds?')) return;
    setResetting(true);
    setResetDone(false);
    try {
      await onResetDB();
      setResetDone(true);
      setConsoleLogs(prev => [
        ...prev, 
        `Admin: Database reset at ${new Date().toLocaleTimeString()} - restored initial seeds.`,
        'Database: Cleared roadmaps, gap-analysis caches & notification feeds.'
      ]);
      setTimeout(() => setResetDone(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const handleClearLogs = () => {
    setConsoleLogs(['Console: Logs flushed. Monitoring system standby.']);
  };

  return (
    <div id="admin-panel-view" className="space-y-8 text-left select-none max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-400 font-bold" />
            Administrative Insights & Scraper Pools
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Configure system states, analyze scraping statistics, review operational logs, or refresh schema seeds.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        <div className="p-6 rounded-2xl bg-[#0f172a]/30 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Consolidated Users</span>
            <span className="block text-2xl font-bold text-white mt-1">2</span>
          </div>
          <Server className="h-5 w-5 text-indigo-400" />
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a]/30 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Tracked Listings</span>
            <span className="block text-2xl font-bold text-white mt-1">11</span>
          </div>
          <Layers className="h-5 w-5 text-indigo-400" />
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a]/30 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Queries Scraped</span>
            <span className="block text-2xl font-bold text-white mt-1">24</span>
          </div>
          <RefreshCw className="h-5 w-5 text-purple-400" />
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a]/30 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">Daily Discoveries</span>
            <span className="block text-2xl font-bold text-white mt-1">+4</span>
          </div>
          <Zap className="h-5 w-5 text-indigo-400 animate-pulse" />
        </div>
      </div>

      {/* Database control cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Reset card (Left 1/3) */}
        <div className="p-6 bg-[#0f172a]/30 border border-slate-800/80 rounded-2xl h-full flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-400" /> Database Reset Engine
            </h3>
            <p className="text-slate-450 text-xs font-normal leading-relaxed">
              If schemas feel polluted or you want to demonstrate a clean sandbox application review, wipe current custom allocations and restore seeds.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            {resetDone && (
              <span className="block text-xs font-semibold text-indigo-400">✓ Database seed restored successfully!</span>
            )}
            
            <button
              onClick={triggerReset}
              disabled={resetting}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-indigo-400 hover:border-indigo-500/20 border border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${resetting ? 'animate-spin' : ''}`} />
              {resetting ? 'Flushing Schemas...' : 'Restore initial seeds'}
            </button>
          </div>
        </div>

        {/* Console logs (Right 2/3) */}
        <div className="lg:col-span-2 p-6 bg-[#0f172a]/30 border border-slate-800/80 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-400" /> Live Web Crawler Logs (Sandbox)
            </h3>
            <button 
              onClick={handleClearLogs}
              className="text-[10px] text-slate-500 hover:text-slate-350 cursor-pointer font-semibold uppercase tracking-wider"
            >
              Clear Feed
            </button>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/60 font-mono text-xs text-left max-h-48 overflow-y-auto space-y-1.5 text-slate-505 text-slate-500 selection:bg-indigo-950/40">
            {consoleLogs.map((log, index) => (
              <div 
                key={index} 
                className={`${
                  log.startsWith('System') ? 'text-slate-500' :
                  log.startsWith('BrightData') ? 'text-indigo-400 font-semibold' :
                  log.startsWith('Gemini') ? 'text-purple-400' :
                  log.startsWith('Admin') ? 'text-indigo-400 font-bold' :
                  'text-slate-650 text-slate-500'
                }`}
              >
                &gt; {log}
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-slate-600">
            Bright Data clusters are currently routing requests through Munich node pools.
          </p>
        </div>

      </div>

    </div>
  );
}
