'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Calendar, Send, CheckCircle, AlertCircle, Github, Linkedin, FileText } from 'lucide-react';
import { submitContact, getSiteMetadata, handleAPIError, type ContactFormData, type SiteMetadata } from '@/lib/api';

export default function ConnectPage() {
  const [siteConfig, setSiteConfig] = useState<SiteMetadata | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const configData = await getSiteMetadata();
        setSiteConfig(configData);
      } catch (err) {
        console.error('Config fetch error:', err);
        setError(handleAPIError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await submitContact(formData);
      
      if (response.success) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError(handleAPIError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80">Loading contact info...</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Message Sent!</h1>
              <p className="text-white/70 mb-6">
                Thank you for reaching out. I'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Let's Connect</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                {siteConfig?.email && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Email</h3>
                      <Link 
                        href={`mailto:${siteConfig.email}`}
                        className="text-white/70 hover:text-blue-400 transition-colors"
                      >
                        {siteConfig.email}
                      </Link>
                    </div>
                  </div>
                )}

                {siteConfig?.location && (
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-white font-semibold">Location</h3>
                      <p className="text-white/70">{siteConfig.location}</p>
                    </div>
                  </div>
                )}

                {siteConfig?.calendar_url && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Schedule a Meeting</h3>
                      <Link 
                        href={siteConfig.calendar_url}
                        target="_blank"
                        className="text-white/70 hover:text-green-400 transition-colors"
                      >
                        Book a time slot
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Connect on Social</h3>
              <div className="flex gap-4">
                {siteConfig?.github_url && (
                  <Link
                    href={siteConfig.github_url}
                    target="_blank"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors group"
                  >
                    <Github className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </Link>
                )}

                {siteConfig?.linkedin_url && (
                  <Link
                    href={siteConfig.linkedin_url}
                    target="_blank"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors group"
                  >
                    <Linkedin className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </Link>
                )}

                {siteConfig?.resume_url && (
                  <Link
                    href={siteConfig.resume_url}
                    target="_blank"
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors group"
                  >
                    <FileText className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Meeting */}
            {siteConfig?.calendar_url && (
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Quick Meeting?</h3>
                <p className="text-white/70 mb-6">
                  Prefer to talk directly? Schedule a 30-minute call to discuss your project or opportunities.
                </p>
                <Link
                  href={siteConfig.calendar_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Meeting
                </Link>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-white font-medium mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder="Tell me about your project, idea, or how I can help..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            <p className="text-white/50 text-sm mt-4 text-center">
              I typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}