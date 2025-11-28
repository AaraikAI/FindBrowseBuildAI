

import { 
  Megaphone, Palette, Layout, Calendar, Mail, FileText, 
  Magnet, Filter, Share2, Users, FileCode, Map, FileJson, 
  Rocket, BarChart, DollarSign, Search, MessageSquare, Briefcase, Zap
} from 'lucide-react';

export const CATEGORIES = [
  'All',
  'SaaS',
  'E-commerce',
  'Mobile App',
  'Content Creator',
  'Marketplace',
  'AI/ML',
  'Health & Wellness',
  'FinTech',
  'EdTech',
  'Sustainability',
  'Hardware',
  'Service'
];

export const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export const CARD_COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
];

export const SAMPLE_IDEAS: any[] = [
  {
    title: "PlantParent AI",
    oneLiner: "Your personal AI botanist for thriving house plants.",
    emoji: "🌿",
    category: "AI/ML",
    difficulty: "Medium",
    problem: "People love buying plants but kill them due to lack of knowledge about specific care needs.",
    solution: "An app that identifies plants via camera and creates a customized watering/fertilizing schedule with AI diagnostics for sick plants.",
    targetAudience: "Urban millennials, gardening hobbyists.",
    monetization: ["Freemium subscription", "Affiliate links for fertilizers"],
    tags: ["AI", "Green", "Lifestyle"],
    mvpFeatures: ["Photo ID", "Reminders", "Care Database"],
    color: "#10b981"
  }
];

export interface ModuleDef {
  id: string;
  title: string;
  icon: any;
  description: string;
  useSearch?: boolean;
  promptInstruction?: string;
}

