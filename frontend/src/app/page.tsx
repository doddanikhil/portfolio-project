'use client'

// frontend/src/app/page.tsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Github, ExternalLink, Download, Calendar, Mail } from 'lucide-react'
import { api, Project, BlogPost, PortfolioStats, SiteMetadata } from '@/lib/api'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [metadata, setMetadata] = useState<SiteMetadata | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, postsData, statsData, metaData] = await Promise.all([
          api.getFeaturedProjects(),
          api.getRecentBlogPosts(),
          api.getStats(),
          api.getMetadata()
        ])
        
        setFeaturedProjects(projectsData)
        setRecentPosts(postsData)
        setStats(statsData)
        setMetadata(metaData)
      } catch (error) {
        console.error('Failed to load homepage data:', error)
        // Set fallback data
        setMetadata({
          name: 'Nikhil Dodda',
          tagline: 'Applied AI Engineer',
          bio: 'Building intelligent applications that solve real business problems.',
          location: 'Ashburn, Virginia',
          email: 'hello@nikhildodda.dev',
          phone: '',
          github_url: 'https://github.com/nikhildodda',
          linkedin_url: 'https://linkedin.com/in/nikhildodda',
          twitter_url: '',
          calendar_url: 'https://cal.com/nikhildodda',
          resume_url: '/resume.pdf',
          meta_description: '',
          meta_keywords: '',
          years_experience: 2,
          projects_completed: 5,
          technologies_mastered: 20,
          coffee_consumed: 1000
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {metadata?.name || 'Nikhil Dodda'}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {metadata?.tagline || 'Applied AI Engineer'}
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
              {metadata?.bio || 'Building intelligent applications that solve real business problems.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button asChild size="lg">
              <Link href="/projects">
                View Projects
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link href={metadata?.resume_url || '/resume.pdf'}>
                <Download className="mr-2 h-4 w-4" />
                Resume
              </Link>
            </Button>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-x-4"
          >
            <Button variant="ghost" size="sm" asChild>
              <Link href={`mailto:${metadata?.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href={metadata?.calendar_url || '#'}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href={metadata?.github_url || '#'}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 gap-8 md:grid-cols-4"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.total_projects}</div>
                <div className="text-sm text-gray-400 mt-1">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.years_experience}+</div>
                <div className="text-sm text-gray-400 mt-1">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.uptime_percentage}%</div>
                <div className="text-sm text-gray-400 mt-1">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.performance_improvement}%</div>
                <div className="text-sm text-gray-400 mt-1">Faster</div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Featured Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                    {project.thumbnail && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={project.thumbnail}
                          alt={project.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-white">{project.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {project.tagline}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech.id} variant="secondary">
                            {tech.name}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        {project.github_url && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={project.github_url}>
                              <Github className="mr-2 h-4 w-4" />
                              Code
                            </Link>
                          </Button>
                        )}
                        
                        {project.live_demo_url && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={project.live_demo_url}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Demo
                            </Link>
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/projects/${project.slug}`}>
                            Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Recent Posts
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.slice(0, 3).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                      {post.featured_image && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-sm text-gray-400">
                            {post.reading_time} min read
                          </span>
                        </div>
                        <CardTitle className="text-white line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`}>
                            Read More
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button asChild variant="outline">
                  <Link href="/blog">View All Posts</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Ready to turn your AI ideas into production-ready applications?
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Get In Touch</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={metadata?.calendar_url || '#'}>Schedule a Call</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}