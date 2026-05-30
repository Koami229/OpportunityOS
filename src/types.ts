/**
 * SPDX-License-Identifier: Apache-2.0
 */

export type OpportunityType =
  | 'scholarship'
  | 'job'
  | 'internship'
  | 'hackathon'
  | 'grant'
  | 'accelerator'
  | 'competition'
  | 'tender'
  | 'funding';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  provider: string;
  description: string;
  eligibility: string[];
  requirements: string[];
  deadline: string;
  sourceUrl: string;
  matchScore?: number;
  matchReason?: string;
  location: string;
  tags: string[];
  createdAt: string;
  isNew: boolean;
  fundingAmount?: string;
}

export interface UserProfile {
  country: string;
  educationLevel: string;
  skills: string[];
  languages: string[];
  careerGoals: string[];
  experienceLevel: 'student' | 'entry' | 'mid' | 'senior' | 'expert';
}

export interface User {
  id: string;
  email: string;
  name: string;
  profile?: UserProfile;
  savedOpportunities: string[];
  appliedOpportunities: string[];
}

export interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  duration: string;
  resources: string[];
}

export interface Roadmap {
  opportunityId: string;
  title: string;
  steps: RoadmapStep[];
  certifications: string[];
  learningResources: string[];
}

export interface GapAnalysis {
  opportunityId: string;
  missingSkills: string[];
  missingCertifications: string[];
  missingRequirements: string[];
  recs: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'opportunity' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AlertSettings {
  emailNotifications: boolean;
  inAppNotifications: boolean;
  dailyDigest: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalOpportunities: number;
  queriesScrapedToday: number;
  newOpportunitiesToday: number;
}
