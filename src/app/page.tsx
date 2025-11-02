'use client';

import { motion } from 'framer-motion';
import { LogIn, TrendingUp, Users, Wifi } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Add and manage members easily',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Track expenses and trends',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Wifi,
      title: 'Offline Support',
      description: 'Works without internet',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl"
      >
        <div className="mb-8 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="glass-card bg-gradient-to-br from-purple-500/40 to-blue-500/40 p-6"
          >
            <LogIn className="w-12 h-12 text-purple-600 dark:text-purple-300" />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-300 dark:via-blue-300 dark:to-pink-300 bg-clip-text text-transparent">
          bachOS
        </h1>

        <p className="text-lg md:text-xl text-foreground/80 mb-12 leading-relaxed">
          Manage your bachelor meal expenses, track members, and analyze spending with ease. Works
          offline with PWA support.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -8, rotateZ: 2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 flex items-center gap-2 justify-center w-full sm:w-auto"
            >
              <LogIn className="w-5 h-5" />
              Log In
            </motion.button>
          </Link>

          <Link href="/auth/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-light px-6 py-2 rounded-xl font-medium border-2 border-purple-500 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 transition-all w-full sm:w-auto"
            >
              Sign Up
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
