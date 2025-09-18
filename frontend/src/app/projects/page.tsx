'use client';

import { useState, useEffect } from 'react';
import { api, Project } from '@/lib/api';
import Link from 'next/link';
import { ExternalLink, Github, Calendar, Filter, Search } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search and category
  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((tech) =>
          tech.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((project) =>
        project.technologies.some((tech) => tech.category === selectedCategory)
      );
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory]);

  // Get unique categories from all projects
  const categories = ['all', ...new Set(
    projects.flatMap(project => 
      project.technologies.map(tech => tech.category)
    )
  )];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Unable to Load Projects</h1>
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Projects</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            A collection of applications, systems, and experiments showcasing applied AI and full-stack development
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-blue-400 backdrop-blur-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 backdrop-blur-sm appearance-none min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-slate-800">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-white/70 text-center">
            Showing {filteredProjects.length} of {projects.length} projects
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.slug} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105 h-full flex flex-col">
                  {/* Featured Badge */}
                  {project.is_featured && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Thumbnail */}
                  {project.thumbnail && (
                    <div className="w-full h-48 mb-4 rounded-xl overflow-hidden">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-white/90 mb-4 flex-1">{project.tagline}</p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span 
                          key={tech.name}
                          className="px-2 py-1 text-xs rounded-full border"
                          style={{ 
                            color: tech.color || '#3B82F6',
                            borderColor: tech.color || '#3B82F6'
                          }}
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 text-xs rounded-full border border-white/30 text-white/70">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    {/* Date */}
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Actions - Only GitHub and Live Demo */}
                    <div className="flex gap-3">
                      {project.github_url && (
                        <Link
                          href={project.github_url}
                          target="_blank"
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                          title="View Source Code"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </Link>
                      )}
                      
                      {project.live_demo_url && (
                        <Link
                          href={project.live_demo_url}
                          target="_blank"
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </Link>
                      )}
                      
                      {!project.github_url && !project.live_demo_url && (
                        <div className="flex-1 text-center py-2 px-4 bg-white/5 text-white/50 rounded-lg cursor-not-allowed">
                          Coming Soon
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-white/70 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}