'use client';

import AdvancedFeaturesSection from '@/components/advanced-features-section';
import FeaturesSection from '@/components/features-section';
import HeroSection from '@/components/hero-section';
import HowItWorksSection from '@/components/how-it-works-section';
import LandingFooter from '@/components/landing-footer';
import LandingHeader from '@/components/landing-header';
import WhyChooseSection from '@/components/why-choose-section';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Landing page component that serves as the entry point of the application
 * Handles authentication checking and redirects authenticated users to dashboard
 * Displays professional marketing content for unauthenticated users
 */
export default function Home() {
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

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="space-y-0">
        <HeroSection />
        <div className="py-8 sm:py-12 lg:py-16"></div>
        <FeaturesSection />
        <div className="py-8 sm:py-12 lg:py-16"></div>
        <HowItWorksSection />
        <div className="py-8 sm:py-12 lg:py-16"></div>
        <AdvancedFeaturesSection />
        <div className="py-8 sm:py-12 lg:py-16"></div>
        <WhyChooseSection />
        <div className="py-8 sm:py-12 lg:py-16"></div>
      </main>
      <LandingFooter />
    </div>
  );
}
