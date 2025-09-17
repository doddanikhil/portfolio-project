export interface Technology {
    id: number;
    name: string;
    category_name?: string;
    category?: string;
    proficiency: number;
    icon_url: string;
    description: string;
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
    technologies: Technology[];
    github_url?: string;
    live_demo_url?: string;
    is_featured: boolean;
    created_at: string;
    updated_at?: string;
  }
  
  export interface ProjectDetail {
    problem_statement: string;
    solution_approach: string;
    technology_justification: string;
    technical_architecture?: string;
    key_features: string[];
    performance_metrics: Record<string, any>;
    challenges_solved: string;
    demo_video_url?: string;
  }
  
  export interface ProjectWithDetails extends Project {
    details: ProjectDetail;
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
  
  export interface PortfolioStats {
    total_projects: number;
    featured_projects: number;
    technologies_mastered: number;
    years_experience: number;
    uptime_percentage: string;
    performance_improvement: string;
  }
  
  export interface ContactForm {
    name: string;
    email: string;
    company?: string;
    subject: string;
    message: string;
  }