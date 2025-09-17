'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin, Calendar, Award } from 'lucide-react';
import { api, SiteConfig, CareerHighlight } from '@/lib/api';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function AboutPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [highlights, setHighlights] = useState<CareerHighlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [configData, highlightsData] = await Promise.all([
          api.getSiteConfig(),
          api.getCareerHighlights(),
        ]);
        setConfig(configData);
        setHighlights(highlightsData);
      } catch (error) {
        console.error('Failed to load about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <AnimatedBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-6 animate-pulse" />
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded mb-8 animate-pulse" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              About Me
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              My journey in AI engineering, from academic research to production systems.
            </p>
          </div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8 rounded-2xl mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Image */}
              <div className="lg:col-span-1">
                {config?.profile_image ? (
                  <img
                    src={config.profile_image}
                    alt={config.site_name}
                    className="w-full max-w-sm mx-auto rounded-2xl"
                  />
                ) : (
                  <div className="w-full max-w-sm mx-auto aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
                    {config?.site_name?.split(' ').map(n => n[0]).join('') || 'ND'}
                  </div>
                )}
                
                {config?.show_resume_download && config?.resume_file && (
                  <div className="mt-6 text-center">
                    <a
                      href={config.resume_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 glass-button px-6 py-3 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Bio Text */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {config?.tagline || 'Applied AI Engineer'}
                </h2>
                <div className="prose prose-lg dark:prose-invert">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {config?.bio || 'Applied AI Engineer with a passion for building intelligent systems that solve real-world problems.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Career Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
              Career Highlights
            </h2>
            
            <div className="space-y-6">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass-card p-6 rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {highlight.is_current ? <Award className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {highlight.title}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {highlight.date_range}
                        </span>
                      </div>
                      
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                        {highlight.organization}
                      </p>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {highlight.description}
                      </p>
                      
                      {highlight.metrics && highlight.metrics.length > 0 && (
                        <ul className="space-y-1">
                          {highlight.metrics.map((metric, i) => (
                            <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                              {metric}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}