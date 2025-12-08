'use client';

import { motion } from 'framer-motion';
import { Brain, Calendar, BarChart3, Zap } from 'lucide-react';

const advancedFeatures = [
  {
    icon: Brain,
    title: 'AI Meal Planning',
    description: 'Get intelligent meal suggestions and planning assistance powered by advanced AI algorithms.',
    color: 'from-purple-400 to-pink-400',
  },
  {
    icon: Calendar,
    title: 'Market Schedule',
    description: 'Plan your grocery shopping with smart market scheduling and inventory management.',
    color: 'from-green-400 to-teal-400',
  },
  {
    icon: BarChart3,
    title: 'Detailed Reports',
    description: 'Generate comprehensive reports and analytics for better financial insights.',
    color: 'from-orange-400 to-red-400',
  },
  {
    icon: Zap,
    title: 'Smart Automation',
    description: 'Automate routine tasks and get intelligent notifications for better efficiency.',
    color: 'from-yellow-400 to-orange-400',
  },
];

export default function AdvancedFeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
            Advanced Features
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Cutting-edge tools and intelligent features to supercharge your meal management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {advancedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, rotateZ: 0.5 }}
                className="glass-card group p-4 sm:p-6 lg:p-8"
              >
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} p-2.5 sm:p-3 lg:p-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 lg:mb-4">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}