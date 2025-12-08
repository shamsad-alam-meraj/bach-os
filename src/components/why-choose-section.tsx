'use client';

import { motion } from 'framer-motion';
import { Wifi, Smartphone, Shield, TrendingUp } from 'lucide-react';

const benefits = [
  {
    icon: Wifi,
    title: 'Offline First',
    description: 'Works seamlessly without internet connection. Your data is always accessible and secure.',
    color: 'from-cyan-400 to-blue-400',
  },
  {
    icon: Smartphone,
    title: 'PWA Support',
    description: 'Install as a native app on any device with Progressive Web App technology.',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data stays on your device. No cloud storage means complete privacy control.',
    color: 'from-red-400 to-pink-400',
  },
  {
    icon: TrendingUp,
    title: 'Smart Analytics',
    description: 'Get insights into spending patterns and optimize your meal management strategy.',
    color: 'from-indigo-400 to-purple-400',
  },
];

export default function WhyChooseSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
            Why Choose bachOS?
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Built for modern bachelor living with cutting-edge technology and user-centric design.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="glass-card p-4 sm:p-6 lg:p-8"
              >
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${benefit.color} p-2.5 sm:p-3 lg:p-4 flex-shrink-0`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 lg:mb-4">{benefit.title}</h3>
                    <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                      {benefit.description}
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