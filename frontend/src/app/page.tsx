'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getRecentBlogPosts, getSiteMetadata, getSiteStats, handleAPIError, type BlogPost, type SiteMetadata, type SiteStats } from '@/lib/api';

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteMetadata | null>(null);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, configData, statsData] = await Promise.all([
          getRecentBlogPosts(),
          getSiteMetadata(),
          getSiteStats(),
        ]);

        setRecentPosts(postsData);
        setSiteConfig(configData);
        setStats(statsData);
      } catch (err) {
        console.error('Homepage error:', err);
        setError(handleAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/80">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Portfolio</h1>
          <p className="text-gray-600 dark:text-white/70 mb-6">{error}</p>
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
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        {/* Dark mode background */}
        <div className="dark:block hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-full"></div>
        {/* Light mode background */}
        <div className="light:block dark:hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-full"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Profile Image */}
            {siteConfig?.profile_image && (
              <div className="w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white/30 dark:border-white/30 border-gray-300/50">
                <img
                  src={siteConfig.profile_image}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              {siteConfig?.name || "Nikhil Dodda"}
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 mb-8 font-medium">
              {siteConfig?.tagline || "Applied AI Engineer"}
            </p>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              {siteConfig?.bio || "Building intelligent applications that solve real business problems with production LLM systems and scalable cloud infrastructure."}
            </p>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.years_experience}+
                  </div>
                  <div className="text-gray-600 dark:text-white/70 text-sm">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.projects_completed}+
                  </div>
                  <div className="text-gray-600 dark:text-white/70 text-sm">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.technologies_mastered}+
                  </div>
                  <div className="text-gray-600 dark:text-white/70 text-sm">Technologies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.blog_posts_written}+
                  </div>
                  <div className="text-gray-600 dark:text-white/70 text-sm">Blog Posts</div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
              >
                View My Work
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 bg-gray-200/50 hover:bg-gray-300/50 text-gray-900 dark:text-white rounded-lg font-medium transition-all border border-gray-300/50 dark:border-white/20"
              >
                About Me
              </Link>
              
              {siteConfig?.calendar_url && (
                <Link
                  href={siteConfig.calendar_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 dark:bg-white/10 dark:hover:bg-white/20 bg-gray-200/50 hover:bg-gray-300/50 text-gray-900 dark:text-white rounded-lg font-medium transition-all border border-gray-300/50 dark:border-white/20"
                >
                  <Calendar className="w-5 h-5" />
                  Let's Connect
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts - Only if available */}
      {recentPosts.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest Insights</h2>
              <p className="text-xl text-gray-700 dark:text-white/80">Thoughts on AI, technology, and software engineering</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/40 transition-all hover:transform hover:scale-105 h-full">
                    {post.featured_image && (
                      <div className="w-full h-48 mb-4 rounded-xl overflow-hidden">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-gray-500 dark:text-white/60 text-sm mb-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.reading_time} min read</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-700 dark:text-white/80 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium">
                      Read more →
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg transition-colors backdrop-blur-sm border border-gray-200 dark:border-white/20"
              >
                View All Posts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}