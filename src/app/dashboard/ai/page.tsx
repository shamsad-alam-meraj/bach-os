'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Bot, Calendar, ChefHat, Sparkles, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AIPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
  }, [router]);

  const aiTools = [
    {
      id: 'market-schedule',
      title: 'Market Schedule Generator',
      description: 'Generate fair and efficient market duty schedules for your mess members',
      icon: Calendar,
      color: '#C63E04',
      features: [
        'Automated schedule generation',
        'Fair distribution of duties',
        'Avoid weekend assignments',
        'Customizable constraints'
      ]
    },
    {
      id: 'meal-plan',
      title: 'Meal Plan Generator',
      description: 'Create nutritious and cost-effective meal plans for your mess',
      icon: ChefHat,
      color: '#A29EF8',
      features: [
        'Balanced nutrition planning',
        'Cost optimization',
        'Vegetarian/non-vegetarian options',
        'Portion calculations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background page-theme-unified page-themed">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">AI Assistant</h2>
                <p className="text-muted-foreground">Powerful AI tools to streamline your mess management</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aiTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card h-full flex flex-col group hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: tool.color }}
                        >
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="group-hover:text-primary/90">
                            {tool.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">
                            {tool.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Features:</h4>
                        <ul className="space-y-2">
                          {tool.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto">
                        <Button
                          onClick={() => router.push(`/dashboard/ai/${tool.id}`)}
                          className="w-full bg-primary hover:bg-primary/80 group-hover:bg-primary/90 transition-colors"
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          Try {tool.title}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* AI Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Why Use AI Assistant?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="font-semibold mb-2">Save Time</h3>
                      <p className="text-sm text-muted-foreground">
                        Automate routine tasks and reduce manual work
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="font-semibold mb-2">Smart Solutions</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered algorithms for optimal results
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ChefHat className="w-6 h-6 text-purple-400" />
                      </div>
                      <h3 className="font-semibold mb-2">Better Planning</h3>
                      <p className="text-sm text-muted-foreground">
                        Data-driven decisions for mess management
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}