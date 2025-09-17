'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { blogApi, apiCall } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { BlogPost } from '@/lib/types';

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiCall(() => blogApi.getBySlug(slug));
        setPost(data);
      } catch (error) {
        console.error('Failed to load blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted rounded mb-4 animate-pulse" />
          <div className="h-12 bg-muted rounded mb-6 animate-pulse" />
          <div className="h-64 bg-muted rounded mb-8 animate-pulse" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container section-padding">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist.
          </p>
          <Link href="/blog" className="btn-primary">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="container section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          {/* Category */}
          <div className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4 capitalize">
            {post.category.replace('-', ' ')}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_date)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.reading_time} min read
            </div>
            <div className="text-sm">
              {post.views} views
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative h-64 sm:h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Share & Navigation */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-8 border-t border-border"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/blog" className="btn-secondary">
              ← More Posts
            </Link>
            
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.footer>
      </div>
    </article>
  );
}