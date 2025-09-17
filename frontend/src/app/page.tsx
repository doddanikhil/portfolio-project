'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api, Project } from '@/lib/api';
import { ArrowRight, Github, ExternalLink, Calendar, Users } from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const projects = await api.getProjects();
        setFeaturedProjects(projects.filter(p => p.is_featured).slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <main className="min-h-screen">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card rounded-3xl p-8 md:p-12 animate-float">
              <p className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-medium mb-4">
                👋 Hello, I'm
              </p>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                Nikhil Dodda
              </h1>

              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-semibold mb-8">
                Applied AI Engineer
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto">
                I build <span className="text-blue-600 dark:text-blue-400 font-semibold">production AI systems</span> that 
                scale to millions of users. From RAG pipelines to cloud infrastructure, 
                I turn complex AI concepts into real business value.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/projects"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>View My Work</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/contact"
                  className="glass-button px-8 py-4 text-gray-700 dark:text-gray-300 font-medium rounded-xl shadow-lg hover:scale-105"
                >
                  Get In Touch
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">15+</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">99.9%</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">40%</div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Faster</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              AI systems and applications that solve real-world problems
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="glass-card rounded-2xl p-8 max-w-sm mx-auto">
                <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading projects...</div>
              </div>
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {featuredProjects.map((project, index) => (
                <div
                  key={project.slug}
                  className="glass-card-hover rounded-2xl p-6"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Project image placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-4xl">🚀</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.tagline}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech.name}
                        className="px-2 py-1 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-md text-xs"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Project meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>Solo Project</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 glass-button rounded-lg text-sm hover:scale-105 transition-transform"
                      >
                        <Github size={16} />
                        <span>Code</span>
                      </a>
                    )}
                    
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                      >
                        <ExternalLink size={16} />
                        <span>Demo</span>
                      </a>
                    )}
                    
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm ml-auto"
                    >
                      <span>Details</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="glass-card rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-gray-600 dark:text-gray-400 mb-4">No featured projects yet.</p>
                <Link 
                  href="http://127.0.0.1:8000/admin" 
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Add featured projects in Django Admin
                </Link>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 glass-button rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span>View All Projects</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
