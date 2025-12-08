'use client';

import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20 lg:py-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-6xl mx-auto"
      >
        <div className="mb-6 sm:mb-8 lg:mb-10 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="glass-card bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-4 sm:p-6 lg:p-8"
          >
            <LogIn className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-purple-600 dark:text-purple-300" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-300 dark:via-blue-300 dark:to-pink-300 bg-clip-text text-transparent leading-tight"
        >
          bachOS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 mb-6 sm:mb-8 lg:mb-12 leading-relaxed px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        >
          Revolutionize your bachelor meal management with intelligent expense tracking,
          AI-powered meal planning, and comprehensive analytics. Works offline with PWA support.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center w-full max-w-md sm:max-w-none mx-auto"
        >
          <Link href="/auth/login" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 flex items-center gap-2 sm:gap-3 justify-center w-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              Get Started
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-light px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold border-2 border-purple-500 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 transition-all w-full sm:w-auto text-base sm:text-lg"
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}