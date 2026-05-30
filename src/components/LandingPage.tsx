/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass, Shield, Database, Cpu, Zap, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
  onScrapeDemo: (keyword: string) => void;
}

export default function LandingPage({ onStart, onScrapeDemo }: LandingPageProps) {
  const [demoKeyword, setDemoKeyword] = useState('Google AI Internship');
  const [isScraping, setIsScraping] = useState(false);
  const [demoResult, setDemoResult] = useState<any>(null);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoKeyword.trim()) return;
    setIsScraping(true);
    setDemoResult(null);
    
    // Simulate interactive scraper on landing page
    setTimeout(() => {
      setDemoResult({
        title: `${demoKeyword} 2026`,
        provider: 'International Innovations Group',
        type: 'internship',
        deadline: '2026-09-18',
        matchScore: 94,
        fundingAmount: '€4,200/month Stipend + Flight coverage',
        reason: `Matched highly on your career objectives. Highlights excellent fit with engineering specifications.`
      });
      setIsScraping(false);
    }, 1500);
  };

  return (
    <div id="landing-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900 overflow-x-hidden">
      {/* Decorative Grid Mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header */}
      <header className="relative max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <Compass className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-white bg-clip-text text-transparent">
            OpportunityOS <span className="text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/20">AI</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onStart}
            id="btn-header-launch"
            className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 text-sm font-medium hover:text-emerald-400 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onStart}
            id="btn-header-cta"
            className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            Launch Platform <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto w-full px-6 pt-20 pb-32 flex-1 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 max-w-2xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Next-Gen Web Monitoring Discovery</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
            Find Scholarships, Jobs & Grants{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent block mt-2">
              Before They Go Viral.
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl font-normal leading-relaxed">
            Continuous deep web monitoring powered by Bright Data crawler clusters. 
            Tailor OpportunityOS AI to scan the live internet for scholarships, tech internships, startup grants, and accelerator programs matching your profile.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={onStart}
              id="btn-hero-launch"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:from-emerald-400 hover:to-teal-400 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all text-base w-full sm:w-auto flex items-center justify-center gap-3 cursor-pointer"
            >
              Start Discovering Now <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#interactive-demo"
              className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium hover:border-slate-700 transition-all text-base w-full sm:w-auto text-center"
            >
              Try Scraper Demo
            </a>
          </div>

          {/* Social proof / stats */}
          <div className="pt-8 border-t border-slate-900/60 grid grid-cols-3 gap-6">
            <div>
              <span className="block text-2xl font-bold text-white bg-gradient-to-r from-emerald-300 to-white bg-clip-text text-transparent">18,500+</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">Searched Daily</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-white bg-gradient-to-r from-emerald-300 to-white bg-clip-text text-transparent">89%</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">Scoring Accuracy</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-white bg-gradient-to-r from-emerald-300 to-white bg-clip-text text-transparent">&lt; 3 mins</span>
              <span className="text-slate-500 text-xs uppercase tracking-wider">Discovery Cycle</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Scraper Demo */}
        <div id="interactive-demo" className="flex-1 w-full max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl bg-slate-900/40 border border-slate-800 p-6 md:p-8 backdrop-blur-md shadow-2xl relative"
          >
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">Active Web Scraper</span>
              </div>
              <span className="text-xs font-mono text-slate-500">Node: Sandbox_EU</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Live Opportunity Discovery</h3>
            <p className="text-slate-400 text-sm mb-6">
              Input any target keyword. We will simulate a virtual Bright Data crawl to discover active, matching positions.
            </p>

            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={demoKeyword}
                  onChange={(e) => setDemoKeyword(e.target.value)}
                  placeholder="e.g. Stanford Scholarship, Remote Developer..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600 transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isScraping}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-450 hover:to-teal-450 font-bold transition-all disabled:opacity-55 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isScraping ? (
                  <>
                    <Cpu className="h-4 w-4 animate-spin" />
                    Crawling Live Web APIs...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Query Discover Agent
                  </>
                )}
              </button>
            </form>

            {/* Scraper Output Stream */}
            <div className="mt-6 border-t border-slate-800/80 pt-6">
              {isScraping && (
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-900 font-mono text-left space-y-1.5 text-xs text-slate-500">
                  <div className="text-emerald-400">Initializing Bright Data SERP cluster... OK</div>
                  <div>Querying target domain indexes for keyword: &quot;{demoKeyword}&quot;</div>
                  <div className="animate-pulse">Parsing descriptors & extracting eligibility criteria...</div>
                </div>
              )}

              {!isScraping && !demoResult && (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-600 text-sm">
                  Command line idle. Run a query to test live results.
                </div>
              )}

              {demoResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-950/80 rounded-xl p-5 border border-slate-850 text-left space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950/50 text-indigo-400 border border-indigo-500/20 uppercase mb-1.5 font-bold">
                        {demoResult.type}
                      </span>
                      <h4 className="font-bold text-white text-base leading-snug">{demoResult.title}</h4>
                      <p className="text-slate-400 text-xs font-medium">{demoResult.provider}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 text-2xl font-black">{demoResult.matchScore}%</div>
                      <span className="text-[9px] text-slate-500 font-mono uppercase">AI Score</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/55">
                    <p className="text-slate-300 text-xs font-normal leading-relaxed">
                      <strong>AI Match Reason:</strong> {demoResult.reason}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono pt-1">
                    <span className="text-amber-400 font-medium">Deadline: {demoResult.deadline}</span>
                    <span className="text-emerald-300 font-bold">{demoResult.fundingAmount}</span>
                  </div>

                  <button
                    onClick={onStart}
                    className="w-full py-2 px-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    Set Profile to Unlock Fully Custom Roadmaps <Sparkles className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Feature Bento Grid */}
      <section className="bg-slate-950 border-t border-slate-900 py-24 relative select-none">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              An End-to-End System for Next-Gen Applicants
            </h2>
            <p className="text-slate-400 text-base">
              Say goodbye to hours of bookmark digging and spreadsheet fatigue. Let AI handle the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-8 space-y-4 hover:border-slate-800 transition-all">
              <div className="h-12 w-12 rounded-xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center">
                <Database className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Live Monitoring Streams</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bright Data SERP crawls pull live data constantly. Find tenders, hackathons, and research grants that are rarely indexed on public boards.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-8 space-y-4 hover:border-slate-800 transition-all">
              <div className="h-12 w-12 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center">
                <Cpu className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Compatibility Matcher</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Calculates precise 0-100 fit scores based on your experience, academic level, specific skills, and career destination objectives.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-900 bg-slate-900/10 p-8 space-y-4 hover:border-slate-800 transition-all">
              <div className="h-12 w-12 rounded-xl bg-pink-950/50 border border-pink-500/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white">AI Action Roadmaps</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Generate tailored weekly step-by-step action plans to satisfy eligibility criteria, recommend certificates, and master core requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-8 px-6 bg-slate-950/20 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>© 2026 OpportunityOS AI Inc. Live Sandbox Environment.</div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition-colors">Bright Data Partner</span>
            <span className="hover:text-slate-400 transition-colors">Gemini Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
