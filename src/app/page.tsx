'use client';

import { LogIn, TrendingUp, Users, Wifi } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Dynamically import framer-motion to avoid HMR issues
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
  loading: () => <div />,
});

const MotionButton = dynamic(() => import('framer-motion').then((mod) => mod.motion.button), {
  ssr: false,
  loading: () => <button />,
});

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Token found, redirecting to dashboard');
          router.replace('/dashboard'); // Use replace instead of push to avoid adding to history
        }
      } catch (error) {
        console.log('Error checking auth:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Delay the check to ensure we're on client side
    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Add and manage members easily',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Track expenses and trends',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Wifi,
      title: 'Offline Support',
      description: 'Works without internet',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  // Simple div component as fallback
  const SimpleDiv = ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  );

  const SimpleButton = ({ children, className, ...props }: any) => (
    <button className={className} {...props}>
      {children}
    </button>
  );

  // Use Motion components if available, otherwise use simple components
  const AnimatedDiv = typeof window !== 'undefined' ? MotionDiv : SimpleDiv;
  const AnimatedButton = typeof window !== 'undefined' ? MotionButton : SimpleButton;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <AnimatedDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-3xl"
      >
        <div className="mb-6 sm:mb-8 flex justify-center">
          <AnimatedDiv
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="glass-card bg-gradient-to-br from-purple-500/40 to-blue-500/40 p-4 sm:p-6"
          >
            <LogIn className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600 dark:text-purple-300" />
          </AnimatedDiv>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 dark:from-purple-300 dark:via-blue-300 dark:to-pink-300 bg-clip-text text-transparent">
          bachOS
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-8 sm:mb-12 leading-relaxed px-2 sm:px-0">
          Manage your bachelor meal expenses, track members, and analyze spending with ease. Works
          offline with PWA support.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <AnimatedDiv
                key={index}
                whileHover={{ y: -4, rotateZ: 1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group p-4 sm:p-6"
              >
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2 sm:p-3 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-full h-full text-white" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </AnimatedDiv>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-xs sm:max-w-none mx-auto">
          <Link href="/auth/login" className="w-full sm:w-auto">
            <AnimatedButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-button bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 flex items-center gap-2 justify-center w-full px-6 py-3 sm:py-2 text-sm sm:text-base"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              Log In
            </AnimatedButton>
          </Link>

          <Link href="/auth/signup" className="w-full sm:w-auto">
            <AnimatedButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-light px-6 py-3 sm:py-2 rounded-xl font-medium border-2 border-purple-500 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 transition-all w-full text-sm sm:text-base"
            >
              Sign Up
            </AnimatedButton>
          </Link>
        </div>
      </AnimatedDiv>
    </main>
  );
}
