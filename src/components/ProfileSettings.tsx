/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, Sparkles, Check, Plus, Trash2, Info, GraduationCap, Code, Compass, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileSettingsProps {
  currentProfile?: UserProfile;
  onSave: (profile: UserProfile) => Promise<void>;
  userId: string;
}

const PRESET_SKILLS = [
  'TypeScript', 'React.js', 'Python', 'Node.js', 'Rust', 'Tailwind CSS', 
  'Next.js', 'Docker', 'Solidity', 'PyTorch', 'Data Analysis', 
  'Academic Writing', 'Git', 'Agile development', 'Proposal Writing'
];

export default function ProfileSettings({ currentProfile, onSave, userId }: ProfileSettingsProps) {
  const [country, setCountry] = useState(currentProfile?.country || 'Germany');
  const [educationLevel, setEducationLevel] = useState(currentProfile?.educationLevel || 'Bachelor of Computer Science');
  const [skills, setSkills] = useState<string[]>(currentProfile?.skills || ['TypeScript', 'React.js', 'Node.js']);
  const [languages, setLanguages] = useState<string[]>(currentProfile?.languages || ['English']);
  const [careerGoals, setCareerGoals] = useState<string[]>(currentProfile?.careerGoals || ['Become a Software Engineer']);
  const [experienceLevel, setExperienceLevel] = useState<'student' | 'entry' | 'mid' | 'senior' | 'expert'>(currentProfile?.experienceLevel || 'student');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  const handleAddSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(it => it !== skill));
  };

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const l = langInput.trim();
    if (l && !languages.includes(l)) {
      setLanguages([...languages, l]);
    }
    setLangInput('');
  };

  const handleRemoveLanguage = (lang: string) => {
    setLanguages(languages.filter(it => it !== lang));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const g = goalInput.trim();
    if (g && !careerGoals.includes(g)) {
      setCareerGoals([...careerGoals, g]);
    }
    setGoalInput('');
  };

  const handleRemoveGoal = (goal: string) => {
    setCareerGoals(careerGoals.filter(it => it !== goal));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    
    const payload: UserProfile = {
      country,
      educationLevel,
      skills,
      languages,
      careerGoals,
      experienceLevel
    };

    try {
      await onSave(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="profile-settings-view" className="space-y-8 select-none text-left max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-indigo-400" />
            AI Applicant Profiler
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Configure your professional qualifications, skills, and goals to feed our matching calculators.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Info card */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/30 border border-slate-800/80 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Country of Residence</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Germany, Canada, Remote"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans text-left font-mono"
            >
              <option value="student">Student / Undergraduate</option>
              <option value="entry">Entry-Level Enthusiast</option>
              <option value="mid">Mid-Career Professional</option>
              <option value="senior">Senior Engineer / Researcher</option>
              <option value="expert">Principal Fellow / Subject Expert</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Current Academic Credentials / Education Level</label>
            <div className="relative">
              <GraduationCap className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="text"
                required
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                placeholder="e.g. Master of Science in Data Engineering"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left font-mono"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Skill Tree builder */}
        <div className="p-6 rounded-2xl bg-[#0f172a]/30 border border-slate-800/80 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Your Technical & Professional Skill Tree</h3>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type skill (e.g. Python, Machine Learning) and press Enter or Add"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left font-mono"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Add List
              </button>
            </div>

            {/* Quick Presets list */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">Quick Recommendations</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SKILLS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddSkill(item)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                      skills.includes(item)
                        ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/20'
                        : 'bg-slate-900 text-slate-500 border border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Skills tag row */}
            <div className="space-y-2 border-t border-slate-800 pt-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider block">Active Skillsets Added</span>
              {skills.length === 0 ? (
                <div className="text-slate-600 text-xs py-3">No skills configured. Setup at least 2 skill presets to boost matching.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-955 bg-slate-900 border border-slate-800 rounded-xl text-xs text-indigo-300 font-semibold flex items-center gap-1.5 select-none hover:border-slate-800">
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(tag)} 
                        className="text-slate-650 hover:text-rose-400 font-bold ml-1 text-[10px]"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>        {/* Spoken Languages Panel & Career Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Spoken Languages Card */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/30 border border-slate-805 border-slate-800 shadow-xl space-y-4">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold tracking-widest block">Spoken Languages</span>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={langInput}
                onChange={(e) => setLangInput(e.target.value)}
                placeholder="e.g. English, French, Japanese"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left font-mono"
              />
              <button
                type="button"
                onClick={handleAddLanguage}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 text-xs font-bold rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {languages.map((lng, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-350 text-xs rounded-xl font-medium flex items-center gap-1">
                  {lng}
                  <button type="button" onClick={() => handleRemoveLanguage(lng)} className="text-slate-600 hover:text-rose-400 font-bold ml-1 text-[9px]">✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* Goals Card */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/30 border border-slate-805 border-slate-800 shadow-xl space-y-4">
            <span className="text-xs font-mono text-slate-500 uppercase font-bold tracking-widest block">Application Destination Targets & Goals</span>

            <div className="flex gap-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="e.g. Tech Lead, Venture Backed SaaS, Scholarship"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-left font-mono"
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 text-xs font-bold rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {careerGoals.map((g, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-350 text-xs rounded-xl font-medium flex items-center gap-1">
                  {g}
                  <button type="button" onClick={() => handleRemoveGoal(g)} className="text-slate-600 hover:text-rose-400 font-bold ml-1 text-[9px]">✕</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Global Save Controls */}
        <div className="flex items-center gap-4 justify-end pt-4 border-t border-slate-800 max-w-4xl">
          {saveSuccess && (
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-indigo-400 text-xs font-semibold"
            >
              ✓ Profile persistent databases updated successfully!
            </motion.span>
          )}

          <button
            type="submit"
            disabled={saving}
            id="btn-profile-save"
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-sm transition-all shadow-lg hover:shadow-indigo-600/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Synchronizing Profiles...' : 'Commit Profiles & Recalculate Matches'}
          </button>
        </div>

      </form>
    </div>
  );
}
