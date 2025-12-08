'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LandingHeader from '@/components/landing-header';
import LandingFooter from '@/components/landing-footer';
import { motion } from 'framer-motion';
import { Code, Heart, Users, Zap, Target, Award } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Show loading state while determining authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading bachOS...</p>
        </div>
      </div>
    );
  }

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To simplify bachelor life through intelligent meal management and expense tracking solutions.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Built for the bachelor community, understanding the unique challenges of independent living.',
    },
    {
      icon: Code,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology like AI and PWA to deliver modern solutions.',
    },
  ];

  const achievements = [
    {
      icon: Zap,
      title: 'Offline First',
      description: 'Works seamlessly without internet connection',
    },
    {
      icon: Award,
      title: 'Modern Tech',
      description: 'Built with React, Next.js, and advanced web technologies',
    },
    {
      icon: Heart,
      title: 'User-Centric',
      description: 'Designed with the user experience as the top priority',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                About bachOS
              </h1>
              <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
                A passion project born from the need to simplify bachelor life through technology.
                Created by Md. Shamsad Alam Meraj to help fellow bachelors manage their meals and expenses efficiently.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-transparent to-background/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                The Story Behind bachOS
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-6 sm:p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">From Personal Need to Solution</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    As a bachelor myself, I struggled with managing meal expenses and planning meals effectively.
                    The traditional methods of tracking expenses on paper or basic spreadsheets were inefficient and time-consuming.
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    This personal challenge inspired me to create bachOS - a comprehensive solution that combines
                    intelligent meal planning, expense tracking, and modern web technologies to make bachelor life easier.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-6 sm:p-8">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Built with Modern Technology</h3>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    bachOS leverages cutting-edge web technologies including React, Next.js, and TypeScript for a robust,
                    scalable application. The Progressive Web App (PWA) capabilities ensure it works seamlessly across all devices.
                  </p>
                  <p className="text-foreground/70 leading-relaxed">
                    With offline-first architecture and AI-powered features, bachOS represents the future of personal finance management.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-300 dark:to-blue-300 bg-clip-text text-transparent">
                Our Values
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    className="glass-card p-6 sm:p-8 text-center"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-blue-400 p-3 sm:p-4 rounded-xl mx-auto mb-4 sm:mb-6">
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="font-bold text-xl sm:text-2xl mb-3 sm:mb-4">{value.title}</h3>
                    <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background/50 to-transparent">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
                Key Achievements
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    className="glass-card p-6 sm:p-8"
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-400 to-orange-400 p-2.5 sm:p-3 rounded-xl flex-shrink-0">
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3">{achievement.title}</h3>
                        <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card p-8 sm:p-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Get in Touch</h2>
              <p className="text-foreground/70 mb-6 sm:mb-8 leading-relaxed">
                Have questions, suggestions, or feedback? I'd love to hear from you.
              </p>
              <a
                href="mailto:shamsad.alam.meraj@gmail.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
                Contact Me
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}