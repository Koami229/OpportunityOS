/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  Award, 
  FileCheck, 
  Cpu, 
  ShieldAlert 
} from 'lucide-react';
import { Opportunity, GapAnalysis, Roadmap } from '../types';
import { motion } from 'motion/react';

interface OpportunityDetailsProps {
  opportunityId: string;
  userId: string;
  onClose: () => void;
  onSaveToggle: (id: string) => void;
  onApplyToggle: (id: string) => void;
  isSaved: boolean;
  isApplied: boolean;
  opp: Opportunity;
}

export default function OpportunityDetails({
  opportunityId,
  userId,
  onClose,
  onSaveToggle,
  onApplyToggle,
  isSaved,
  isApplied,
  opp,
}: OpportunityDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matchScore, setMatchScore] = useState(opp.matchScore || 50);
  const [matchReason, setMatchReason] = useState(opp.matchReason || '');
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    // Run deep analysis dynamically on load for this opportunity using server-side Gemini 3.5 Flash
    const fetchAnalysis = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('/api/opportunities/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId, userId }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        
        setMatchScore(data.matchScore);
        setMatchReason(data.matchReason);
        setGapAnalysis(data.gapAnalysis);
        setRoadmap(data.roadmap);
      } catch (err: any) {
        console.error('Failed fetching custom opportunity AI analysis', err);
        setError('Connection to remote matching engine declined. Run the local solver.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [opportunityId, userId]);

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-indigo-400 bg-indigo-950/40 border-indigo-500/20 shadow-[0_0_8px_rgba(129,140,248,0.2)]';
    if (score >= 60) return 'text-purple-400 bg-purple-950/40 border-purple-500/20';
    return 'text-rose-400 bg-rose-950/40 border-rose-500/20';
  };

  const getUrgencyText = (deadlineStr: string) => {
    try {
      const deadline = new Date(deadlineStr);
      const diffTime = deadline.getTime() - Date.now();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return { text: 'Closed', color: 'text-slate-500 border-slate-800 bg-slate-900/40' };
      if (diffDays <= 14) return { text: `${diffDays} days left - Urgent`, color: 'text-rose-400 border-rose-500/20 bg-rose-950/20 animate-pulse' };
      return { text: `${diffDays} days remaining`, color: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/20' };
    } catch {
      return { text: 'Flexible deadline', color: 'text-slate-400 border-slate-800 bg-slate-900/20' };
    }
  };

  const urgency = getUrgencyText(opp.deadline);

  return (
    <div id="opp-details-parent" className="space-y-6 text-left max-w-7xl mx-auto">
      
      {/* Detail View Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <button
          onClick={onClose}
          id="btn-back-to-stream"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800 hover:border-indigo-500/30 text-xs font-semibold text-slate-350 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => onSaveToggle(opp.id)}
            id="btn-details-save"
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isSaved
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
                : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white hover:border-slate-850'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-indigo-400' : ''}`} />
            {isSaved ? 'Saved to Folders' : 'Save opportunity'}
          </button>

          <button
            onClick={() => onApplyToggle(opp.id)}
            id="btn-details-apply-state"
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isApplied
                ? 'bg-purple-950/40 border-purple-500/30 text-purple-300'
                : 'bg-indigo-600 hover:bg-indigo-550 text-white font-extrabold border-transparent shadow-lg shadow-indigo-600/25'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isApplied ? 'Application Commenced' : 'Record Application'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-4">
          <Cpu className="h-10 w-10 text-indigo-400 animate-spin mx-auto" strokeWidth={2.5} />
          <h4 className="text-white text-base font-bold">Assembling Real-Time AI Profiler Match...</h4>
          <p className="text-slate-400 text-sm max-w-sm mx-auto font-normal">
            Evaluating country constraints, required skill trees, certifications, and composing custom preparedness roadmaps.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Columns (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title / Header card */}
            <div className="p-6 bg-[#0f172a]/40 border border-slate-800/80 rounded-2xl relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl" />

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 border border-slate-800 text-slate-400">
                  {opp.type}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono border ${urgency.color} font-semibold`}>
                  {urgency.text}
                </span>
                {opp.fundingAmount && (
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 font-bold">
                    {opp.fundingAmount}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">{opp.title}</h2>
                <p className="text-indigo-400 text-sm sm:text-base font-semibold mt-1">{opp.provider}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 border-t border-slate-800/60 pt-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {opp.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Deadline: {new Date(opp.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Description Tab & Scope */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Project Description</h3>
              <p className="text-slate-400 text-sm sm:text-base font-normal leading-relaxed whitespace-pre-line p-5 bg-slate-900/10 rounded-2xl border border-slate-800/60">
                {opp.description}
              </p>
            </div>

            {/* Eligibility & Requirements Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-900/20 border border-slate-800/80 rounded-2xl space-y-4">
                <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest font-bold">Eligibility Constraints</h4>
                <ul className="space-y-2.5">
                  {opp.eligibility.map((el, index) => (
                    <li key={index} className="text-xs text-slate-300 font-normal leading-relaxed flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                      <span>{el}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-slate-900/20 border border-slate-800/80 rounded-2xl space-y-4">
                <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest font-bold">Requirements Check</h4>
                <ul className="space-y-2.5">
                  {opp.requirements.map((req, index) => (
                    <li key={index} className="text-xs text-slate-300 font-normal leading-relaxed flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Action Roadmap Timelines */}
            {roadmap && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white">AI Personalized Roadmap</h3>
                </div>

                <div className="relative border-l border-slate-850 ml-4 pl-6 space-y-8">
                  {roadmap.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-10 top-0.5 h-8 w-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center text-[10px] font-bold font-mono text-indigo-455 text-indigo-400 shadow-xl">
                        {idx + 1}
                      </span>

                      <div className="space-y-2.5">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-950/40 text-indigo-400 border border-indigo-550/20 font-bold uppercase">
                            {step.phase}
                          </span>
                          <span className="text-slate-500 text-xs font-mono">• Needed Time: {step.duration}</span>
                        </div>
                        <h4 className="text-white font-bold text-base leading-snug">{step.title}</h4>
                        <p className="text-slate-450 text-xs font-normal leading-relaxed max-w-2xl">{step.description}</p>
                        
                        {step.resources && step.resources.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {step.resources.map((res, rIdx) => (
                              <span key={rIdx} className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                                {res}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI MATCH PROFILE & GAP DETECTOR - (Right Column 1/3) */}
          <div className="space-y-6">
            
            {/* Compatibility Fit Card */}
            <div className="p-6 bg-slate-900/40 border border-slate-805 border-slate-800 rounded-2xl space-y-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 shadow-[0_4px_10px_rgba(99,102,241,0.2)]" />
              
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Profile Compatibility Score</span>
                <div className="flex justify-center items-end gap-1 font-mono">
                  <span className={`text-5xl font-black tracking-tighter ${matchScore >= 80 ? 'text-indigo-400' : 'text-purple-400'}`}>
                    {matchScore}
                  </span>
                  <span className="text-slate-600 font-bold text-lg">/100</span>
                </div>
              </div>

              {matchReason && (
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-left">
                  <p className="text-slate-300 text-xs font-normal leading-relaxed">
                    <strong>AI Explains:</strong> {matchReason}
                  </p>
                </div>
              )}

              <a
                href={opp.sourceUrl}
                target="_blank"
                referrerPolicy="no-referrer"
                id="btn-link-external-source"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-600/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
              >
                Launch Official Application <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Gap Detector analysis */}
            {gapAnalysis && (
              <div className="p-6 bg-slate-900/25 border border-slate-800/80 rounded-2xl space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Award className="h-4 w-4 text-indigo-400" />
                  <h4 className="text-sm font-mono text-slate-400 uppercase tracking-widest font-bold">Smart Gap Detector</h4>
                </div>

                {/* Missing Skillsets */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Missing Skillsets</span>
                  {gapAnalysis.missingSkills.length === 0 ? (
                    <span className="text-indigo-400 text-xs font-mono flex items-center gap-1">✓ No missing key skills detected!</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {gapAnalysis.missingSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-rose-950/20 text-rose-400 border border-rose-500/10 font-mono">
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Missing Certifications */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Unsatisfied Certs</span>
                  {gapAnalysis.missingCertifications.length === 0 ? (
                    <span className="text-indigo-400 text-xs font-mono flex items-center gap-1 font-semibold font-mono">✓ Profiles satisfy all required qualifications.</span>
                  ) : (
                    <ul className="space-y-1.5">
                      {gapAnalysis.missingCertifications.map((ct, idx) => (
                        <li key={idx} className="text-xs text-slate-400 leading-snug flex items-start gap-2">
                          <span className="h-1.5 w-1.5 bg-rose-400 rounded-full shrink-0 mt-1.5" />
                          <span>{ct}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Target Cert Recommendations */}
                {gapAnalysis.recs && gapAnalysis.recs.length > 0 && (
                  <div className="space-y-3 border-t border-slate-800 pt-4">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Gap Alignment Actions</span>
                    <ul className="space-y-2">
                      {gapAnalysis.recs.map((rc, idx) => (
                        <li key={idx} className="text-xs text-slate-350 font-normal leading-relaxed flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{rc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
