'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, ExternalLink, Search, Filter, Calendar } from 'lucide-react';
import { getProjects, getTechStack, handleAPIError, type Project, type TechCategory } from '@/lib/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [techStack, setTechStack] = useState<TechCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTech, setSelectedTech] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, techData] = await Promise.all([
          getProjects(),
          getTechStack(),
        ]);

        setProjects(projectsData);
        setTechStack(techData);
      } catch (err) {
        console.error('Projects page error:', err);
        setError(handleAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           project.technologies.some(tech => tech.category === selectedCategory);
    
    const matchesTech = !selectedTech || 
                       project.technologies.some(tech => tech.name === selectedTech);

    return matchesSearch && matchesCategory && matchesTech;
  });

  const allTechnologies = techStack.flatMap(category => 
    category.technologies.map(tech => ({ ...tech, category: category.category }))
  );

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
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">My Projects</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            A showcase of my work in AI, machine learning, and software engineering
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12 border border-white/20">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 appearance-none"
              >
                <option value="" className="bg-slate-800">All Categories</option>
                {techStack.map((category) => (
                  <option key={category.category} value={category.category} className="bg-slate-800">
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Technology Filter */}
            <div className="relative">
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 appearance-none"
              >
                <option value="" className="bg-slate-800">All Technologies</option>
                {allTechnologies.map((tech) => (
                  <option key={tech.name} value={tech.name} className="bg-slate-800">
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory || selectedTech) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  Search: {searchTerm}
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-2 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                  Category: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTech && (
                <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                  Tech: {selectedTech}
                  <button 
                    onClick={() => setSelectedTech('')}
                    className="ml-2 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-white/70">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.slug} className="group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105 hover:shadow-2xl">
                  {/* Featured Badge */}
                  {project.is_featured && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}

                  {/* Project Image */}
                  {project.thumbnail && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Project Title & Date */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center text-xs text-white/50">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(project.created_at).getFullYear()}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 mb-4 line-clamp-3">{project.tagline}</p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.slice(0, 4).map((tech) => (
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
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 text-xs text-white/50 border border-white/20 rounded-md">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex-1 text-center py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium"
                      >
                        View Details
                      </Link>

                      <div className="flex gap-2">
                        {project.github_url && (
                          <Link
                            href={project.github_url}
                            target="_blank"
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors group"
                            title="View Code"
                          >
                            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </Link>
                        )}

                        {project.live_demo_url && (
                          <Link
                            href={project.live_demo_url}
                            target="_blank"
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors group"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="text-center mt-12">
          <p className="text-white/60">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>
      </div>
    </div>
  );
}