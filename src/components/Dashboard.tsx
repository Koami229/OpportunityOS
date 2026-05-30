/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Zap, 
  Bell, 
  Tv2, 
  Trash2, 
  Bookmark, 
  ChevronRight, 
  Eye, 
  Filter, 
  CheckCircle2, 
  Cpu, 
  Globe, 
  AlertCircle 
} from 'lucide-react';
import { Opportunity, OpportunityType, Notification } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  opportunities: Opportunity[];
  savedOpportunities: string[];
  appliedOpportunities: string[];
  notifications: Notification[];
  onSelect: (id: string) => void;
  onSaveToggle: (id: string) => void;
  onApplyToggle: (id: string) => void;
  onMarkRead: (id: string) => void;
  onClearNotifications: () => void;
  onScrape: (keyword: string, type: string) => Promise<void>;
  userProfileSet: boolean;
  onNavigateToProfile: () => void;
}

export default function Dashboard({
  opportunities,
  savedOpportunities,
  appliedOpportunities,
  notifications,
  onSelect,
  onSaveToggle,
  onApplyToggle,
  onMarkRead,
  onClearNotifications,
  onScrape,
  userProfileSet,
  onNavigateToProfile,
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<OpportunityType | 'all'>('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [scrapeKeyword, setScrapeKeyword] = useState('');
  const [scrapeCategory, setScrapeCategory] = useState<OpportunityType>('job');
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeError, setScrapeError] = useState('');

  // Unread notifications counter
  const unreadCount = notifications.filter(n => !n.read).length;

  // Real-time keyword filter
  const filtered = opportunities.filter(o => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      o.title.toLowerCase().includes(term) ||
      o.provider.toLowerCase().includes(term) ||
      o.description.toLowerCase().includes(term) ||
      o.tags.some(t => t.toLowerCase().includes(term));
      
    const matchesLocation = o.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesCategory = selectedType === 'all' || o.type === selectedType;

    return matchesSearch && matchesLocation && matchesCategory;
  });

  const handleScrapeTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeKeyword.trim()) return;
    setScrapeLoading(true);
    setScrapeError('');
    try {
      await onScrape(scrapeKeyword, scrapeCategory);
      setScrapeKeyword('');
    } catch (err: any) {
      setScrapeError(err?.message || 'Error executing crawl request. Verify network client.');
    } finally {
      setScrapeLoading(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-500 bg-slate-900 border-slate-800';
    if (score >= 80) return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-950/40 border-amber-500/20';
    return 'text-rose-400 bg-rose-950/40 border-rose-500/20';
  };

  const getOppTypeLabel = (type: OpportunityType) => {
    const labels: Record<OpportunityType, string> = {
      scholarship: 'Scholarship',
      job: 'Full-Time Job',
      internship: 'Internship',
      hackathon: 'Hackathon',
      grant: 'Research Grant',
      accelerator: 'Startup Accelerator',
      competition: 'Competition',
      tender: 'Business Tender',
      funding: 'Venture Funding'
    };
    return labels[type] || type;
  };

  return (
    <div id="dashboard-view" className="space-y-8 select-none">
      
      {/* Top Banner Alert (If Profile is not customized yet) */}
      {!userProfileSet && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-950/50 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/10">
              <AlertCircle className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-white font-bold text-base">Setup Your AI Match Profiles</h4>
              <p className="text-slate-400 text-sm mt-0.5 font-normal">
                Finish setting up your country, education level, skills, and goals to unlock custom 100% accurate fit scores with details.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToProfile}
            id="btn-onboard-profile"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all text-center self-start md:self-center cursor-pointer"
          >
            Configure Profile Settings
          </button>
        </motion.div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        <div className="p-6 rounded-2xl bg-[#0f172a]/40 border border-slate-800/80 hover:border-indigo-500/30 shadow-xl flex items-center justify-between transition-all group">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Tracked Listings</span>
            <span className="block text-3xl font-extrabold text-white mt-1 group-hover:text-indigo-400 transition-colors">{opportunities.length}</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-450">
            <Globe className="h-6 w-6 text-indigo-400" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a]/40 border border-slate-800/80 hover:border-indigo-500/30 shadow-xl flex items-center justify-between transition-all group">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">New Additions Today</span>
            <span className="block text-3xl font-extrabold text-white mt-1 group-hover:text-indigo-400 transition-colors">4</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-450">
            <Zap className="h-6 w-6 text-indigo-400 animate-pulse" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a]/40 border border-slate-800/80 hover:border-indigo-500/30 shadow-xl flex items-center justify-between transition-all group">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Saved Folders</span>
            <span className="block text-3xl font-extrabold text-white mt-1 group-hover:text-indigo-400 transition-colors">{savedOpportunities.length}</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-450">
            <Bookmark className="h-6 w-6 text-purple-400" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0f172a]/40 border border-slate-800/80 hover:border-indigo-500/30 shadow-xl flex items-center justify-between transition-all group">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Applications Filed</span>
            <span className="block text-3xl font-extrabold text-white mt-1 group-hover:text-indigo-400 transition-colors">{appliedOpportunities.length}</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-450">
            <CheckCircle2 className="h-6 w-6 text-indigo-450 text-indigo-405" />
          </div>
        </div>
      </div>

      {/* Main Grid: Filters + Feeds (Left 2/3) & Live Scrapper (Right 1/3) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Feed Section */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Filtering Bars */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/40 border border-slate-800/80 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by title, skills required, provider..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 transition-all font-sans text-left"
                />
              </div>

              <div className="w-full md:w-60 relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Location filter (Germany, Remote...)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 transition-all font-sans text-left"
                />
              </div>
            </div>

            {/* Category Quick Selector Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-xl border transition-all cursor-pointer grow-0 shrink-0 ${
                  selectedType === 'all'
                    ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-400 font-semibold shadow-[0_0_8px_rgba(129,140,248,0.2)]'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                All Opportunities
              </button>
              {(['scholarship', 'job', 'internship', 'hackathon', 'grant', 'accelerator', 'competition', 'tender'] as OpportunityType[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedType(cat)}
                  className={`px-4 py-2 rounded-xl border transition-all uppercase font-mono tracking-wider cursor-pointer grow-0 shrink-0 ${
                    selectedType === cat
                      ? 'border-indigo-500/40 bg-indigo-950/40 text-indigo-400 font-semibold shadow-[0_0_8px_rgba(129,140,248,0.2)]'
                      : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Opportunities Stream
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  {filtered.length} found
                </span>
              </h3>
              
              {/* Optional Notifications Toggle Button */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifPanel(!showNotifPanel)}
                  id="btn-toggle-notifs"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200 transition-all text-xs flex items-center gap-2 relative cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  Alerts Feed
                  {unreadCount > 0 && (
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse absolute -top-0.5 -right-0.5" />
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                <AnimatePresence>
                  {showNotifPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-40 text-left space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-sm font-bold text-white">Daily Alert Logs</span>
                        <button
                          onClick={onClearNotifications}
                          className="text-[10px] font-semibold text-slate-500 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" /> Clear All
                        </button>
                      </div>

                      <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-600 text-xs font-mono">
                            Alert log queue static.
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div 
                              key={notif.id} 
                              onClick={() => { onMarkRead(notif.id); }}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                                notif.read 
                                  ? 'bg-slate-950/20 border-slate-950/40 opacity-60' 
                                  : 'bg-emerald-950/10 border-emerald-500/10 hover:border-emerald-500/20'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-white">{notif.title}</span>
                                {!notif.read && (
                                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-slate-400 mt-1 font-normal leading-relaxed">{notif.message}</p>
                              <span className="block text-[9px] font-mono text-slate-600 mt-1.5">
                                {new Date(notif.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* List Element Rendering */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-600 text-sm">
                  No matches discovered under specific keyword or criteria rules. 
                  Try clearing modifiers or keyword scrapers.
                </div>
              ) : (
                <div className="space-y-3.5 text-left">
                  {filtered.map(opp => {
                    const isSaved = savedOpportunities.includes(opp.id);
                    const isApplied = appliedOpportunities.includes(opp.id);

                    return (
                      <motion.div
                        key={opp.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-[#0f172a]/30 border border-slate-800/80 hover:border-indigo-500/40 shadow hover:shadow-[0_10px_25px_-5px_rgba(99,102,241,0.06)] transition-all relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                      >
                        {/* Saved Corner Flag */}
                        {isSaved && (
                          <div className="absolute top-0 right-12 h-6 w-6 rounded-b bg-indigo-500/10 border-r border-b border-indigo-500/20 flex items-center justify-center">
                            <Bookmark className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-900 border border-slate-800 text-slate-400">
                              {opp.type}
                            </span>
                            {opp.isNew && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-indigo-950/60 text-indigo-400 border border-indigo-500/20">
                                Fresh
                              </span>
                            )}
                            {isApplied && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-purple-950/60 text-purple-400 border border-purple-500/20">
                                Applied
                              </span>
                            )}
                          </div>

                          <h4 className="text-lg font-bold text-white leading-snug tracking-tight hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => onSelect(opp.id)}>
                            {opp.title}
                          </h4>

                          <p className="text-slate-400 text-xs font-semibold leading-relaxed line-clamp-2">
                            {opp.provider} • <span className="text-slate-500 font-normal">{opp.location}</span>
                          </p>
                          
                          {/* Tags row */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {opp.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Fit Score Badge & Apply Buttons (Right side aligned) */}
                        <div className="flex md:flex-col items-end gap-4 shrink-0 w-full md:w-auto border-t md:border-t-0 border-slate-800/40 pt-4 md:pt-0">
                          <div className="flex items-center gap-3 w-full justify-between md:justify-end">
                            <div className="text-right">
                              <span className="block text-[9px] uppercase tracking-wider font-mono text-slate-500">Fit Index</span>
                              <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-xl text-base font-extrabold border mt-1 font-mono ${getScoreColor(opp.matchScore)}`}>
                                {opp.matchScore}%
                              </span>
                            </div>

                            <button
                              onClick={() => { onMarkRead(opp.id); onSelect(opp.id); }}
                              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-indigo-455 text-indigo-400 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              Details <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Scrapper Widget Column (Continuous Monitor AI) */}
        <div id="scrapper-widget-col" className="w-full lg:w-96 shrink-0 text-left">
          <div className="p-6 rounded-2xl bg-[#0f172a]/40 border border-slate-800/80 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-400 animate-spin-slow" />
                <h3 className="text-base font-bold text-white">Continuous AI Discovery</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase bg-indigo-950/40 text-indigo-400 border border-indigo-500/20">
                Live Web Crawler
              </span>
            </div>

            <p className="text-slate-400 text-xs font-normal leading-relaxed">
              We leverage Bright Data crawler nodes dynamically using search-grounded loops. 
              Input a specialized field or academic query (e.g. &quot;Quantum computing grant 2026&quot;) to scrape the live web now.
            </p>

            <form onSubmit={handleScrapeTrigger} className="space-y-4">
              {scrapeError && (
                <div className="p-3 bg-rose-950/30 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center gap-1.5 font-normal">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{scrapeError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Query Topic</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={scrapeKeyword}
                    onChange={(e) => setScrapeKeyword(e.target.value)}
                    placeholder="e.g. Biotech scholarship USA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 transition-all font-mono animate-pulse"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Classification</label>
                <select
                  value={scrapeCategory}
                  onChange={(e) => setScrapeCategory(e.target.value as OpportunityType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                >
                  <option value="scholarship">Scholarship & Program</option>
                  <option value="job">Full-time Position</option>
                  <option value="internship">Internship Trainee</option>
                  <option value="hackathon">Hackathon Arena</option>
                  <option value="grant">Research Seed Grant</option>
                  <option value="accelerator">Startup Accelerator</option>
                  <option value="competition">Competition Trophy</option>
                  <option value="tender">Government Tender</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={scrapeLoading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-bold text-sm shadow-md hover:shadow-indigo-500/25 transition-all disabled:opacity-55 flex items-center justify-center gap-2 cursor-pointer"
              >
                {scrapeLoading ? (
                  <>
                    <Cpu className="h-4 w-4 animate-spin" />
                    Connecting Crawler & Grounding...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Query Live Web Scanner
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">API Connection:</span>
                <span className="text-indigo-400 font-bold">BRIGHT_DATA_CRAWLER</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Daily Crawls Limit:</span>
                <span className="text-slate-300">100 / Session</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
