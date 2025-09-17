'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Calendar, Download, ExternalLink } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">About Me</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Get to know the person behind the code
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Personal Info */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {siteConfig?.profile_image && (
                  <img 
                    src={siteConfig.profile_image} 
                    alt={siteConfig.name}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {siteConfig?.name || 'Nikhil Dodda'}
                  </h2>
                  <p className="text-xl text-blue-400 mb-4">
                    {siteConfig?.tagline || 'Applied AI Engineer'}
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    {siteConfig?.bio || 'Building intelligent applications that solve real business problems.'}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                {siteConfig?.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Email</p>
                      <Link 
                        href={`mailto:${siteConfig.email}`}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        {siteConfig.email}
                      </Link>
                    </div>
                  </div>
                )}

                {siteConfig?.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">Location</p>
                      <p className="text-white">{siteConfig.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              {siteConfig?.resume_url && (
                <Link
                  href={siteConfig.resume_url}
                  target="_blank"
                  className="w-full flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all group"
                >
                  <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Download Resume</span>
                </Link>
              )}

              {siteConfig?.calendar_url && (
                <Link
                  href={siteConfig.calendar_url}
                  target="_blank"
                  className="w-full flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all group border border-white/20"
                >
                  <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Schedule Meeting</span>
                </Link>
              )}

              <Link
                href="/connect"
                className="w-full flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all group border border-white/20"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>

          {/* Career Highlights */}
          {highlights.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Career Highlights</h3>
              <div className="space-y-6">
                {highlights.map((highlight, index) => (
                  <div key={index} className="border-l-4 border-blue-400 pl-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h4 className="text-xl font-semibold text-white">
                        {highlight.title}
                      </h4>
                      <span className="text-blue-400 text-sm">
                        {highlight.date_range}
                      </span>
                    </div>
                    <p className="text-purple-400 font-medium mb-2">
                      {highlight.organization}
                    </p>
                    <p className="text-white/70 mb-4">
                      {highlight.description}
                    </p>
                    
                    {/* Metrics */}
                    {highlight.metrics.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {highlight.metrics.map((metric, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full"
                          >
                            {metric.metric}: {metric.value}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Technologies */}
                    {highlight.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {highlight.technologies.map((tech) => (
                          <span 
                            key={tech.name}
                            className="px-2 py-1 text-xs rounded-md border"
                            style={{ 
                              color: tech.color || '#3B82F6',
                              borderColor: tech.color || '#3B82F6',
                              backgroundColor: `${tech.color || '#3B82F6'}10`
                            }}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Technology Stack</h3>
              <div className="space-y-8">
                {techStack.map((category) => (
                  <div key={category.category}>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      {category.category}
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.technologies.map((tech) => (
                        <div 
                          key={tech.name}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                        >
                          {tech.icon_url ? (
                            <img 
                              src={tech.icon_url} 
                              alt={tech.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: tech.color || '#3B82F6' }}
                            >
                              {tech.name[0]}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-white font-medium">{tech.name}</p>
                            {tech.description && (
                              <p className="text-white/50 text-sm">{tech.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < (tech.proficiency || 3)
                                    ? 'bg-blue-400'
                                    : 'bg-white/20'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Let's Work Together</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Interested in collaborating or have a project in mind? I&apos;m always open to discussing new opportunities and challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/connect"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
              >
                Get in Touch
              </Link>
              <Link
                href="/projects"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20"
              >
                View My Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}