export const MODULE_CATEGORIES: { id: string; title: string; modules: ModuleDef[] }[] = [
  {
    id: 'creative',
    title: 'Creative & Brand',
    modules: [
      { 
        id: 'ad_creative', 
        title: 'Ad Creative', 
        icon: Megaphone, 
        description: 'High converting ad copy and creative concepts',
        promptInstruction: 'Generate 3 variations of high-converting ad copy (Headline, Body, CTA). Describe the visual creative concepts for each.'
      },
      { 
        id: 'brand_package', 
        title: 'Brand Package', 
        icon: Palette, 
        description: 'Identity, colors, and voice',
        promptInstruction: 'Create a complete brand identity: Logo concept, Color Palette (Hex codes), Typography choices, and Tone of Voice guidelines.' 
      },
      { 
        id: 'landing_page', 
        title: 'Landing Page', 
        icon: Layout, 
        description: 'Copy and wireframe blocks',
        promptInstruction: 'Outline the Landing Page structure: Hero Header, Value Prop, Feature Blocks, Social Proof, and CTA. Provide copy for each section.'
      },
      { 
        id: 'tweet_page', 
        title: 'Tweet Landing Page', 
        icon: Share2, 
        description: 'Ultra-minimal 280-character page',
        promptInstruction: 'Create a "Tweet-sized" landing page concept. The entire value prop and call to action must fit within 280 characters.'
      },
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing Strategy',
    modules: [
      { 
        id: 'content_calendar', 
        title: '90-Day Content Plan', 
        icon: Calendar, 
        description: 'Strategic content roadmap',
        promptInstruction: 'Create a 90-day content marketing calendar. Break it down by weeks, defining themes, content formats (Blog, Video, Social), and channels.'
      },
      { 
        id: 'email_funnel', 
        title: 'Email Funnel System', 
        icon: Filter, 
        description: 'Sequences, triggers & flows',
        promptInstruction: 'Design a complete email marketing funnel. Define Triggers, Segmentation logic, and a step-by-step Flow Diagram description.'
      },
      { 
        id: 'email_sequence', 
        title: 'Nurture Sequence', 
        icon: Mail, 
        description: '5-email welcome series',
        promptInstruction: 'Write a 5-email nurture sequence. For each email, provide the Subject Line, Objective, and a summary of the Body Copy.'
      },
      { 
        id: 'lead_magnet', 
        title: 'Lead Magnet', 
        icon: Magnet, 
        description: 'Irresistible offer ideas',
        promptInstruction: 'Brainstorm 3 irresistible lead magnet ideas. For each, define the Title, Format (PDF, Webinar, etc.), and the specific problem it solves.'
      },
      { 
        id: 'sales_funnel', 
        title: 'Sales Funnel', 
        icon: Zap, 
        description: 'Customer journey optimization',
        promptInstruction: 'Map out the Sales Funnel stages: Awareness, Interest, Decision, Action. Describe the strategy and key touchpoints for each stage.'
      },
      { 
        id: 'seo_content', 
        title: 'SEO Strategy', 
        icon: Search, 
        description: 'Keywords and content plan', 
        useSearch: true,
        promptInstruction: 'Identify 10 high-potential SEO keywords with search intent. Outline 3 pillar content article titles to target these keywords.'
      },
      { 
        id: 'user_personas', 
        title: 'User Personas', 
        icon: Users, 
        description: 'Detailed customer cards',
        promptInstruction: 'Create detailed User Personas (e.g., "Manager Mark"). Include Demographics, Psychographics, Pain Points, Motivations, and Jobs to be Done.'
      },
    ]
  },
  {
    id: 'product',
    title: 'Product Development',
    modules: [
      { 
        id: 'feature_specs', 
        title: 'Feature Specs', 
        icon: FileCode, 
        description: 'Detailed specifications',
        promptInstruction: 'Write detailed feature specifications for the MVP. Include User Stories, Acceptance Criteria, and Technical Constraints.'
      },
      { 
        id: 'mvp_roadmap', 
        title: 'MVP Roadmap', 
        icon: Map, 
        description: '90-day development plan',
        promptInstruction: 'Create a 90-day MVP development roadmap. Divide into 3 Sprints. List prioritized features and deliverables for each sprint.'
      },
      { 
        id: 'prd', 
        title: 'PRD', 
        icon: FileText, 
        description: 'Product Requirements Doc',
        promptInstruction: 'Draft a comprehensive Product Requirements Document (PRD). Sections: Problem, Goals, Non-Goals, User Stories, Technical Architecture, Risks. IMPORTANT: Search for competitors or standards and cite sources inline.'
      },
    ]
  },
  {
    id: 'business',
    title: 'Business & Research',
    modules: [
      { 
        id: 'gtm_launch', 
        title: 'GTM Launch', 
        icon: Rocket, 
        description: 'Launch timeline & coordination',
        promptInstruction: 'Create a GTM Launch Calendar. Define activities for Pre-launch (T-30 days), Launch Week, and Post-launch (T+30 days).'
      },
      { 
        id: 'gtm_strategy', 
        title: 'GTM Strategy', 
        icon: Briefcase, 
        description: 'Go-to-market plan', 
        useSearch: true,
        promptInstruction: 'Develop a Go-To-Market Strategy. Define Target Channels, Messaging Framework, and Strategic Partnerships.'
      },
      { 
        id: 'kpi_dashboard', 
        title: 'KPI Dashboard', 
        icon: BarChart, 
        description: 'Metrics tracker',
        promptInstruction: 'Design a KPI Dashboard. List the key metrics to track, the exact Formulas for calculating them, and success Benchmarks.'
      },
      { 
        id: 'pricing_strategy', 
        title: 'Pricing Strategy', 
        icon: DollarSign, 
        description: 'Pricing framework', 
        useSearch: true,
        promptInstruction: 'Develop a Pricing Strategy. Propose 3 tiers (e.g., Free, Pro, Business). Define price points, included features, and psychology behind the pricing.'
      },
      { 
        id: 'competitive_analysis', 
        title: 'Competitive Analysis', 
        icon: Search, 
        description: 'Market gap analysis', 
        useSearch: true,
        promptInstruction: 'Conduct a Competitive Analysis. Identify 3 real competitors. Analyze their Strengths, Weaknesses, and your opportunities for differentiation.'
      },
      { 
        id: 'customer_interviews', 
        title: 'Interview Guide', 
        icon: MessageSquare, 
        description: 'Validation questions',
        promptInstruction: 'Create a Customer Interview Guide. List 10 structured open-ended questions to validate the problem, solution, and pricing with potential users.'
      },
    ]
  }
];
