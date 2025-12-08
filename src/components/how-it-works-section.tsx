'use client';

import { motion } from 'framer-motion';
import { ChefHat, DollarSign, Users } from 'lucide-react';

const steps = [
  {
    icon: Users,
    title: 'Add Members',
    description: 'Create profiles for all members of your bachelor group with ease.',
    color: 'from-green-500 to-green-700',
  },
  {
    icon: ChefHat,
    title: 'Track Meals',
    description: 'Record daily meals and manage meal plans for better organization.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: DollarSign,
    title: 'Monitor Expenses',
    description: 'Track all expenses and get detailed analytics on spending patterns.',
    color: 'from-purple-400 to-purple-600',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-transparent to-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-300 dark:to-blue-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto">
            Get started in three simple steps and transform your meal management experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 sm:p-8 lg:p-10 text-center relative overflow-hidden"
              >
                {/* Step number badge */}
                <div className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${step.color} p-4 mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4 text-foreground">{step.title}</h3>
                <p className="text-sm sm:text-base lg:text-lg text-foreground/70 leading-relaxed">
                  {step.description}
                </p>

                {/* Decorative element */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
