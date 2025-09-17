
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Technology {
  id: number;
  name: string;
  category?: string;
  category_name?: string;
  proficiency: number;
  description: string;
  icon_url?: string;
}

export interface Project {
  id: number;
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
}

export interface BlogPost {
  id: number;
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
}

export interface SiteConfig {
  site_name: string;
  tagline: string;
  bio: string;
  profile_image?: string;
  resume_file?: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  bluesky_handle?: string;
  cal_com_username?: string;
  meta_description: string;
  meta_keywords: string;
  show_resume_download?: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

export interface CareerHighlight {
  id: number;
  title: string;
  organization: string;
  date_range: string;
  description: string;
  metrics: string[];
  is_current: boolean;
  order: number;
}

export interface PortfolioStats {
  total_projects: number;
  featured_projects: number;
  technologies_mastered: number;
  years_experience: number;
  uptime_percentage: string;
  performance_improvement: string;
}

// Simple fetch wrapper
async function apiCall<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Return empty/default data for development
    return getDefaultData<T>(endpoint);
  }
}

// Default data for development
function getDefaultData<T>(endpoint: string): T {
  const defaults: Record<string, any> = {
    '/projects/': [],
    '/blog/recent/': [],
    '/core/config/': {
      site_name: 'Nikhil Dodda',
      tagline: 'Applied AI Engineer specializing in production LLM systems',
      bio: 'Applied AI Engineer with a passion for building intelligent systems.',
      email: 'doddanikhil@gmail.com',
      github_url: 'https://github.com/doddanikhil',
      bluesky_handle: '@devdn.bsky.social',
      cal_com_username: 'dnpro',
      meta_description: 'Applied AI Engineer specializing in production LLM systems',
      meta_keywords: 'AI Engineer, Machine Learning, LLM, RAG Systems'
    },
    '/core/stats/': {
      total_projects: 5,
      featured_projects: 3,
      technologies_mastered: 15,
      years_experience: 2,
      uptime_percentage: '99.9',
      performance_improvement: '40'
    },
    '/core/highlights/': []
  };
  
  return defaults[endpoint] || {} as T;
}

export const api = {
  async getProjects(): Promise<Project[]> {
    return apiCall('/projects/');
  },

  async getProject(slug: string): Promise<Project> {
    return apiCall(`/projects/${slug}/`);
  },

  async getFeaturedProjects(): Promise<Project[]> {
    return apiCall('/projects/?featured=true');
  },

  async getBlogPosts(category?: string): Promise<BlogPost[]> {
    const endpoint = category ? `/blog/posts/?category=${category}` : '/blog/posts/';
    return apiCall(endpoint);
  },

  async getBlogPost(slug: string): Promise<BlogPost> {
    return apiCall(`/blog/posts/${slug}/`);
  },

  async getRecentPosts(): Promise<BlogPost[]> {
    return apiCall('/blog/recent/');
  },

  async getSiteConfig(): Promise<SiteConfig> {
    return apiCall('/core/config/');
  },

  async getCareerHighlights(): Promise<CareerHighlight[]> {
    return apiCall('/core/highlights/');
  },

  async getPortfolioStats(): Promise<PortfolioStats> {
    return apiCall('/core/stats/');
  },

  async submitContact(data: ContactForm): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/core/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      throw error;
    }
  }
};