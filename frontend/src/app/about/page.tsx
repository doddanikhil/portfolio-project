'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Calendar, Download, Github, Linkedin } from 'lucide-react';
import { getTechStack, getSiteMetadata, handleAPIError, type TechCategory, type SiteMetadata } from '@/lib/api';

export default function AboutPage() {
  const [techStack, setTechStack] = useState<TechCategory[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techData, configData] = await Promise.all([
          getTechStack(),
          getSiteMetadata(),
        ]);

        setTechStack(techData);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading about page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {siteConfig?.bio || "Passionate about building AI systems that make a real impact."}
          </p>
        </div>

        {/* Profile Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {siteConfig?.profile_image && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 flex-shrink-0">
                  <img
                    src={siteConfig.profile_image}
                    alt={siteConfig.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {siteConfig?.name || "Nikhil Dodda"}
                </h2>
                <p className="text-blue-400 mb-4 text-lg">
                  {siteConfig?.tagline || "Applied AI Engineer"}
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                  {siteConfig?.location && (
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span>{siteConfig.location}</span>
                    </div>
                  )}
                  {siteConfig?.email && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Mail className="w-4 h-4" />
                      <span>{siteConfig.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {siteConfig?.resume_url && (
                    <Link
                      href={siteConfig.resume_url}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </Link>
                  )}
                  {siteConfig?.calendar_url && (
                    <Link
                      href={siteConfig.calendar_url}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Meeting
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Story Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white text-center mb-8">My Story</h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                I'm passionate about building AI systems that solve real-world problems. My journey in technology 
                started with a fascination for how machines can learn and adapt, which led me to specialize in 
                applied artificial intelligence and machine learning.
              </p>
              <p className="text-white/90 text-lg leading-relaxed mb-6">
                Today, I focus on developing production-ready LLM systems, RAG applications, and scalable AI 
                infrastructure. I believe in the power of technology to transform industries and improve lives, 
                and I'm committed to building solutions that are both innovative and practical.
              </p>
              <p className="text-white/90 text-lg leading-relaxed">
                When I'm not coding or designing AI systems, you'll find me exploring the latest research papers, 
                contributing to open-source projects, or sharing knowledge through writing and speaking engagements.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        {techStack.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Technical Expertise</h2>
            <div className="grid gap-8">
              {techStack.map((category) => (
                <div key={category.category} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {category.technologies.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {tech.icon_url && (
                          <img
                            src={tech.icon_url}
                            alt={tech.name}
                            className="w-8 h-8 mb-2"
                          />
                        )}
                        <span className="text-white text-sm font-medium text-center">
                          {tech.name}
                        </span>
                        {tech.proficiency && (
                          <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                            <div
                              className="bg-blue-400 h-1 rounded-full"
                              style={{ width: `${(tech.proficiency / 5) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Connect Section */}
        <section className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Interested in collaborating on AI projects or discussing technology? 
              I'd love to hear from you.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {siteConfig?.email && (
                <Link
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Send Email
                </Link>
              )}
              
              {siteConfig?.github_url && (
                <Link
                  href={siteConfig.github_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </Link>
              )}
              
              {siteConfig?.linkedin_url && (
                <Link
                  href={siteConfig.linkedin_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}