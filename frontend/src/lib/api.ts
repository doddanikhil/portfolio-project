import axios from 'axios';
import type {
  Project,
  ProjectWithDetails,
  BlogPost,
  Technology,
  TechCategory,
  CareerHighlight,
  SiteConfig,
  PortfolioStats,
  ContactForm
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Project APIs
export const projectsApi = {
  getAll: (params?: { featured?: boolean; tech?: string }) => 
    api.get<Project[]>('/projects/', { params }),
  
  getBySlug: (slug: string) => 
    api.get<ProjectWithDetails>(`/projects/${slug}/`),
  
  getFeatured: () => 
    api.get<Project[]>('/projects/', { params: { featured: true } }),
};

// Blog APIs
export const blogApi = {
  getAll: (params?: { category?: string }) => 
    api.get<BlogPost[]>('/blog/posts/', { params }),
  
  getBySlug: (slug: string) => 
    api.get<BlogPost>(`/blog/posts/${slug}/`),
  
  getRecent: () => 
    api.get<BlogPost[]>('/blog/recent/'),
};

// Technology APIs
export const techApi = {
  getAll: () => 
    api.get<Technology[]>('/technologies/'),
  
  getTechStack: () => 
    api.get<TechCategory[]>('/tech-stack/'),
};

// Core APIs
export const coreApi = {
  getHighlights: () => 
    api.get<CareerHighlight[]>('/core/highlights/'),
  
  getConfig: () => 
    api.get<SiteConfig>('/core/config/'),
  
  getStats: () => 
    api.get<PortfolioStats>('/core/stats/'),
  
  submitContact: (data: ContactForm) => 
    api.post('/core/contact/', data),
};

// Error handling wrapper
export const apiCall = async <T>(
  apiFunction: () => Promise<{ data: T }>
): Promise<T> => {
  try {
    const response = await apiFunction();
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
