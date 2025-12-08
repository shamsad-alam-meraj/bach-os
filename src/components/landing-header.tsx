'use client';

import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Link from 'next/link';

export default function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
              bachOS
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 flex items-center gap-2 px-4 py-2 text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}