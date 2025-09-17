// src/components/sections/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import { TypewriterEffect } from '@/components/ui/TypewriterEffect';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { ArrowDown, Download, Calendar } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const roles = [
    "Applied AI Engineer",
    "LLM Systems Developer", 
    "Cloud Architecture Expert",
    "Full-Stack AI Builder"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-medium"
          >
            👋 Hello, I&apos;m
          </motion.p>

          {/* Name */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white">
            Nikhil Dodda
          </h1>

          {/* Dynamic Role */}
          <div className="h-16 sm:h-20 flex items-center justify-center">
            <TypewriterEffect
              words={roles}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-700 dark:text-gray-300"
              typeSpeed={100}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </div>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed px-4">
            I build <span className="text-blue-600 dark:text-blue-400 font-semibold">production AI systems</span> that 
            scale to millions of users. From RAG pipelines to cloud infrastructure, 
            I turn complex AI concepts into real business value.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8"
          >
            <Link
              href="/projects"
              className="w-full sm:w-auto btn-primary group flex items-center justify-center space-x-2"
            >
              <span>View My Work</span>
              <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
            </Link>
            
            <a
              href="/resume.pdf"
              download
              className="w-full sm:w-auto btn-secondary group flex items-center justify-center space-x-2"
            >
              <Download size={20} className="group-hover:scale-110 transition-transform" />
              <span>Download Resume</span>
            </a>
            
            <Link
              href="/connect"
              className="w-full sm:w-auto btn-secondary group flex items-center justify-center space-x-2"
            >
              <Calendar size={20} className="group-hover:scale-110 transition-transform" />
              <span>Schedule Call</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 pt-12 sm:pt-16 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">15+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">99.9%</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">40%</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Faster</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}