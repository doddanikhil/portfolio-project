'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, Clock, ArrowRight } from 'lucide-react';
import { getBlogPosts, getBlogCategories, type BlogPost, type BlogCategory } from '@/lib/api';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getBlogPosts(),
          getBlogCategories(),
        ]);

        setPosts(postsData);
        setFilteredPosts(postsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Unable to Load Blog</h1>
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Insights on AI, software engineering, and technology trends from the frontlines of applied machine learning
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
                placeholder="Search articles..."
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
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 backdrop-blur-sm appearance-none min-w-[180px]"
              >
                <option value="" className="bg-slate-800">All Categories</option>
                {categories.map((category) => (
                  <option key={category.key} value={category.key} className="bg-slate-800">
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-white/70 text-center">
            Showing {filteredPosts.length} of {posts.length} articles
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && filteredPosts[0].is_featured && (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full border border-yellow-500/30">
                  Featured
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                  {filteredPosts[0].category}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {filteredPosts[0].title}
              </h2>
              
              <p className="text-white/80 text-lg mb-6 line-clamp-2">
                {filteredPosts[0].excerpt}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4 text-white/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(filteredPosts[0].published_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{filteredPosts[0].reading_time} min read</span>
                  </div>
                </div>
                
                <Link
                  href={`/blog/${filteredPosts[0].slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts
              .filter((_, index) => !(index === 0 && filteredPosts[0].is_featured))
              .map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105 h-full flex flex-col">
                    {/* Featured Image */}
                    {post.featured_image && (
                      <div className="w-full h-48 mb-4 rounded-xl overflow-hidden">
                        <img 
                          src={post.featured_image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-white/60 text-sm mb-3">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.reading_time} min read</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-white/80 mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      {/* Date and Views */}
                      <div className="flex items-center justify-between text-white/60 text-sm pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.published_date).toLocaleDateString()}</span>
                        </div>
                        {post.views > 0 && (
                          <span>{post.views} views</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-blue-400 text-sm font-medium">
                      Read more →
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Articles Found</h3>
            <p className="text-white/70 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
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