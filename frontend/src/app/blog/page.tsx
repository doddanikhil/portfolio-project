'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, Clock, Eye, Tag } from 'lucide-react';
import { getBlogPosts, getBlogCategories, handleAPIError, type BlogPost, type BlogCategory } from '@/lib/api';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData] = await Promise.all([
          getBlogPosts({ search: searchTerm, category: selectedCategory }),
          getBlogCategories(),
        ]);

        setPosts(postsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Blog page error:', err);
        setError(handleAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Latest Insights</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Thoughts on AI, technology, and software engineering
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12 border border-white/20">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-400 appearance-none"
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

          {/* Active Filters */}
          {(searchTerm || selectedCategory) && (
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
                  Category: {categories.find(c => c.key === selectedCategory)?.name}
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Blog Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Posts Found</h3>
            <p className="text-white/70">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search criteria' 
                : 'Blog posts coming soon! Check back later.'
              }
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105 hover:shadow-2xl">
                  {/* Featured Badge */}
                  {post.is_featured && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full">
                      Featured
                    </div>
                  )}

                  {/* Featured Image */}
                  {post.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category */}
                    <div className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full mb-3">
                      {categories.find(c => c.key === post.category)?.name || post.category}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-white/70 mb-4 line-clamp-3">{post.excerpt}</p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-white/50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.reading_time} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views} views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.published_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="text-center mt-12">
          <p className="text-white/60">
            Showing {posts.length} article{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}