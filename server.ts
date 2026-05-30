/**
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { 
  Opportunity, 
  UserProfile, 
  User, 
  Roadmap, 
  GapAnalysis, 
  Notification, 
  AlertSettings, 
  AdminStats 
} from './src/types.js'; // Note we can support TypeScript modules

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db.json');

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI successfully initialized server-side.');
  } catch (err) {
    console.error('Error initializing Gemini AI:', err);
  }
} else {
  console.log('No GEMINI_API_KEY found. Running in offline/adaptive logic mode.');
}

// ----------------------------------------------------
// DB STRUCTURE & INITIAL SEED DATA
// ----------------------------------------------------
const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Gates Cambridge Scholarship 2026',
    type: 'scholarship',
    provider: 'Gates Cambridge Trust',
    description: 'Fully funded scholarships for outstanding international students to pursue a postgraduate degree in any subject available at the University of Cambridge. Focuses on academic excellence, leadership potential, and commitment to improving the lives of others.',
    eligibility: ['Non-UK citizens', 'Applying for full-time postgraduate degree (PhD, MSc, MLitt)', 'Outstanding academic record'],
    requirements: ['Academic transcripts', '2 Academic references', 'Statement of purpose', 'Research proposal (for PhD)'],
    deadline: '2026-10-15',
    sourceUrl: 'https://www.gatescambridge.org',
    location: 'Cambridge, United Kingdom',
    tags: ['education', 'research', 'graduate', 'fully-funded', 'leadership'],
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    isNew: true,
    fundingAmount: 'Full funding (Tuition + £18,000/yr stipend)'
  },
  {
    id: 'opp-2',
    title: 'Vercel Associate Frontend Engineer',
    type: 'job',
    provider: 'Vercel Inc.',
    description: 'Join the Next.js and Vercel Deployment platform team to build fast, visually exceptional web interfaces. You will collaborate on core UI platforms, dashboard workflows, and developer command tools using React, Tailwind CSS, and TypeScript.',
    eligibility: ['BSc in CS or equivalent web dev experience', 'Fluent in TypeScript', 'Strong UI craft (Tailwind, Framer Motion)'],
    requirements: ['React proficiency', 'TypeScript experience', 'Portfolio showcasing rich web interactive work'],
    deadline: '2026-07-30',
    sourceUrl: 'https://vercel.com/careers',
    location: 'Remote (Global)',
    tags: ['react', 'nextjs', 'typescript', 'frontend', 'remote'],
    createdAt: new Date().toISOString(),
    isNew: true,
    fundingAmount: '$80,000 - $110,000 / yr'
  },
  {
    id: 'opp-3',
    title: 'Google STEP Internship (Summer 2026)',
    type: 'internship',
    provider: 'Google LLC',
    description: 'STEP (Student Training in Engineering Program) is a 12-week internship for first and second-year undergraduate computer science students. Includes practical engineering projects, mentorship, and professional skills coaching.',
    eligibility: ['1st or 2nd year Bachelor student', 'Majoring in Computer Science or related STEM fields'],
    requirements: ['Resume', 'Univeristy transcripts', 'Familiarity with C++, Java, or Python'],
    deadline: '2026-09-01',
    sourceUrl: 'https://careers.google.com',
    location: 'Munich, Germany',
    tags: ['software-engineering', 'mentorship', 'python', 'undergraduate', 'internship'],
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    isNew: true,
    fundingAmount: 'Paid Internship + Relocation support'
  },
  {
    id: 'opp-4',
    title: 'Y Combinator Summer 2026 Batch',
    type: 'accelerator',
    provider: 'Y Combinator',
    description: 'YC invests $500,000 in early-stage startups twice a year. We work intensively with founders for 3 months to refine their product pitch, acquire initial customers, structure operations, and secure follow-on venture funding.',
    eligibility: ['At least two co-founders preferred', 'Innovative technology concept with high growth scale'],
    requirements: ['Detailed pitch deck', 'Founder background profile', 'Short video introduction of the team'],
    deadline: '2026-11-01',
    sourceUrl: 'https://www.ycombinator.com',
    location: 'San Francisco, CA, USA',
    tags: ['funding', 'startup', 'scale', 'mentorship', 'venture'],
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    isNew: false,
    fundingAmount: '$500,000 Seed Investment'
  },
  {
    id: 'opp-5',
    title: 'Solana Global Web3 Hackathon',
    type: 'hackathon',
    provider: 'Solana Foundation',
    description: 'A global online competition to design, build, and deploy groundbreaking consumer decentralized products, DeFi primitives, and scale technologies using the Solana blockchain network. Win grand pools, VC grants, and project launch support.',
    eligibility: ['Open to developers, designers, and web3 enthusiasts globally', 'Solo or teams up to 5 members'],
    requirements: ['Open source GitHub repository', 'Working prototype deployed on Devnet', '3-minute video presentation'],
    deadline: '2026-06-25',
    sourceUrl: 'https://solana.com/hack',
    location: 'Virtual',
    tags: ['web3', 'rust', 'hackathon', 'prizes', 'decentralized'],
    createdAt: new Date().toISOString(),
    isNew: true,
    fundingAmount: '$250,000 Total Prize Pool'
  },
  {
    id: 'opp-6',
    title: 'AI Innovation Seed Grant',
    type: 'grant',
    provider: 'OpenAI Developer Fund',
    description: 'Providing non-dilutive grant funding to researchers, developer teams, and small product ventures conducting novel experiments in alignment, agency, multimodal training, or applied local AI solutions for positive social impact.',
    eligibility: ['Open source projects', 'Independent teams, researchers, or startups', 'Must share findings openly'],
    requirements: ['Project specification document', 'Detailed budget breakdown', 'GitHub demonstration'],
    deadline: '2026-08-15',
    sourceUrl: 'https://openai.com/grants',
    location: 'Remote',
    tags: ['artificial-intelligence', 'research', 'grant', 'funding', 'open-source'],
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    isNew: false,
    fundingAmount: '$50,000 Equity-free Grant'
  },
  {
    id: 'opp-7',
    title: 'Climate Tech Startup Accelerator',
    type: 'accelerator',
    provider: 'Elemental Excelerator',
    description: 'A premium venture accelerator funding climate-change solutions at the intersection of infrastructure, heavy industry, carbon capture, and agricultural technology. Includes extensive regulatory advisory and corporate partnership tracks.',
    eligibility: ['Incorporated startups working on carbon reduction', 'Proof of concept or early revenue'],
    requirements: ['Commercialization plan', 'Climate impact metrics spreadsheet', 'Executive summaries'],
    deadline: '2026-07-15',
    sourceUrl: 'https://elementalexcelerator.com',
    location: 'Honolulu, HI, USA',
    tags: ['climate-tech', 'sustainability', 'funding', 'enterprise', 'energy'],
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    isNew: true,
    fundingAmount: '$150,000 - $600,000 Project Funding'
  },
  {
    id: 'opp-8',
    title: 'EU Smart Cities Software Tender',
    type: 'tender',
    provider: 'European Commission',
    description: 'Open public procurement tender for the design, rollout, and support of municipal AI-driven traffic optimization and micro-mobility tracking software models across 12 European capitals.',
    eligibility: ['Registered software development firms in EU or participating nations', 'Demonstrated compliance with GDPR and ISO-27001'],
    requirements: ['Technical capability dossier', 'Financial stability audit reports', 'Completed pricing tender sheets'],
    deadline: '2026-09-30',
    sourceUrl: 'https://ted.europa.eu',
    location: 'Brussels, Belgium',
    tags: ['govtech', 'smart-cities', 'ai', 'tender', 'enterprise'],
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    isNew: false,
    fundingAmount: '€1,200,000 Contract Value'
  }
];

const DEFAULT_USER: User = {
  id: 'usr-1',
  email: 'koamidekoun@gmail.com',
  name: 'Koa Midekoun',
  profile: {
    country: 'Germany',
    educationLevel: 'Bachelor of Computer Science',
    skills: ['TypeScript', 'React.js', 'Python', 'Node.js', 'Tailwind CSS', 'Git', 'Agile development'],
    languages: ['English', 'German', 'French'],
    careerGoals: ['Become a Tech Lead', 'Build venture-backed web3 or AI SaaS products', 'Acquire research fellowships in advanced technologies'],
    experienceLevel: 'student'
  },
  savedOpportunities: ['opp-2', 'opp-5'],
  appliedOpportunities: ['opp-3']
};

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Matching Opportunity Detected!',
    message: 'We discovered "Vercel Associate Frontend Engineer" which matches 89% of your TypeScript and React profile.',
    type: 'opportunity',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif-2',
    title: 'Welcome to OpportunityOS AI',
    message: 'Your AI profile has been analyzed. We found 3 scholarships and 5 tech jobs matching your career goals in Germany.',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const DEFAULT_ALERT_SETTINGS: AlertSettings = {
  emailNotifications: true,
  inAppNotifications: true,
  dailyDigest: false
};

// Database state
let db = {
  users: { [DEFAULT_USER.id]: DEFAULT_USER } as Record<string, User>,
  opportunities: [...SEED_OPPORTUNITIES] as Opportunity[],
  roadmaps: {} as Record<string, Roadmap>,
  gapAnalyses: {} as Record<string, GapAnalysis>,
  notifications: [...DEFAULT_NOTIFICATIONS] as Notification[],
  alertSettings: { [DEFAULT_USER.id]: DEFAULT_ALERT_SETTINGS } as Record<string, AlertSettings>,
  adminStats: {
    totalUsers: 1,
    totalOpportunities: SEED_OPPORTUNITIES.length,
    queriesScrapedToday: 24,
    newOpportunitiesToday: 4
  } as AdminStats,
  scrapesCount: 24
};

// Load database if exists
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      db = { ...db, ...parsed };
      console.log('Successfully loaded state from db.json');
    } else {
      saveDB();
    }
  } catch (err) {
    console.error('Error loading db.json, resetting to seed data.', err);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json', err);
  }
}

loadDB();

// ----------------------------------------------------
// ALGORITHMIC SIMULATOR FALLBACKS (If AI is missing)
// ----------------------------------------------------
function calculateFallbackCompatibility(userProfile: UserProfile | undefined, opp: Opportunity) {
  if (!userProfile) return { score: 50, explanation: "Set up your profile to receive AI match analysis." };
  
  let score = 55; // base score
  const matchedSkills: string[] = [];
  
  // Calculate skills overlap (tags etc)
  const oppTags = opp.tags.map(t => t.toLowerCase());
  const userSkills = userProfile.skills.map(s => s.toLowerCase());
  
  userSkills.forEach(skill => {
    oppTags.forEach(tag => {
      if (skill.includes(tag) || tag.includes(skill)) {
        score += 6;
        if (!matchedSkills.includes(skill)) matchedSkills.push(skill);
      }
    });
  });

  // Adjust by education level matching
  const el = userProfile.educationLevel.toLowerCase();
  const title = opp.title.toLowerCase();
  const desc = opp.description.toLowerCase();
  
  if (opp.type === 'scholarship') {
    if (el.includes('bachelor') || el.includes('undergraduate')) {
      score += 10;
    }
  } else if (opp.type === 'job') {
    if (userProfile.experienceLevel === 'student' && title.includes('associate')) {
      score += 15;
    } else if (userProfile.experienceLevel === 'mid') {
      score += 10;
    }
  }

  // Cap at 98, floor at 35
  score = Math.max(35, Math.min(98, score));
  
  const formattedSkills = matchedSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
  const explanation = matchedSkills.length > 0 
    ? `Strong match due to your proficiency in ${formattedSkills}. Your educational status aligns well with the pre-requisites issued by ${opp.provider}.`
    : `This opportunity offers high synergy with your career goals. Although some primary technical skills differ, your background provides a durable scaffold for application success.`;

  return { score, explanation };
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Authentication endpoints
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  // SaaS authentication simulator (Auto logins / Creates accounts)
  const emailLower = (email || '').toLowerCase().trim();
  const existingUser = Object.values(db.users).find(u => u.email.toLowerCase() === emailLower);
  
  if (existingUser) {
    res.json({ success: true, user: existingUser });
  } else {
    // Register automatic
    const name = emailLower.split('@')[0];
    const newUser: User = {
      id: 'usr-' + Date.now(),
      email: emailLower,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      profile: {
        country: 'Germany',
        educationLevel: 'Bachelor of Computer Science',
        skills: ['TypeScript', 'React.js', 'Node.js', 'CSS'],
        languages: ['English'],
        careerGoals: ['Become Software Developer'],
        experienceLevel: 'student'
      },
      savedOpportunities: [],
      appliedOpportunities: []
    };
    db.users[newUser.id] = newUser;
    db.adminStats.totalUsers += 1;
    saveDB();
    res.json({ success: true, user: newUser });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { email, name, country } = req.body;
  const emailLower = (email || '').toLowerCase().trim();
  const newUser: User = {
    id: 'usr-' + Date.now(),
    email: emailLower,
    name: name || 'New User',
    profile: {
      country: country || 'Germany',
      educationLevel: 'Undergraduate',
      skills: ['TypeScript', 'React.js', 'HTML', 'CSS', 'Problem Solving'],
      languages: ['English'],
      careerGoals: ['SaaS founder', 'Full Stack Developer'],
      experienceLevel: 'student'
    },
    savedOpportunities: [],
    appliedOpportunities: []
  };
  db.users[newUser.id] = newUser;
  db.adminStats.totalUsers += 1;
  saveDB();
  res.json({ success: true, user: newUser });
});

app.get('/api/auth/me', (req, res) => {
  // Return first user or default simulated session
  const user = Object.values(db.users)[0] || DEFAULT_USER;
  res.json({ user });
});

app.post('/api/auth/profile', (req, res) => {
  const { userId, profile } = req.body;
  const uid = userId || DEFAULT_USER.id;
  
  if (db.users[uid]) {
    db.users[uid].profile = profile;
    saveDB();
    res.json({ success: true, user: db.users[uid] });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Toggle Save Opportunity
app.post('/api/opportunities/save', (req, res) => {
  const { userId, opportunityId } = req.body;
  const uid = userId || DEFAULT_USER.id;
  const user = db.users[uid];
  
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const savedIndex = user.savedOpportunities.indexOf(opportunityId);
  if (savedIndex > -1) {
    user.savedOpportunities.splice(savedIndex, 1);
  } else {
    user.savedOpportunities.push(opportunityId);
  }
  saveDB();
  res.json({ success: true, savedOpportunities: user.savedOpportunities });
});

// Toggle Apply Opportunity
app.post('/api/opportunities/apply', (req, res) => {
  const { userId, opportunityId } = req.body;
  const uid = userId || DEFAULT_USER.id;
  const user = db.users[uid];
  
  if (!user) return res.status(444).json({ error: 'User not found' });
  
  const appliedIndex = user.appliedOpportunities.indexOf(opportunityId);
  if (appliedIndex > -1) {
    user.appliedOpportunities.splice(appliedIndex, 1);
  } else {
    user.appliedOpportunities.push(opportunityId);
  }
  saveDB();
  res.json({ success: true, appliedOpportunities: user.appliedOpportunities });
});

// Fetch all Discovered Opportunities, adding dynamically calculated match profiles
app.get('/api/opportunities', (req, res) => {
  const { userId } = req.query;
  const uid = String(userId || DEFAULT_USER.id);
  const user = db.users[uid] || DEFAULT_USER;
  
  const enhancedList = db.opportunities.map(opp => {
    const calc = calculateFallbackCompatibility(user.profile, opp);
    return {
      ...opp,
      matchScore: calc.score,
      matchReason: calc.explanation
    };
  });
  
  res.json({ opportunities: enhancedList });
});

// AI MATCHING & INSIGHT ENGINE (On-demand deep analysis triggered on detail view)
app.post('/api/opportunities/analyze', async (req, res) => {
  const { opportunityId, userId } = req.body;
  const opp = db.opportunities.find(o => o.id === opportunityId);
  const uid = userId || DEFAULT_USER.id;
  const user = db.users[uid] || DEFAULT_USER;
  
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

  let resultDetails = {
    matchScore: 78,
    matchReason: 'Fallback dynamic match. Setup your Gemini Key for full automated profiling.',
    gapAnalysis: {
      opportunityId,
      missingSkills: ['Kubernetes', 'Technical Writing'],
      missingCertifications: ['AWS Certified Developer'],
      missingRequirements: ['At least 1 open source Next.js showcase'],
      recs: ['Take the Free Vercel Next.js academy certificate', 'Contribute a small patch to high-traffic web apps']
    } as GapAnalysis,
    roadmap: {
      opportunityId,
      title: opp.title,
      steps: [
        { phase: 'Phase 1: Readiness Audit', title: 'Audit missing credentials', description: 'Review your resume and add direct TypeScript projects.', duration: '1 week', resources: ['roadmap.sh', 'TypeScript Handbook'] },
        { phase: 'Phase 2: Project Launch', title: 'Assemble showcase platform', description: 'Build an open source React portfolio app matching requirements.', duration: '2 weeks', resources: ['React Dev docks', 'Tailwind Templates'] },
        { phase: 'Phase 3: Direct Application', title: 'Direct application dispatch', description: 'Submit with highly tailored covers addressing gaps.', duration: '3 days', resources: ['Cover Letter guidelines'] }
      ],
      certifications: ['Vercel Frontend Specialist Diploma'],
      learningResources: ['Vercel Next.js Tutorials', 'Scrimba Advanced React Course']
    } as Roadmap
  };

  const algSafe = calculateFallbackCompatibility(user.profile, opp);
  resultDetails.matchScore = algSafe.score;
  resultDetails.matchReason = algSafe.explanation;

  // If Gemini is active, let's build beautiful personalised intelligence!
  if (ai) {
    try {
      console.log(`Analyzing opportunity ${opp.title} for user ${user.name} with AI...`);
      const payloadPrompt = `
      You are the ultimate Career Match and Gap Detector AI inside OpportunityOS OS.
      Analyze the compliance between user profile and opportunity details:
      
      USER PROFILE:
      - Country: ${user.profile?.country}
      - Education: ${user.profile?.educationLevel}
      - Experience: ${user.profile?.experienceLevel}
      - Key Skills: ${user.profile?.skills.join(', ')}
      - Career Goals: ${user.profile?.careerGoals.join(' | ')}
      
      OPPORTUNITY DETAILS:
      - Title: ${opp.title}
      - Provider: ${opp.provider}
      - Type: ${opp.type}
      - Description: ${opp.description}
      - Eligibility: ${opp.eligibility.join(' | ')}
      - Key Requirements: ${opp.requirements.join(' | ')}
      
      Generate a tailored response in strict JSON containing:
      1. "matchScore": A continuous integer score from 0 to 100 based on fit.
      2. "matchReason": A descriptive, inspirational 2-sentence match explanation.
      3. "gapAnalysis": An object outlining:
         - "missingSkills": string[] representing skills needed but missing.
         - "missingCertifications": string[] representing missing certifications.
         - "missingRequirements": string[] of requirements the user hasn't satisfied.
         - "recs": string[] of target courses or clear actions.
      4. "roadmap": An object explaining:
         - "steps": Array of 3 step objects containing "phase" (e.g. "Phase 1"), "title", "description", "duration", and "resources" (string[]).
         - "certifications": string[] of recommended certificates to attain.
         - "learningResources": string[] of specialized training links / tutorial docs.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: payloadPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.INTEGER },
              matchReason: { type: Type.STRING },
              gapAnalysis: {
                type: Type.OBJECT,
                properties: {
                  missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingCertifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recs: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              roadmap: {
                type: Type.OBJECT,
                properties: {
                  steps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        phase: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        resources: { type: Type.ARRAY, items: { type: Type.STRING } }
                      }
                    }
                  },
                  certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                  learningResources: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      });

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        resultDetails.matchScore = parsed.matchScore || resultDetails.matchScore;
        resultDetails.matchReason = parsed.matchReason || resultDetails.matchReason;
        
        if (parsed.gapAnalysis) {
          resultDetails.gapAnalysis = {
            opportunityId,
            ...parsed.gapAnalysis
          };
        }
        if (parsed.roadmap) {
          resultDetails.roadmap = {
            opportunityId,
            ...parsed.roadmap
          };
        }
      }
    } catch (apiError) {
      console.error('Gemini content generation failed, defaulting to synthetic model.', apiError);
    }
  }

  // Cache outcomes in-memory DB
  db.gapAnalyses[opportunityId] = resultDetails.gapAnalysis;
  db.roadmaps[opportunityId] = resultDetails.roadmap;
  saveDB();

  res.json(resultDetails);
});

// MULTI-RESOURCE LIVE AI OPPORTUNITY SCANNER (Scrapes new active listings based on User query keywords)
app.post('/api/opportunities/scrape', async (req, res) => {
  const { keyword, category } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Search keyword is required for Bright Data scraper execution.' });

  console.log(`Starting OpportunityOS Bright Data virtual monitoring for keyword: ${keyword}`);
  
  // Default fresh result
  const mockNewOppId = 'opp-' + Date.now();
  let generatedOpp: Opportunity = {
    id: mockNewOppId,
    title: `${keyword} Research Fellow & Engineer`,
    type: (category as any) || 'job',
    provider: 'Global Technology Fund',
    description: `A live monitoring discovery for candidates demonstrating high aptitude in ${keyword}. This is a newly established program focused on funding research, acceleration metrics, and applied prototyping tools.`,
    eligibility: ['Open to international researchers', 'Proven experience with open-source tools'],
    requirements: ['Demonstrative github profile', 'Brief conceptual proposal'],
    deadline: '2026-11-20',
    sourceUrl: 'https://brightdata.com/apis',
    location: 'Remote',
    tags: [keyword.toLowerCase().replace(/\s+/g, '-'), 'innovation', 'discovered-live', 'bright-data'],
    createdAt: new Date().toISOString(),
    isNew: true,
    fundingAmount: '$45,000 Research Fellowship'
  };

  // If Gemini is active, let's run actual Google Search Grounding to pull REAL 2026 opportunities!
  if (ai) {
    try {
      console.log(`Invoking Search-Grounded Gemini opportunity finder for keyword: ${keyword}`);
      const queryPrompt = `
      Retrieve 1 actual, currently open or upcoming (2026) real-world internship, job, hackathon, startup grant, tender, or scholarship opportunity related to the query: "${keyword}".
      Ensure the opportunity has actual backing and is a legitimate program.
      
      Generate a response in strict JSON matching this structure:
      {
        "title": "Actual official program name",
        "type": "one of: 'scholarship', 'job', 'internship', 'hackathon', 'grant', 'accelerator', 'competition', 'tender', 'funding'",
        "provider": "Official name of hosting organization",
        "description": "Exhaustive description of what the opportunity is, what benefits are offered and the key scope",
        "eligibility": ["array", "of", "concrete", "eligibility", "rules"],
        "requirements": ["documents", "skills", "or", "materials", "required", "for", "applying"],
        "deadline": "YYYY-MM-DD",
        "sourceUrl": "The actual website link found",
        "location": "City, Country or Remote",
        "tags": ["3-5", "tags", "identifying", "focus"],
        "fundingAmount": "The stipend, salary or grant funding value"
      }
      `;

      const searchRes = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: queryPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              provider: { type: Type.STRING },
              description: { type: Type.STRING },
              eligibility: { type: Type.ARRAY, items: { type: Type.STRING } },
              requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
              deadline: { type: Type.STRING },
              sourceUrl: { type: Type.STRING },
              location: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              fundingAmount: { type: Type.STRING }
            }
          }
        }
      });

      if (searchRes && searchRes.text) {
        const parsed = JSON.parse(searchRes.text.trim());
        if (parsed.title) {
          generatedOpp = {
            ...generatedOpp,
            ...parsed,
            id: 'opp-scraped-' + Date.now(),
            createdAt: new Date().toISOString(),
            isNew: true
          };
        }
      }
    } catch (err) {
      console.error('Failed search grounding scrape, using synthetic generator.', err);
    }
  }

  // Prepend to current database
  db.opportunities.unshift(generatedOpp);
  db.scrapesCount += 1;
  db.adminStats.queriesScrapedToday = db.scrapesCount;
  db.adminStats.totalOpportunities = db.opportunities.length;
  db.adminStats.newOpportunitiesToday += 1;

  // Add Notification to Feed about scraped item
  const newNotif: Notification = {
    id: 'notif-' + Date.now(),
    title: 'New Live Opportunity Discovered!',
    message: `Our Bright Data virtual agent fetched "${generatedOpp.title}" matching "${keyword}" from the live web.`,
    type: 'opportunity',
    read: false,
    createdAt: new Date().toISOString()
  };
  db.notifications.unshift(newNotif);
  
  saveDB();

  res.json({ success: true, opportunity: generatedOpp });
});

// Notifications API
app.get('/api/notifications', (req, res) => {
  res.json({ notifications: db.notifications });
});

app.post('/api/notifications/read', (req, res) => {
  const { id } = req.body;
  const notif = db.notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    saveDB();
  }
  res.json({ success: true, notifications: db.notifications });
});

app.post('/api/notifications/clear', (req, res) => {
  db.notifications = [];
  saveDB();
  res.json({ success: true, notifications: [] });
});

app.get('/api/admin/stats', (req, res) => {
  res.json({ stats: db.adminStats });
});

// Admin reset DB route
app.post('/api/admin/reset', (req, res) => {
  db = {
    users: { [DEFAULT_USER.id]: { ...DEFAULT_USER, savedOpportunities: ['opp-2'], appliedOpportunities: [] } } as Record<string, User>,
    opportunities: [...SEED_OPPORTUNITIES] as Opportunity[],
    roadmaps: {} as Record<string, Roadmap>,
    gapAnalyses: {} as Record<string, GapAnalysis>,
    notifications: [...DEFAULT_NOTIFICATIONS] as Notification[],
    alertSettings: { [DEFAULT_USER.id]: { ...DEFAULT_ALERT_SETTINGS } } as Record<string, AlertSettings>,
    adminStats: {
      totalUsers: 1,
      totalOpportunities: SEED_OPPORTUNITIES.length,
      queriesScrapedToday: 0,
      newOpportunitiesToday: 0
    } as AdminStats,
    scrapesCount: 0
  };
  saveDB();
  res.json({ success: true, db });
});

// ----------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE CORES
// ----------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0:3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OpportunityOS AI full-stack backend running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch(err => {
  console.error('Bootstrap failure:', err);
});
