'use client';

import { useState, useEffect } from 'react';
import { api, TechCategory } from '@/lib/api';

export default function AboutPage() {
  const [technologies, setTechnologies] = useState<TechCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const data = await api.getTechnologies();
        setTechnologies(data);
      } catch (err) {
        console.error('Failed to load technologies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            About Me
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Applied AI Engineer
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
              I specialize in building production AI systems that solve real business problems. 
              With expertise in LLMs, RAG systems, and cloud infrastructure, I turn complex AI concepts 
              into scalable applications that serve millions of users.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              My experience spans from developing hybrid retrieval systems that improve performance by 40% 
              to maintaining 99.9% uptime for critical AI services. I believe in shipping working solutions 
              that create genuine business value.
            </p>
          </div>

          {!loading && technologies.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Technical Skills
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                {technologies.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.technologies.map((tech) => (
                        <div key={`${category.category}-${tech.name}`} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">{tech.name}</span>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div
                                key={`${category.category}-${tech.name}-${level}`}
                                className={`w-3 h-3 rounded-full ${
                                  level <= (tech.proficiency || 0)
                                    ? 'bg-blue-500'
                                    : 'bg-gray-200 dark:bg-gray-600'
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
        </div>
      </div>
    </main>
  );
}