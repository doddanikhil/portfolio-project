// frontend/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Types
export interface Technology {
  id: number;
  name: string;
  category_name: string;
  proficiency: number;
  icon_url: string;
  description: string;
  color: string;
}

export interface TechCategory {
  id: number;
  name: string;
  order: number;
  technologies: Technology[];
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  tagline: string;
  thumbnail: string;
  hero_image?: string;
  technologies: Technology[];
  github_url: string;
  live_demo_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ProjectDetail extends Project {
  details?: {
    problem_statement: string;
    solution_approach: string;
    technology_justification: string;
    technical_architecture?: string;
    key_features: string[];
    performance_metrics: Array<{metric: string; improvement: string}>;
    challenges_solved: string;
    lessons_learned: string;
    code_snippets: Array<{title: string; language: string; code: string}>;
    demo_video_url: string;
  };
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  featured_image: string;
  reading_time: number;
  published_date: string;
  updated_date?: string;
  views: number;
}

export interface CareerHighlight {
  id: number;
  title: string;
  organization: string;
  date_range: string;
  description: string;
  metrics: string[];
  is_current: boolean;
}

export interface SiteMetadata {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  calendar_url: string;
  resume_url: string;
  meta_description: string;
  meta_keywords: string;
  years_experience: number;
  projects_completed: number;
  technologies_mastered: number;
  coffee_consumed: number;
}

export interface PortfolioStats {
  total_projects: number;
  featured_projects: number;
  technologies_mastered: number;
  years_experience: number;
  uptime_percentage: string;
  performance_improvement: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

// API Client
class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}/api/v1${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<{status: string; message: string}> {
    return this.request('/test/');
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request('/projects/');
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.request('/projects/?featured=true');
  }

  async getProject(slug: string): Promise<ProjectDetail> {
    return this.request(`/projects/${slug}/`);
  }

  // Technologies
  async getTechnologies(): Promise<Technology[]> {
    return this.request('/technologies/');
  }

  async getTechStack(): Promise<TechCategory[]> {
    return this.request('/tech-stack/');
  }

  // Site data
  async getStats(): Promise<PortfolioStats> {
    return this.request('/stats/');
  }

  async getMetadata(): Promise<SiteMetadata> {
    return this.request('/metadata/');
  }

  async getCareerHighlights(): Promise<CareerHighlight[]> {
    return this.request('/highlights/');
  }

  // Blog
  async getBlogPosts(category?: string): Promise<BlogPost[]> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request(`/blog/posts/${params}`);
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.request(`/blog/posts/${slug}/`);
  }

  async getRecentBlogPosts(): Promise<BlogPost[]> {
    return this.request('/blog/recent/');
  }

  // Contact
  async submitContact(data: ContactSubmission): Promise<{message: string}> {
    return this.request('/contact/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const api = new APIClient(API_BASE_URL);

// Export for SWR
export const fetcher = (url: string) => api.request(url);

// Utility functions
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}/api/v1${endpoint}`;

export default api;