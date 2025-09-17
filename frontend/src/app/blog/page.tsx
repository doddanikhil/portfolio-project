'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { blogApi, apiCall } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/lib/types';

const CATEGORIES = [
  { value: 'all', label: 'All Posts' },
  { value: 'ai-trends', label: 'AI Trends' },
  { value: 'technical', label: 'Technical' },
  { value: 'industry', label: 'Industry' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'opinion', label: 'Opinion' },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiCall(() => blogApi.getAll());
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error('Failed to load blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-8 bg-muted rounded mb-4" />
              <div className="h-16 bg-muted rounded mb-4" />
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container section-padding">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Blog & Insights
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Thoughts on AI engineering, production systems, and the future of intelligent applications.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
          >
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-lg text-muted-foreground mb-4">
            {posts.length === 0 
              ? "No blog posts yet. Coming soon!" 
              : "No posts found matching your criteria."
            }
          </p>
          {posts.length === 0 && (
            <Link
              href="/connect"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Get in touch to suggest topics →
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Blog Card Component
function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-card rounded-lg border border-border overflow-hidden card-hover"
    >
      {/* Featured Image */}
      {post.featured_image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3 capitalize">
          {post.category.replace('-', ' ')}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.reading_time} min read
            </div>
          </div>
          
          <div className="text-xs">
            {post.views} views
          </div>
        </div>
      </div>
    </motion.article>
  );
}