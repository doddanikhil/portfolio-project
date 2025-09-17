'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Calendar, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { projectsApi, blogApi, coreApi, apiCall } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Project, BlogPost, SiteConfig, PortfolioStats } from '@/lib/types';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, blogData, configData, statsData] = await Promise.all([
          apiCall(() => projectsApi.getFeatured()),
          apiCall(() => blogApi.getRecent()),
          apiCall(() => coreApi.getConfig()),
          apiCall(() => coreApi.getStats()),
        ]);

        setFeaturedProjects(projectsData.slice(0, 3));
        setRecentPosts(blogData.slice(0, 3));
        setSiteConfig(configData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <HeroSection config={siteConfig} stats={stats} />
      
      {/* Featured Projects */}
      <ProjectsSection projects={featuredProjects} loading={loading} />
      
      {/* Recent Blog Posts */}
      <BlogSection posts={recentPosts} loading={loading} />
      
      {/* Contact CTA */}
      <ContactSection config={siteConfig} />
    </>
  );
}

// Hero Section Component
function HeroSection({ 
  config, 
  stats 
}: { 
  config: SiteConfig | null; 
  stats: PortfolioStats | null; 
}) {
  const taglines = [
    "Building Production LLM Systems",
    "Scaling AI Infrastructure", 
    "Creating Intelligent Applications",
    "Applied AI Engineer"
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-primary font-medium mb-4"
          >
            👋 Hello, I'm
          </motion.p>

          {/* Name */}
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-6">
            {config?.site_name || 'Nikhil Dodda'}
          </h1>

          {/* Tagline with Typewriter Effect */}
          <div className="h-16 flex items-center justify-center mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium">
              {config?.tagline || 'Applied AI Engineer'}
            </h2>
          </div>

          {/* Stats Grid */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto"
            >
              <StatCard number={stats.total_projects} label="Projects" />
              <StatCard number={stats.technologies_mastered} label="Technologies" />
              <StatCard number={`${stats.uptime_percentage}%`} label="Uptime" />
              <StatCard number={`${stats.performance_improvement}%`} label="Faster" />
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/projects" className="btn-primary flex items-center gap-2">
              <span>View My Work</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link href="/connect" className="btn-secondary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Let's Connect</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Stats Card Component
function StatCard({ number, label }: { number: string | number; label: string }) {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
      <div className="text-2xl sm:text-3xl font-bold text-primary">
        {number}
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

// Projects Section Component
function ProjectsSection({ projects, loading }: { projects: Project[]; loading: boolean }) {
  if (loading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container">
          <div className="h-12 bg-muted rounded mx-auto mb-6 max-w-md animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                <div className="h-48 bg-muted rounded mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded mb-4" />
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-muted rounded" />
                  <div className="h-6 w-16 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-world AI applications built with production-ready architecture,
            focusing on measurable impact and scalable solutions.
          </p>
        </motion.div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No featured projects yet.
            </p>
            <Link
              href="/projects"
              className="text-primary hover:text-primary/80 font-medium"
            >
              View all projects →
            </Link>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/projects" className="btn-primary">
            View All Projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Project Card Component
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-card rounded-lg border border-border overflow-hidden card-hover"
    >
      {project.is_featured && (
        <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
          Featured
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-2xl font-bold text-muted-foreground">
              {project.title.split(' ').map(word => word[0]).join('')}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.tagline}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech.id}
              className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
          >
            Learn More →
          </Link>
          
          <div className="flex gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Blog Section Component
function BlogSection({ posts, loading }: { posts: BlogPost[]; loading: boolean }) {
  if (loading) {
    return (
      <section className="section-padding">
        <div className="container">
          <div className="h-12 bg-muted rounded mx-auto mb-6 max-w-md animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
                <div className="h-4 w-20 bg-muted rounded mb-3" />
                <div className="h-6 bg-muted rounded mb-3" />
                <div className="h-16 bg-muted rounded mb-4" />
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-4 w-16 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Latest Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thoughts on AI engineering, production systems, and the future of intelligent applications.
          </p>
        </motion.div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-card rounded-lg border border-border overflow-hidden card-hover"
              >
                {post.featured_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3 capitalize">
                    {post.category.replace('-', ' ')}
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.published_date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.reading_time} min read
                      </div>
                    </div>
                    
                    <div className="text-xs">
                      {post.# Blog Pages & Homepage