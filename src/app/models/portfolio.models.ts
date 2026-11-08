/**
 * models/portfolio.models.ts
 *
 * TypeScript interfaces matching the structure of /assets/data/data.json
 * Every component uses these types — keeps data contracts consistent.
 */

// ─── PERSONAL INFO ────────────────────────────────────────────────────────
export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  openTo: string;
  resumeUrl: string;
  about: string;
  photo: string;
}

// ─── STAT CARD (hero section numbers) ────────────────────────────────────
export interface Stat {
  label: string;
  value: string;
  icon: string;
}

// ─── SKILLS ───────────────────────────────────────────────────────────────
export interface SkillDomain {
  domain: string;
  color: string;       // hex color used for the domain card accent
  icon: string;        // emoji icon for the domain
  items: string[];     // individual skill names
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────
export type TimelineType = 'achievement' | 'career' | 'education';

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  type: TimelineType;
}

// ─── EXPERIENCE (the filterable list) ────────────────────────────────────
export type ExperienceType = 'project' | 'research' | 'incident' | 'leadership';

export interface Experience {
  id: string;
  title: string;
  summary: string;
  tags: string[];          // used for multi-select filter
  domain: string[];        // high-level category
  type: ExperienceType;
  impact: string;          // one-liner outcome stat
  year: number;
  featured: boolean;
}

// ─── PROJECTS (case study page) ───────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  problem: string;         // problem → approach → outcome narrative
  approach: string;
  outcome: string;
  stack: string[];
  year: number;
  github: string | null;
  demo: string | null;
  featured: boolean;
}

// ─── SYSTEM DESIGN ────────────────────────────────────────────────────────
export interface DesignDecision {
  question: string;
  answer: string;
}

export interface SystemDesign {
  id: string;
  title: string;
  context: string;
  decisions: DesignDecision[];
  tags: string[];
}

// ─── RESEARCH ─────────────────────────────────────────────────────────────
export type ResearchType = 'experiment' | 'paper' | 'writeup';

export interface Research {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  year: number;
  link: string | null;
  type: ResearchType;
}

// ─── ROOT DATA SHAPE ──────────────────────────────────────────────────────
// This matches the top-level structure of data.json
export interface PortfolioData {
  personal: PersonalInfo;
  stats: Stat[];
  skills: SkillDomain[];
  timeline: TimelineItem[];
  experiences: Experience[];
  projects: Project[];
  systemDesigns: SystemDesign[];
  research: Research[];
  allTags: string[];
}

// ─── FILTER STATE (used in FilterService) ────────────────────────────────
export type FilterMode = 'any' | 'all';

export interface FilterState {
  selectedTags: string[];
  matchMode: FilterMode;
  searchQuery: string;
}

// ─── COMMAND PALETTE RESULT ───────────────────────────────────────────────
export interface CommandResult {
  id: string;
  title: string;
  type: 'experience' | 'project' | 'research' | 'system-design' | 'navigation';
  route: string;           // where to navigate on click
  tags?: string[];
}
