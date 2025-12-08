'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Wifi } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Member Management',
    description: 'Add and manage members easily with detailed profiles and preferences.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Smart Analytics',
    description: 'Track expenses and trends with powerful analytics and insights.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Wifi,
    title: 'Offline Support',
    description: 'Works seamlessly without internet connection. Your data is always accessible.',
    color: 'from-pink-400 to-pink-600',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-300 dark:to-blue-300 bg-clip-text text-transparent">
            Core Features
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            Everything you need to manage your bachelor meals efficiently and effectively.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
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
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} p-2 sm:p-2.5 lg:p-3 mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-105 transition-transform duration-300`}
                >
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 lg:mb-4 text-center">{feature.title}</h3>
                <p className="text-sm sm:text-base text-foreground/70 leading-relaxed text-center">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
