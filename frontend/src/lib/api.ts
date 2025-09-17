const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface Technology {
  name: string;
  category: string;
  proficiency?: number;
  description?: string;
  icon_url?: string;
}

export interface Project {
  title: string;
  slug: string;
  tagline: string;
  thumbnail?: string;
  is_featured: boolean;
  github_url?: string;
  live_demo_url?: string;
  technologies: Technology[];
  created_at: string;
  updated_at?: string;
  details?: ProjectDetails;
}

export interface ProjectDetails {
  problem_statement: string;
  solution_approach: string;
  technology_justification: string;
  technical_architecture?: string;
  key_features: string[];
  performance_metrics: Array<{
    metric: string;
    improvement?: string;
    achievement?: string;
  }>;
  challenges_solved: string;
  demo_video_url?: string;
  lessons_learned: string;
}

export interface TechCategory {
  category: string;
  order: number;
  technologies: Technology[];
}

export const api = {
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/projects/`);
    if (!response.ok) throw new Error('Failed to fetch projects');
    return response.json();
  },

  async getProject(slug: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/v1/projects/${slug}/`);
    if (!response.ok) throw new Error('Failed to fetch project');
    return response.json();
  },

  async getTechnologies(): Promise<TechCategory[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/technologies/`);
    if (!response.ok) throw new Error('Failed to fetch technologies');
    return response.json();
  },

  async testConnection(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/v1/test/`);
    if (!response.ok) throw new Error('Failed to connect to API');
    return response.json();
  }
};