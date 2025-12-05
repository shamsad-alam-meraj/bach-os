'use client';

import DashboardHeader from '@/components/dashboard-header';
import DashboardSidebar from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { apiClient } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, CreditCard, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { subscriptionsService } from '@/services/subscriptions';
import { Plan } from '@/types/api';

export default function CreateSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [userMessId, setUserMessId] = useState<string>('');

  const [formData, setFormData] = useState({
    planId: planId || '',
    couponCode: '',
    paymentMethod: 'sslcommerz' as 'sslcommerz' | 'stripe' | 'bank_transfer' | 'cash',
    autoRenew: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    fetchData();
  }, [router]);

  useEffect(() => {
    if (plans.length > 0 && formData.planId) {
      const plan = plans.find(p => p.id === formData.planId);
      setSelectedPlan(plan || null);
    }
  }, [plans, formData.planId]);

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
      if (!messId) {
        setError('You must be part of a mess to create a subscription');
        return;
      }
      setUserMessId(messId);

      // Fetch plans
      const plansRes = await subscriptionsService.getPlans();
      if (plansRes.data) {
        setPlans(plansRes.data);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan || !userMessId) {
      setError('Please select a plan');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const subscriptionData = {
        messId: userMessId,
        planId: formData.planId,
        couponCode: formData.couponCode || undefined,
        paymentMethod: formData.paymentMethod,
        autoRenew: formData.autoRenew,
      };

      const res = await subscriptionsService.createSubscription(subscriptionData);

      if (res.error) {
        setError(res.error.message || 'Failed to create subscription');
        return;
      }

      // Redirect to success page or back to subscriptions
      router.push('/dashboard/subscriptions?success=true');
    } catch (err) {
      setError('Failed to create subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDiscount = () => {
    if (!selectedPlan) return 0;
    // For now, assume no discount calculation
    return 0;
  };

  const calculateFinalAmount = () => {
    if (!selectedPlan) return 0;
    return selectedPlan.price - calculateDiscount();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
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

        <main className="flex-1 p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/subscriptions')}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Subscriptions
              </Button>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">Create Subscription</h2>
                <p className="text-white/80">Choose your plan and payment method</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subscription Form */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CreditCard className="w-5 h-5" />
                    Subscription Details
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Configure your subscription settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="plan" className="text-white">Select Plan</Label>
                      <Select
                        value={formData.planId}
                        onValueChange={(value) => setFormData({ ...formData, planId: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Choose a plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {plans.map((plan) => (
                            <SelectItem key={plan.id} value={plan.id}>
                              {plan.name} - ৳{plan.price}/{plan.duration} month{plan.duration > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="coupon" className="text-white">Coupon Code (Optional)</Label>
                      <Input
                        id="coupon"
                        placeholder="Enter coupon code"
                        value={formData.couponCode}
                        onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div>
                      <Label htmlFor="payment" className="text-white">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value: any) => setFormData({ ...formData, paymentMethod: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="autoRenew"
                        checked={formData.autoRenew}
                        onCheckedChange={(checked) => setFormData({ ...formData, autoRenew: !!checked })}
                      />
                      <Label htmlFor="autoRenew" className="text-white">
                        Auto-renew subscription
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting || !formData.planId}
                      className="w-full bg-primary hover:bg-primary/80"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating Subscription...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Create Subscription
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Plan Summary */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Plan Summary</CardTitle>
                  <CardDescription className="text-white/70">
                    Review your subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedPlan ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white">Plan:</span>
                        <span className="font-semibold text-white">{selectedPlan.name}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-white">Duration:</span>
                        <span className="text-white">{selectedPlan.duration} month{selectedPlan.duration > 1 ? 's' : ''}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-white">Base Price:</span>
                        <span className="text-white">৳{selectedPlan.price}</span>
                      </div>

                      {calculateDiscount() > 0 && (
                        <div className="flex justify-between items-center text-green-400">
                          <span>Discount:</span>
                          <span>-৳{calculateDiscount()}</span>
                        </div>
                      )}

                      <div className="border-t border-white/20 pt-4">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span className="text-white">Total:</span>
                          <span className="text-white">৳{calculateFinalAmount()}</span>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-white/5 rounded-lg">
                        <h4 className="font-semibold text-white mb-2">Plan Features:</h4>
                        <ul className="space-y-1">
                          {selectedPlan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-white/80">
                              <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-white/70 mt-2">
                          Max members: {selectedPlan.maxMembers}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-white/50 mx-auto mb-4" />
                      <p className="text-white/70">Select a plan to see details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}