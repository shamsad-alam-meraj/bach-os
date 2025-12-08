'use client';

import { motion } from 'framer-motion';
import { Github, Heart, Mail, ExternalLink } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-gradient-to-t from-background/80 to-background/40 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8 lg:mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="sm:col-span-2 lg:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">B</span>
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
                bachOS
              </span>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed max-w-md">
              Revolutionizing bachelor meal management with intelligent expense tracking,
              AI-powered meal planning, and comprehensive analytics. Built for modern living.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/auth/login" className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors block">
                  Login
                </a>
              </li>
              <li>
                <a href="/auth/signup" className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors block">
                  Sign Up
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors block">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors block">
                  About
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">Contact</h3>
            <div className="space-y-2 sm:space-y-3">
              <a
                href="mailto:contact@bachos.com"
                className="flex items-center gap-2 text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">contact@bachos.com</span>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm sm:text-base text-foreground/70 hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4 flex-shrink-0" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-border/50 pt-6 sm:pt-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6">
            <p className="text-xs sm:text-sm text-foreground/60 text-center lg:text-left order-2 lg:order-1">
              © 2024 bachOS. Built with <Heart className="w-4 h-4 inline text-red-500" /> by Md. Shamsad Alam Meraj.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 order-1 lg:order-2">
              <a href="/privacy" className="text-xs sm:text-sm text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap">
                Privacy
              </a>
              <a href="/terms" className="text-xs sm:text-sm text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap">
                Terms
              </a>
              <span className="text-xs sm:text-sm text-foreground/60 whitespace-nowrap">v1.0.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}