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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="glass-card p-4 sm:p-6 lg:p-8 text-center relative"
              >
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                  {index + 1}
                </div>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${step.color} p-3 sm:p-4 lg:p-5 mx-auto mb-3 sm:mb-4 lg:mb-6 mt-3 sm:mt-4`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 lg:mb-4">{step.title}</h3>
                <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}

          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl pointer-events-none">
            <div className="flex justify-between items-center">
              <div className="w-1/3 h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-purple-500"></div>
              <div className="w-1/3 h-0.5 bg-gradient-to-r from-blue-500 via-blue-500/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
