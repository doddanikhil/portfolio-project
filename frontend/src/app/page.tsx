'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Github, ExternalLink, Calendar, MapPin, Mail, Coffee } from 'lucide-react';
import { 
  getFeaturedProjects, 
  getRecentBlogPosts, 
  getSiteMetadata, 
  getSiteStats,
  handleAPIError,
  type Project, 
  type BlogPost, 
  type SiteMetadata, 
  type SiteStats 
} from '@/lib/api';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteMetadata | null>(null);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, blogData, configData, statsData] = await Promise.all([
          getFeaturedProjects(),
          getRecentBlogPosts(),
          getSiteMetadata(),
          getSiteStats(),
        ]);

        setFeaturedProjects(projectsData);
        setRecentPosts(blogData);
        setSiteConfig(configData);
        setStats(statsData);
      } catch (err) {
        console.error('Homepage data fetch error:', err);
        setError(handleAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Unable to Load Portfolio</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Profile Image */}
          {siteConfig?.profile_image && (
            <div className="mb-8">
              <img 
                src={siteConfig.profile_image} 
                alt={siteConfig.name}
                className="w-32 h-32 rounded-full mx-auto border-4 border-white/20 shadow-2xl"
              />
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {siteConfig?.name || 'Nikhil Dodda'}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-4">
            {siteConfig?.tagline || 'Applied AI Engineer'}
          </p>
          
          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            {siteConfig?.bio || 'Building intelligent applications that solve real business problems.'}
          </p>
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.years_experience}+</div>
                <div className="text-sm text-white/70">Years Experience</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.projects_completed}</div>
                <div className="text-sm text-white/70">Projects</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white">{stats.technologies_mastered}</div>
                <div className="text-sm text-white/70">Technologies</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <Coffee className="w-5 h-5" />
                  {stats.coffee_consumed}
                </div>
                <div className="text-sm text-white/70">Cups of Coffee</div>
              </div>
            </div>
          )}
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              View My Work
              <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {siteConfig?.calendar_url && (
              <Link
                href={siteConfig.calendar_url}
                target="_blank"
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all backdrop-blur-sm border border-white/20 hover:border-white/40"
              >
                <Calendar className="w-5 h-5 mr-2 inline-block" />
                Let's Connect
              </Link>
            )}
          </div>
          
          {/* Contact Info */}
          {siteConfig && (
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/60">
              {siteConfig.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{siteConfig.location}</span>
                </div>
              )}
              {siteConfig.email && (
                <Link 
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{siteConfig.email}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-xl text-white/70">Showcasing my latest work in AI and software engineering</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.slug} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105">
                  {project.thumbnail && (
                    <img 
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-white/70 mb-4 line-clamp-2">{project.tagline}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech.name}
                        className="px-3 py-1 text-xs rounded-full border"
                        style={{ 
                          color: tech.color || '#3B82F6',
                          borderColor: tech.color || '#3B82F6'
                        }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex-1 text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                    
                    {project.github_url && (
                      <Link
                        href={project.github_url}
                        target="_blank"
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </Link>
                    )}
                    
                    {project.live_demo_url && (
                      <Link
                        href={project.live_demo_url}
                        target="_blank"
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 px-4 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Latest Insights</h2>
              <p className="text-xl text-white/70">Thoughts on AI, technology, and software engineering</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105">
                    {post.featured_image && (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}
                    
                    <div className="text-sm text-blue-400 mb-2">{post.category}</div>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex justify-between items-center text-sm text-white/50">
                      <span>{post.reading_time} min read</span>
                      <span>{new Date(post.published_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20"
              >
                Read More Articles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}