/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  User, 
  Layers, 
  Shield, 
  Sparkles, 
  Cpu, 
  LogIn, 
  X, 
  MapPin, 
  LogOut, 
  Zap, 
  Clock 
} from 'lucide-react';
import { Opportunity, User as UserType, UserProfile, Notification, AdminStats } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import OpportunityDetails from './components/OpportunityDetails';
import ProfileSettings from './components/ProfileSettings';
import AdminPanel from './components/AdminPanel';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'profile' | 'admin'>('landing');
  const [user, setUser] = useState<UserType | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  
  // Modal controllers
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCountry, setAuthCountry] = useState('Germany');
  
  // Shared global resources
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 1,
    totalOpportunities: 8,
    queriesScrapedToday: 24,
    newOpportunitiesToday: 4
  });

  // Pull global databases on mount
  useEffect(() => {
    fetchSession();
    fetchOpportunities();
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed fetching automatic user session', err);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const res = await fetch('/api/opportunities');
      const data = await res.json();
      if (data.opportunities) {
        setOpportunities(data.opportunities);
      }
    } catch (err) {
      console.error('Failed fetching jobs & grants stream', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed retrieving alerts log', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setAdminStats(data.stats);
      }
    } catch (err) {
      console.error('Failed retrieving administrative statistics', err);
    }
  };

  // ----------------------------------------------------
  // INTERACTIVE API DISPATCH ACTIONS
  // ----------------------------------------------------
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, name: authName, country: authCountry }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setShowAuthModal(false);
        setCurrentView('dashboard');
        fetchStats();
      }
    } catch (err) {
      console.error('Credentials dispatch failure', err);
    }
  };

  const handleProfileSave = async (profile: UserProfile) => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, profile }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        fetchOpportunities(); // Recompute algorithmic scores instantly
      }
    } catch (err) {
      console.error('Failed syncing profiles on server database', err);
    }
  };

  const handleSaveToggle = async (opportunityId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch('/api/opportunities/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, opportunityId }),
      });
      const data = await res.json();
      if (data.success && data.savedOpportunities) {
        setUser({
          ...user,
          savedOpportunities: data.savedOpportunities
        });
      }
    } catch (err) {
      console.error('Save toggle failure', err);
    }
  };

  const handleApplyToggle = async (opportunityId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch('/api/opportunities/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, opportunityId }),
      });
      const data = await res.json();
      if (data.success && data.appliedOpportunities) {
        setUser({
          ...user,
          appliedOpportunities: data.appliedOpportunities
        });
      }
    } catch (err) {
      console.error('Apply toggle failure', err);
    }
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearNotifications = async () => {
    try {
      const res = await fetch('/api/notifications/clear', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScrapeRequest = async (keyword: string, category: string) => {
    try {
      const res = await fetch('/api/opportunities/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category }),
      });
      const data = await res.json();
      if (data.success && data.opportunity) {
        fetchOpportunities(); // Pull refreshed list showing scraped element on top!
        fetchNotifications();
        fetchStats();
      }
    } catch (err) {
      console.error('Failed triggering continuous scrapper monitoring', err);
    }
  };

  const handleResetDB = async () => {
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchSession();
        fetchOpportunities();
        fetchNotifications();
        fetchStats();
        setSelectedOpportunityId(null);
        setCurrentView('dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="opp-app-manifest" className="min-h-screen bg-[#020617] font-sans text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-slate-900 selection:font-bold">
      
      {/* Dynamic Navigation Top-Bar (Hidden during Landing page) */}
      {currentView !== 'landing' && (
        <header className="sticky top-0 bg-[#020617]/80 border-b border-slate-800 px-6 py-4 backdrop-blur-md z-30 select-none">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('landing')}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white italic">
                Opportunity<span className="text-indigo-400">OS</span>
              </span>
            </div>

            {/* View Switch Tabs */}
            <nav className="hidden md:flex items-center gap-1.5 p-1 bg-slate-900/60 border border-slate-800 rounded-xl">
              <button
                onClick={() => { setCurrentView('dashboard'); setSelectedOpportunityId(null); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-wide cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_8px_rgba(129,140,248,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => { setCurrentView('profile'); setSelectedOpportunityId(null); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-wide cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_8px_rgba(129,140,248,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => { setCurrentView('admin'); setSelectedOpportunityId(null); }}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-wide cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_8px_rgba(129,140,248,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                Admin Control
              </button>
            </nav>

            {/* Profile Avatar / Auth Controller */}
            <div className="flex items-center gap-4 select-none">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-white">{user?.name || 'Venture Guester'}</span>
                <span className="block text-[10px] font-mono text-slate-500">{user?.email || 'guest@sandbox.run'}</span>
              </div>
              
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white font-mono">
                {(user?.name || 'V')[0].toUpperCase()}
              </div>
              
              <button
                onClick={() => { setUser(null); setCurrentView('landing'); }}
                title="Log Out Session"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Containers Layout View Switch */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        
        {currentView === 'landing' && (
          <LandingPage 
            onStart={() => {
              if (user) {
                setCurrentView('dashboard');
              } else {
                setShowAuthModal(true);
              }
            }} 
            onScrapeDemo={(key) => {
              setShowAuthModal(true);
              setAuthEmail('koamidekoun@gmail.com');
              setAuthName('Koa Midekoun');
            }}
          />
        )}

        {currentView === 'dashboard' && (
          selectedOpportunityId ? (
            <OpportunityDetails
              opportunityId={selectedOpportunityId}
              userId={user?.id || 'usr-1'}
              onClose={() => setSelectedOpportunityId(null)}
              onSaveToggle={handleSaveToggle}
              onApplyToggle={handleApplyToggle}
              isSaved={user?.savedOpportunities.includes(selectedOpportunityId) || false}
              isApplied={user?.appliedOpportunities.includes(selectedOpportunityId) || false}
              opp={opportunities.find(o => o.id === selectedOpportunityId)!}
            />
          ) : (
            <Dashboard
              opportunities={opportunities}
              savedOpportunities={user?.savedOpportunities || []}
              appliedOpportunities={user?.appliedOpportunities || []}
              notifications={notifications}
              onSelect={setSelectedOpportunityId}
              onSaveToggle={handleSaveToggle}
              onApplyToggle={handleApplyToggle}
              onMarkRead={handleMarkNotifRead}
              onClearNotifications={handleClearNotifications}
              onScrape={handleScrapeRequest}
              userProfileSet={!!user?.profile?.educationLevel}
              onNavigateToProfile={() => setCurrentView('profile')}
            />
          )
        )}

        {currentView === 'profile' && (
          <ProfileSettings
            currentProfile={user?.profile}
            onSave={handleProfileSave}
            userId={user?.id || 'usr-1'}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel
            onResetDB={handleResetDB}
            stats={adminStats}
            scrapesCount={adminStats.queriesScrapedToday}
          />
        )}

      </div>

      {/* Credentials Authentication overlay panel popup */}
      <AnimatePresence>
        {showAuthModal && (
          <div id="auth-overlay" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 text-left relative"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  Access OpportunityOS AI
                </h3>
                <p className="text-slate-400 text-sm font-normal">
                  Initialize a secure local session and connect custom profile indices immediately.
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="koamidekoun@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    placeholder="Koa Midekoun"
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">Country of Origin</label>
                  <input
                    type="text"
                    required
                    value={authCountry}
                    onChange={(e) => setAuthCountry(e.target.value)}
                    placeholder="Germany"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-auth-overlay-submit"
                  className="w-full py-3 px-4 mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Confirm & Connect AI
                </button>
              </form>

              <div className="text-[10px] font-mono text-slate-500 text-center select-none border-t border-slate-800 pt-4">
                By entering, you establish a sandboxed administrative session.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent global mini floating status bar (Clean Design Guidelines compliant: Humble UI, no logs clutter) */}
      {currentView !== 'landing' && (
        <div className="bg-slate-950 border-t border-slate-800 py-4 px-6 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-indigo-400 rotate-spin-slow" />
              <span>Matching Engine: <span className="text-slate-300 font-bold uppercase">{process.env.GEMINI_API_KEY ? 'gemini-3.5-flash-active' : 'fallback-simulation'}</span></span>
            </div>
            <div className="flex items-center gap-4 select-none">
              <span className="hover:text-slate-400 cursor-pointer" onClick={() => setCurrentView('landing')}>Launch Page</span>
              <span>•</span>
              <span className="text-slate-600">Secure Sandboxed Container</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
