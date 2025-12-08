'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { subscriptionsService } from '@/services/subscriptions';
import { Plan, Subscription } from '@/types/api';
import { motion } from 'framer-motion';
import { AlertCircle, Check, CreditCard, Crown, Star, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [userMessId, setUserMessId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get user profile to get messId
      const profileRes = await apiClient.get<{ id: string; messId?: string }>('/users/profile');
      if (profileRes.error) {
        setError(profileRes.error.message || 'Failed to load profile');
        return;
      }

      const messId = profileRes.data?.messId;
      setUserMessId(messId || '');

      // Fetch plans
      const plansRes = await subscriptionsService.getPlans();
      if (plansRes.data) {
        // Sort plans to show Premium in the middle
        const sortedPlans = plansRes.data.sort((a, b) => {
          const order = { 'Basic Plan': 1, 'Premium Plan': 2, 'Standard Plan': 3 };
          return (
            (order[a.name as keyof typeof order] || 99) -
            (order[b.name as keyof typeof order] || 99)
          );
        });
        setPlans(sortedPlans);
      }

      // Fetch current subscription if user has a mess
      if (messId) {
        const subscriptionRes = await subscriptionsService.getMessSubscriptions(messId);
        if (subscriptionRes.data && subscriptionRes.data.length > 0) {
          // Get the active subscription
          const activeSub = subscriptionRes.data.find((sub) => sub.status === 'active');
          setCurrentSubscription(activeSub || subscriptionRes.data[0]);
        }
      }
    } catch (err) {
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    router.push(`/dashboard/subscriptions/create?planId=${planId}`);
  };

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('basic')) return <Check className="w-6 h-6" />;
    if (planName.toLowerCase().includes('standard')) return <Star className="w-6 h-6" />;
    if (planName.toLowerCase().includes('premium')) return <Crown className="w-6 h-6" />;
    return <Zap className="w-6 h-6" />;
  };

  const getPlanColor = (planName: string) => {
    if (planName.toLowerCase().includes('basic')) return 'bg-green-500';
    if (planName.toLowerCase().includes('standard')) return 'bg-blue-500';
    if (planName.toLowerCase().includes('premium')) return 'bg-purple-500';
    return 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-theme-unified page-themed">
      <DashboardHeader
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <DashboardSidebar isOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Subscription Management</h2>
                <p className="text-muted-foreground">Choose the perfect plan for your mess</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Current Subscription */}
            {currentSubscription && (
              <Card className="glass-card mb-8 border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <Check className="w-5 h-5" />
                    Current Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{currentSubscription.planId.name}</h3>
                      <p className="text-muted-foreground">
                        {currentSubscription.planId.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          {currentSubscription.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Expires: {new Date(currentSubscription.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">৳{currentSubscription.finalAmount}</p>
                      <p className="text-sm text-muted-foreground">
                        per {currentSubscription.planId.duration} month
                        {currentSubscription.planId.duration > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {plans.map((plan, index) => {
                const isPremium = plan.name.toLowerCase().includes('premium');
                const isMiddleCard = plans.length === 3 && index === 1;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={isMiddleCard ? 'md:col-start-2 lg:col-start-2' : ''}
                  >
                    <Card
                      className={`glass-card h-full flex flex-col relative overflow-hidden ${
                        isPremium
                          ? 'border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-lg shadow-purple-500/20'
                          : ''
                      }`}
                    >
                      {isPremium && (
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-semibold">
                          <Crown className="w-4 h-4 inline mr-1" />
                          Most Popular
                        </div>
                      )}
                      <CardHeader className={`text-center ${isPremium ? 'pt-12' : ''}`}>
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 ${getPlanColor(
                            plan.name
                          )} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}
                        >
                          {getPlanIcon(plan.name)}
                        </div>
                        <CardTitle className="text-lg sm:text-xl lg:text-2xl">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-sm sm:text-base px-2">
                          {plan.description}
                        </CardDescription>
                        <div className="mt-4 sm:mt-6">
                          <span className="text-3xl sm:text-4xl font-bold">৳{plan.price}</span>
                          <span className="text-muted-foreground text-sm sm:text-base">
                            /{plan.duration} month{plan.duration > 1 ? 's' : ''}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        <div className="mb-6">
                          <p className="text-sm text-muted-foreground mb-2">Features:</p>
                          <ul className="space-y-1">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm text-muted-foreground mt-4">
                            Max members: {plan.maxMembers}
                          </p>
                        </div>

                        <div className="mt-auto">
                          {currentSubscription && currentSubscription.planId.id === plan.id ? (
                            <Button
                              disabled
                              className="w-full bg-green-500/20 text-green-400 cursor-not-allowed"
                            >
                              Current Plan
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleSubscribe(plan.id)}
                              className="w-full bg-primary hover:bg-primary/80"
                              disabled={!userMessId}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              {userMessId ? 'Subscribe' : 'Create Mess First'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {!userMessId && (
              <Card className="glass-card mt-8 border-yellow-500/20 bg-yellow-500/5">
                <CardContent className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Mess Found</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to create or join a mess before subscribing to a plan.
                  </p>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-primary hover:bg-primary/80"
                  >
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
