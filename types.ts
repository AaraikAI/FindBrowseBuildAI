
export interface Idea {
  id: string;
  title: string;
  oneLiner: string;
  emoji: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problem: string;
  solution: string;
  targetAudience: string;
  monetization: string[];
  tags: string[];
  mvpFeatures: string[];
  color: string;
  artifacts?: Record<string, Artifact>;
}

export interface Artifact {
  id: string; // The module ID (e.g., 'ad_creative')
  title: string; // Title of the artifact
  sections: ArtifactSection[];
  sources?: Array<{ uri: string; title: string }>; // For grounded responses
  createdAt: number;
}

export interface ArtifactSection {
  title: string;
  type: 'text' | 'list' | 'key-value' | 'markdown';
  content: string | string[] | Record<string, string>;
}

export enum ViewMode {
  EXPLORE = 'EXPLORE',
  SAVED = 'SAVED',
}

export type GenerationStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

export interface FilterState {
  search: string;
  category: string | 'All';
  difficulty: string | 'All';
}
