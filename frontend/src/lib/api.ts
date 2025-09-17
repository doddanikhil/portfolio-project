const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface Technology {
  name: string;
  category: string;
  proficiency?: number;
  description?: string;
  icon_url?: string;
  color?: string;
}

export interface Project {
  title: string;
  slug: string;
  tagline: string;
  thumbnail?: string;
  hero_image?: string;
  is_featured: boolean;
  github_url?: string;
  live_demo_url?: string;
  technologies: Technology[];
  created_at: string;
  updated_at?: string;
  priority?: number;
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
  code_snippets?: Array<{
    title: string;
    language: string;
    code: string;
  }>;
}

export interface TechCategory {
  category: string;
  order: number;
  technologies: Technology[];
}

export interface CareerHighlight {
  title: string;
  organization: string;
  date_range: string;
  description: string;
  metrics: Array<{
    metric: string;
    value: string;
  }>;
  technologies: Technology[];
  order: number;
  is_current: boolean;
}

export interface SiteMetadata {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  resume_url?: string;
  calendar_url?: string;
  profile_image?: string;
  hero_video?: string;
  meta_description: string;
  meta_keywords: string;
}

export interface SiteStats {
  years_experience: number;
  projects_completed: number;
  technologies_mastered: number;
  blog_posts_written: number;
  total_blog_views: number;
  coffee_consumed: number;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  featured_image?: string;
  reading_time: number;
  published_date: string;
  updated_date?: string;
  views: number;
  is_featured?: boolean;
  meta_description?: string;
  meta_keywords?: string;
}

export interface BlogCategory {
  key: string;
  name: string;
  count: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}/api/v1${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Test connection
  async testConnection(): Promise<any> {
    return this.request('/test/');
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request('/projects/');
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.request('/projects/featured/');
  }

  async getProject(slug: string): Promise<Project> {
    return this.request(`/projects/${slug}/`);
  }

  // Technologies
  async getTechStack(): Promise<TechCategory[]> {
    return this.request('/tech-stack/');
  }

  // Career
  async getCareerHighlights(): Promise<CareerHighlight[]> {
    return this.request('/highlights/');
  }

  // Site data
  async getSiteMetadata(): Promise<SiteMetadata> {
    return this.request('/metadata/');
  }

  async getSiteStats(): Promise<SiteStats> {
    return this.request('/stats/');
  }

  // Blog
  async getBlogPosts(params?: { category?: string; search?: string }): Promise<BlogPost[]> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request(`/blog/posts/${query ? `?${query}` : ''}`);
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.request(`/blog/posts/${slug}/`);
  }

  async getRecentBlogPosts(): Promise<BlogPost[]> {
    return this.request('/blog/recent/');
  }

  async getBlogCategories(): Promise<BlogCategory[]> {
    return this.request('/blog/categories/');
  }

  // Contact
  async submitContact(data: ContactFormData): Promise<APIResponse<any>> {
    return this.request('/contact/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Create singleton instance
export const api = new APIClient();

// Export individual functions for backward compatibility
export const getProjects = () => api.getProjects();
export const getFeaturedProjects = () => api.getFeaturedProjects();
export const getProject = (slug: string) => api.getProject(slug);
export const getTechStack = () => api.getTechStack();
export const getCareerHighlights = () => api.getCareerHighlights();
export const getSiteMetadata = () => api.getSiteMetadata();
export const getSiteStats = () => api.getSiteStats();
export const getBlogPosts = (params?: { category?: string; search?: string }) => api.getBlogPosts(params);
export const getBlogPost = (slug: string) => api.getBlogPost(slug);
export const getRecentBlogPosts = () => api.getRecentBlogPosts();
export const getBlogCategories = () => api.getBlogCategories();
export const submitContact = (data: ContactFormData) => api.submitContact(data);
export const testConnection = () => api.testConnection();

// Error handling utility
export const handleAPIError = (error: any): string => {
  if (error.message?.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check if the backend is running.';
  }
  if (error.message?.includes('404')) {
    return 'The requested resource was not found.';
  }
  if (error.message?.includes('500')) {
    return 'Server error. Please try again later.';
  }
  return error.message || 'An unexpected error occurred.';
};

// Development utilities
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API health check for development
if (isDevelopment && typeof window !== 'undefined') {
  api.testConnection()
    .then(() => console.log('✅ API connection successful'))
    .catch((error) => console.error('❌ API connection failed:', error));
}