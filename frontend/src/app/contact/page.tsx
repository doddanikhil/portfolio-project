'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Github, ExternalLink, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { api, ContactForm, SiteConfig } from '@/lib/api';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function ContactPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await api.getSiteConfig();
        setConfig(data);
      } catch (error) {
        console.error('Failed to load site config:', error);
      }
    };

    fetchConfig();
  }, []);

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await api.submitContact(data);
      setIsSubmitted(true);
      reset();
    } catch {
      setError('Failed to send message. Please try again or contact me directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center glass-card p-8 rounded-2xl"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Message Sent!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for reaching out. I&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="glass-button px-6 py-3 rounded-lg font-medium"
          >
            Send Another Message
          </button>
        </motion.div>
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
              Let&apos;s Connect
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              I&apos;m always excited to discuss AI projects, collaboration opportunities, 
              or just chat about the latest in machine learning and software engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send a Message</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    className="w-full px-4 py-2 glass-card rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email *
                  </label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="w-full px-4 py-2 glass-card rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Company (Optional)
                  </label>
                  <input
                    {...register('company')}
                    type="text"
                    className="w-full px-4 py-2 glass-card rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Subject *
                  </label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    type="text"
                    className="w-full px-4 py-2 glass-card rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    className="w-full px-4 py-2 glass-card rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    placeholder="Tell me about your project, idea, or just say hello!"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full glass-button px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Other Ways to Connect</h2>
                
                <div className="space-y-6">
                  {config?.email && (
                    <ContactMethod
                      icon={Mail}
                      title="Email Me"
                      description="Get in touch directly"
                      action="Send Email"
                      href={`mailto:${config.email}`}
                    />
                  )}
                  
                  {config?.cal_com_username && (
                    <ContactMethod
                      icon={Calendar}
                      title="Schedule a Call"
                      description="Book a 30-minute conversation"
                      action="Schedule Now"
                      href={`https://cal.com/${config.cal_com_username}`}
                    />
                  )}
                  
                  {config?.github_url && (
                    <ContactMethod
                      icon={Github}
                      title="GitHub"
                      description="Check out my code and projects"
                      action="View Profile"
                      href={config.github_url}
                    />
                  )}
                  
                  {config?.bluesky_handle && (
                    <ContactMethod
                      icon={ExternalLink}
                      title="Bluesky"
                      description="Follow me for AI and tech updates"
                      action="Follow Me"
                      href={`https://bsky.app/profile/${config.bluesky_handle.replace('@', '')}`}
                    />
                  )}
                </div>
              </div>

              {/* Response Time */}
              <div className="glass-card p-6 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Response Time</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  I typically respond to messages within 24 hours. For urgent matters, 
                  feel free to reach out via email directly.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Contact Method Component
function ContactMethod({
  icon: Icon,
  title,
  description,
  action,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <div className="flex items-start gap-4 glass-card p-4 rounded-lg hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{description}</p>
        
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm transition-colors"
        >
          {action} →
        </a>
      </div>
    </div>
  );
}
