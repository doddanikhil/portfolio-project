import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Calendar, Download, ExternalLink, Github, Linkedin } from 'lucide-react';
import { getTechStack, getCareerHighlights, getSiteMetadata, handleAPIError, type TechCategory, type CareerHighlight, type SiteMetadata } from '@/lib/api';

export default function AboutPage() {
  const [techStack, setTechStack] = useState<TechCategory[]>([]);
  const [highlights, setHighlights] = useState<CareerHighlight[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techData, highlightsData, configData] = await Promise.all([
          getTechStack(),
          getCareerHighlights(),
          getSiteMetadata(),
        ]);

        setTechStack(techData);
        setHighlights(highlightsData);
        setSiteConfig(configData);
      } catch (err) {
        console.error('About page error:', err);
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
          <p className="text-white/80">Loading about page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Unable to Load About Page</h1>
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {siteConfig?.bio || "Passionate about building AI systems that make a real impact."}
          </p>
        </div>

        {/* Profile Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
              >
                View My Work
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              {siteConfig?.calendar_url && (
                <Link
                  href={siteConfig.calendar_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20"
                >
                  <Calendar className="w-5 h-5" />
                  Let's Connect
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
              <p className="text-xl text-white/80">Showcasing innovation in AI and software engineering</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <div key={project.slug} className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105 h-full">
                    {project.thumbnail && (
                      <div className="w-full h-48 mb-4 rounded-xl overflow-hidden">
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-white/80 mb-4 line-clamp-2">{project.tagline}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
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
                    
                    <div className="flex gap-3 mt-auto">
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
      )}

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Latest Insights</h2>
              <p className="text-xl text-white/80">Thoughts on AI, technology, and software engineering</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105 h-full">
                    {post.featured_image && (
                      <div className="w-full h-48 mb-4 rounded-xl overflow-hidden">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-white/60 text-sm mb-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.reading_time} min read</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-white/80 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-4 text-blue-400 text-sm font-medium">
                      Read more →
                    </div>
                  </article>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/20"
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