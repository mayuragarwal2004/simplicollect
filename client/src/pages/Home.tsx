import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import {
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  BarChart3,
  CreditCard,
  Users,
  Calendar,
  MessageSquare,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { WhatsappLogo } from '@phosphor-icons/react';
import { Tilt } from 'react-tilt';
import { SpinningText } from '../components/ui/spinning-text';
import LogoMain from '../images/logo/logo-dark.svg';

// Components
import { Button } from '../components/ui/button';
import { GlassCard } from '../components/ui/glass-card';
import { AnimatedBackground } from '../components/ui/animated-background';
import { Separator } from '../components/ui/separator';
import { SmoothCursor } from '../components/ui/smooth-cursor';
import { BentoGrid, BentoCard } from '../components/magicui/bento-grid';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
} from '../components/ui/resizable-navbar';
import { NotificationStack } from '../components/magicui/notification-stack';
import { Spotlight } from '../components/magicui/spotlight';
import { WavyBackground } from '../components/magicui/wavy-background';
import { VelocityScroll } from '../components/magicui/scroll-based-velocity';
import { BoxReveal } from '../components/magicui/box-reveal';
import { GlowingEffect } from '../components/magicui/glowing-effect';
import { GlowButton } from '../components/ui/glow-button';
import { MultiStepLoader } from '../components/ui/multi-step-loader';
import { ParticleTrails } from '../components/ui/particle-trails';
import { SparkleButton } from '../components/ui/sparkle-button';
import { HeroVideoDialogDemo } from '../components/magicui/hero-video-dialog';

// Add font import
import '../styles/fonts.css';

import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '@/utils/config';

const navItems = [
  { name: 'Demo', link: '#demo' },
  { name: 'Features', link: '#features' },
  // { name: 'Testimonials', link: '#testimonials' },
  { name: 'Stats', link: '#stats' },
  { name: 'About', link: '#about' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Community Manager',
    company: 'TechHub Collective',
    quote:
      'Simplicollect transformed how we manage our 500+ member community. Fee collection went from chaos to completely automated.',
    avatar: '👩‍💼',
    date: '2024-01-15',
    category: 'Community Management',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Event Director',
    company: 'StartupWeekend',
    quote:
      "The event management features are incredible. We've organized 50+ events without a single scheduling conflict.",
    avatar: '👨‍💼',
    date: '2024-01-20',
    category: 'Event Planning',
  },
  {
    name: 'Emily Watson',
    role: 'Finance Lead',
    company: 'Alumni Association',
    quote:
      'Finally, a platform that makes financial transparency effortless. Our members love the real-time updates.',
    avatar: '👩‍💼',
    date: '2024-01-25',
    category: 'Financial Management',
  },
  {
    name: 'David Park',
    role: 'Operations Head',
    company: 'Tech Innovators',
    quote:
      'The automation capabilities have reduced our administrative workload by 75%. A game-changer for our organization.',
    avatar: '👨‍💼',
    date: '2024-02-01',
    category: 'Operations',
  },
];

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Resources', href: '#' },
    { name: 'Case Studies', href: '#' },
  ],
  other_products: [
    { name: 'Digital Cards', href: 'https://www.mydigicardmanager.com' },
    { name: 'Community', href: 'https://myorgnnet.com' },
    { name: 'My Dukandar', href: 'https://mydukandar.in' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy-policy' },
    { name: 'Terms', href: '/terms-and-conditions' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
  ],
};

const socialLinks = [
  // {
  //   name: 'Twitter',
  //   icon: Twitter,
  //   href: 'https://twitter.com/simplicollect',
  //   color: 'from-sky-400 to-blue-500',
  // },
  // {
  //   name: 'GitHub',
  //   icon: Github,
  //   href: 'https://github.com/simplicollect',
  //   color: 'from-gray-600 to-gray-800',
  // },
  // {
  //   name: 'Instagram',
  //   icon: Instagram,
  //   href: 'https://instagram.com/simplicollect',
  //   color: 'from-pink-500 to-purple-600',
  // },
  {
    name: 'Website',
    icon: Globe,
    href: 'https://simpliumtechnologies.com',
    color: 'from-gray-400 to-gray-600',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/simplium-technologies',
    color: 'from-blue-600 to-blue-800',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    href: 'https://www.youtube.com/channel/simplicollect',
    color: 'from-red-600 to-red-800',
  },
  {
    name: 'WhatsApp',
    icon: WhatsappLogo,
    href: 'https://wa.me/919975570005', // Replace with your WhatsApp number
    color: 'from-green-500 to-green-700',
  },
];

// Update loading states to reflect the auth process
const authLoadingStates = [
  { text: 'Initializing secure connection...' },
  { text: 'Preparing authentication portal...' },
  { text: 'Setting up secure session...' },
  { text: 'Redirecting to login...' },
];

const dashboardLoadingStates = [
  { text: 'Verifying credentials...' },
  { text: 'Loading your workspace...' },
  { text: 'Fetching organization data...' },
  { text: 'Preparing dashboard...' },
  { text: 'Almost ready...' },
];

export default function Home() {
  const navigate = useNavigate();
  const [showCursor, setShowCursor] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(authLoadingStates);
  const heroRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();
  const [statData, setStatData] = useState({
    totalAmount: 1247,
    totalMembers: 12543,
    totalChapters: 8976,
  });

  const fetchStatData = async () => {
    try {
      const response = await axiosInstance.get('/api/homepage/statistics');
      if (response.data.success) {
        setStatData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatData();
  }, []);

  // Update handleGetStarted function
  const handleGetStarted = () => {
    setIsLoading(true);
    setLoadingStates(authLoadingStates);

    // Navigate to auth after initial loading states
    setTimeout(() => {
      setIsLoading(false);
      navigate('/auth/signin');
    }, authLoadingStates.length * 2000); // Duration per state * number of states
  };

  // Add function to handle post-auth navigation (you'll call this after successful auth)
  const handleAuthSuccess = () => {
    setIsLoading(true);
    setLoadingStates(dashboardLoadingStates);

    // Navigate to dashboard after loading states
    setTimeout(() => {
      setIsLoading(false);
      navigate('/member/dashboard'); // or wherever your dashboard route is
    }, dashboardLoadingStates.length * 2000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const checkPointer = () => {
      // fine pointer = mouse/trackpad, coarse = touch
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
      setShowCursor(hasFinePointer);
    };

    checkPointer();

    // Optional: Listen for changes in pointer type (e.g., mouse connected after page load)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const handler = (e: MediaQueryListEvent) => {
      setShowCursor(e.matches);
    };
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return (
    <>
      {showCursor && (
        <SmoothCursor
          springConfig={{
            damping: 40,
            stiffness: 450,
            mass: 0.8,
            restDelta: 0.001,
          }}
        />
      )}
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={isLoading}
        duration={2000}
        loop={false}
      />
      <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 text-gray-900 overflow-hidden">
        <AnimatedBackground />
        <ParticleTrails
          className="z-0"
          quantity={40}
          particleSize={2}
          particleColor="rgb(14 165 233 / 0.15)"
          maxSpeed={0.3}
          trailLength={15}
        />

        {/* Navigation */}
        <Navbar>
          <NavBody>
            <div className="flex items-center">
              <img src={LogoMain} alt="SimpliCollect" className="h-8 w-auto" />
              {/* <LogoMain className="h-8 w-auto" /> */}
            </div>
            <NavItems items={navItems} />
            <div className="hidden md:flex items-center gap-4 ml-4">
              {/* <Button
                variant="ghost"
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                onClick={() => navigate('/auth/signin')}
              >
                Sign In
              </Button> */}
              <SparkleButton
                onClick={() => navigate('/auth/signin')}
                className="text-white rounded-full"
              >
                {isAuthenticated ? 'Dashboard' : 'Sign In'}
              </SparkleButton>
              {/* <SparkleButton onClick={handleGetStarted} className="text-white">
                Get Started Free
              </SparkleButton> */}
            </div>
          </NavBody>

          <MobileNav className="px-2">
            <MobileNavHeader>
              <NavbarLogo logo={LogoMain} />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="w-full px-4 py-3 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 w-full px-4 pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
                {/* <Button
                  variant="ghost"
                  className="w-full justify-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/auth/signin');
                  }}
                >
                  Sign In
                </Button> */}
                <SparkleButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/auth/signin');
                    handleGetStarted();
                  }}
                  className="w-full justify-center text-white"
                >
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </SparkleButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>

        {/* Hero Section */}
        <WavyBackground className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col items-center justify-center min-h-screen mt-[50px]">
            <div className="w-full text-center space-y-6 relative z-20">
              <div className="space-y-3 flex flex-col items-center">
                <BoxReveal duration={0.7} boxColor="#4f46e5">
                  <h1 className="text-5xl md:text-7xl font-bold font-['Roboto_Condensed'] tracking-tight leading-[1.1] text-center">
                    Redefine Your
                    <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
                      {' '}
                      Organization's Flow
                    </span>
                  </h1>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#06b6d4" width="100%">
                  <p className="text-lg md:text-xl text-gray-600 font-['Roboto_Condensed'] font-light max-w-2xl mx-auto text-center">
                    Next-gen organization management platform built for seamless
                    member coordination, fee collection, and event organization.
                  </p>
                </BoxReveal>
              </div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-4xl mx-auto flex flex-col justify-center items-center mt-8"
              >
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100/20 hover:shadow-xl transition-all duration-300 w-full items-center">
                  <div className="flex flex-col md:flex-row justify-evenly items-center gap-8 px-8 py-6 text-center">
                    <BoxReveal duration={0.5} boxColor="#4f46e5">
                      <motion.div
                        className="flex flex-col justify-center items-center space-y-2 p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-300 text-center m-auto"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 font-['Roboto_Condensed']">
                          {/* ruppe symbol */}
                          {statData.totalAmount}
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide font-['Roboto_Condensed']">
                          Total Collections
                        </div>
                      </motion.div>
                    </BoxReveal>

                    <BoxReveal duration={0.5} boxColor="#06b6d4">
                      <motion.div
                        className="flex flex-col justify-center items-center space-y-2 p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-300 text-center m-auto"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 font-['Roboto_Condensed']">
                          {statData.totalMembers.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide font-['Roboto_Condensed']">
                          Active Members
                        </div>
                      </motion.div>
                    </BoxReveal>

                    <BoxReveal duration={0.5} boxColor="#3b82f6">
                      <motion.div
                        className="flex flex-col justify-center items-center space-y-2 p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-300 text-center m-auto"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 font-['Roboto_Condensed']">
                          {statData.totalChapters.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide font-['Roboto_Condensed']">
                          Chapters Onboarded
                        </div>
                      </motion.div>
                    </BoxReveal>
                  </div>
                </div>
              </motion.div>

              <BoxReveal duration={0.7} boxColor="#3b82f6" width="100%">
                <div className="flex flex-col sm:flex-row items-center justify-center w-full mx-auto max-w-md mt-8 gap-4">
                  <SparkleButton
                    onClick={() => navigate('/auth/signin')}
                    className="w-full sm:w-auto font-['Roboto_Condensed'] tracking-wide text-white"
                  >
                    {isAuthenticated ? 'Dashboard' : 'Sign In'}
                  </SparkleButton>
                  <SparkleButton
                    className="w-full sm:w-auto font-['Roboto_Condensed'] tracking-wide border-sky-500 border text-sky-700 bg-white hover:bg-sky-50"
                    onClick={() =>
                      window.open('https://wa.me/919975570005', '_blank')
                    }
                  >
                    Contact Sales / Demo
                  </SparkleButton>
                </div>
              </BoxReveal>
            </div>
          </div>
        </WavyBackground>

        {/* Video Demo Section */}
        <section
          id="demo"
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          {/* Background with gradient and blur */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-white to-white pointer-events-none -z-10" />
          <div className="opacity-[0.015]">
            <AnimatedBackground />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4 mb-12"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-4">
                Watch Overview
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-['Roboto_Condensed'] text-gray-900 tracking-tight">
                Simplicollect
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
                  {' '}
                  Application Summary
                </span>
              </h2>
              <p className="text-xl text-gray-600 font-['Roboto_Condensed'] max-w-2xl mx-auto">
                Watch this short video to get a complete overview of how
                Simplicollect empowers organizations to manage members, events,
                and finances with ease.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto relative z-20"
            >
              <HeroVideoDialogDemo />
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
            >
              <motion.div whileHover={{ y: -8 }} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                <GlassCard className="relative p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-4xl transform transition-transform duration-300 group-hover:scale-110">
                      ⚡
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-['Roboto_Condensed']">
                      Quick Setup
                    </h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transform origin-left transition-all duration-300 group-hover:w-24" />
                    <p className="text-gray-600 font-['Roboto_Condensed']">
                      Get started in minutes with our intuitive onboarding
                      process
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div whileHover={{ y: -8 }} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                <GlassCard className="relative p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-4xl transform transition-transform duration-300 group-hover:scale-110">
                      🎯
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-['Roboto_Condensed']">
                      Easy to Use
                    </h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform origin-left transition-all duration-300 group-hover:w-24" />
                    <p className="text-gray-600 font-['Roboto_Condensed']">
                      Designed for simplicity while maintaining powerful
                      functionality
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div whileHover={{ y: -8 }} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                <GlassCard className="relative p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-4xl transform transition-transform duration-300 group-hover:scale-110">
                      🚀
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 font-['Roboto_Condensed']">
                      Scale Fast
                    </h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transform origin-left transition-all duration-300 group-hover:w-24" />
                    <p className="text-gray-600 font-['Roboto_Condensed']">
                      Grows with your organization, from dozens to thousands of
                      members
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="min-h-screen flex items-center justify-center relative overflow-hidden z-10"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/30 z-0" />
          <div className="opacity-[0.015]">
            <AnimatedBackground />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,white_30%,transparent_100%)] z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4 mb-16"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-4">
                Powerful Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-['Roboto_Condensed'] text-gray-900 tracking-tight">
                Everything You Need to
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
                  {' '}
                  Succeed
                </span>
              </h2>
              <p className="text-xl text-gray-600 font-['Roboto_Condensed'] max-w-2xl mx-auto">
                Comprehensive tools designed to streamline your organization's
                operations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {/* Report Generation Feature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <GlassCard className="relative overflow-hidden">
                  <GlowingEffect spread={60} />
                  <div className="p-6 space-y-4">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <BarChart3 className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
                      Report Generation
                    </h3>
                    <p className="text-gray-600">
                      Instantly generate detailed reports on collections, member
                      activity, and events—exportable for compliance and
                      insights.
                    </p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-sky-500 to-blue-600 w-0 group-hover:w-full transition-all duration-300" />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Payment Feature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <GlassCard className="relative overflow-hidden">
                  <GlowingEffect spread={60} />
                  <div className="p-6 space-y-4">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      Visitor Management
                    </h3>
                    <p className="text-gray-600">
                      Effortlessly track, register, and manage visitor
                      follow-ups, digital check-ins, and comprehensive visitor
                      history.
                    </p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600 w-0 group-hover:w-full transition-all duration-300" />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Member Management Feature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <GlassCard className="relative overflow-hidden">
                  <GlowingEffect spread={60} />
                  <div className="p-6 space-y-4">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Member Management
                    </h3>
                    <p className="text-gray-600">
                      Comprehensive tools for managing member profiles, roles,
                      and engagement tracking.
                    </p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 w-0 group-hover:w-full transition-all duration-300" />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Expense Management Feature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <GlassCard className="relative overflow-hidden">
                  <GlowingEffect spread={60} />
                  <div className="p-6 space-y-4">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <CreditCard className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                      Expense Management
                    </h3>
                    <p className="text-gray-600">
                      Track, categorize, and control organizational expenses
                      with real-time reporting and approval workflows.
                    </p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-red-600 w-0 group-hover:w-full transition-all duration-300" />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Membership Fee Management Feature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <GlassCard className="relative overflow-hidden">
                  <GlowingEffect spread={60} />
                  <div className="p-6 space-y-4">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <CreditCard className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      Membership Fee Management
                    </h3>
                    <p className="text-gray-600">
                      Flexible fee structures with support for penalties,
                      discounts, and custom rules—making collections seamless
                      for any organization.
                    </p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 w-0 group-hover:w-full transition-all duration-300" />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Security Feature */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <GlassCard className="relative overflow-hidden">
                  <GlowingEffect spread={60} />
                  <div className="p-6 space-y-4">
                    <motion.div
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Shield className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                      Enterprise Security
                    </h3>
                    <p className="text-gray-600">
                      Advanced security with encryption and compliance built
                      into every feature. Regular security updates ensure your
                      data is always protected.
                    </p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600 w-0 group-hover:w-full transition-all duration-300" />
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <SparkleButton
                onClick={handleGetStarted}
                className="text-lg text-white"
              >
                Explore All Features
              </SparkleButton>
            </motion.div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section
          id="testimonials"
          className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-50/50 to-white z-10 hidden"
        >
          <div className="absolute inset-0 h-full w-full bg-white opacity-30 [mask-image:radial-gradient(circle_at_center,transparent_10%,white_90%)]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-4xl font-bold font-['Roboto_Condensed'] text-gray-900 tracking-tight">
                Loved by Organizations Worldwide
              </h2>
              <p className="text-xl text-gray-600 font-['Roboto_Condensed'] max-w-2xl mx-auto">
                See what our users have to say about their experience with
                Simplicollect
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex w-full flex-col items-start justify-between border-4 border-black bg-gradient-to-b from-white via-gray-100 to-gray-200 p-6 shadow-[8px_8px_0_0_#000] transition-all duration-500 ease-in-out hover:scale-105 hover:bg-gradient-to-b hover:from-gray-200 hover:to-white hover:shadow-[12px_12px_0_0_#000]"
                >
                  <div className="mb-2 flex items-center gap-x-2 text-xs">
                    <time
                      className="border-2 border-black bg-sky-500 px-3 py-1 font-bold text-white transition-all duration-500 ease-in-out hover:scale-110"
                      dateTime={testimonial.date}
                    >
                      {new Date(testimonial.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <a
                      className="relative z-10 border-2 border-black bg-sky-500 px-3 py-1 font-bold text-white transition-all duration-500 ease-in-out hover:bg-blue-600"
                      href="#"
                    >
                      {testimonial.category}
                    </a>
                  </div>

                  <div className="group relative">
                    <h3 className="mt-3 text-2xl font-black uppercase leading-6 text-black transition-all duration-500 ease-in-out group-hover:text-sky-500">
                      <a href="#">
                        <span className="absolute inset-0"></span>
                        {testimonial.company}
                      </a>
                    </h3>
                    <p className="text-md mt-5 border-l-4 border-sky-500 pl-4 leading-6 text-gray-800 transition-all duration-500 ease-in-out group-hover:border-blue-500">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  <div className="relative mt-8 flex items-center gap-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-2xl">
                      {testimonial.avatar}
                    </div>
                    <div className="text-sm leading-6">
                      <p className="font-black text-black transition-all duration-500 ease-in-out hover:scale-110">
                        <a
                          href="#"
                          className="hover:underline hover:text-sky-500"
                        >
                          <span className="absolute inset-0"></span>
                          {testimonial.name}
                        </a>
                      </p>
                      <p className="font-bold text-gray-700 transition-all duration-500 ease-in-out hover:text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Scrolling Stats Section */}
        <section
          id="stats"
          className="relative min-h-screen flex flex-col justify-center overflow-hidden z-10"
        >
          {/* Gradient background with noise texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5,#06b6d4)] opacity-10" />
          <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay" />

          <div className="relative max-w-7xl mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                Growing Fast
              </span>
              <h2 className="text-4xl font-bold font-['Roboto_Condensed'] text-gray-900 tracking-tight mb-4">
                Transforming Organization Management
              </h2>
              <p className="text-xl text-gray-600 font-['Roboto_Condensed']">
                See how organizations are revolutionizing their operations
              </p>
            </motion.div>
          </div>

          <div className="flex-1 flex flex-col justify-start space-y-6">
            <VelocityScroll
              defaultVelocity={2}
              className="py-8 bg-gradient-to-r from-indigo-600/90 to-cyan-600/90 backdrop-blur-sm text-white/90"
            >
              Streamline Operations • Boost Efficiency • Enhance Member
              Experience • Drive Growth • Maximize Revenue
            </VelocityScroll>

            <VelocityScroll
              defaultVelocity={-2}
              className="py-8 bg-gradient-to-r from-violet-600/90 to-indigo-600/90 backdrop-blur-sm text-white/90"
            >
              Smart Automation • Real-time Insights • Seamless Integration •
              Secure Platform • 24/7 Support
            </VelocityScroll>

            <VelocityScroll
              defaultVelocity={2}
              className="py-8 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-sm text-white/90"
            >
              Trusted by Industry Leaders • Global Reach • Enterprise Ready •
              Scalable Solution • Future Proof
            </VelocityScroll>
          </div>
        </section>

        {/* Spinning Text Section */}
        <section
          id="about"
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white to-sky-50/30" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Spinning Text */}
              <div className="relative">
                <div className="absolute -top-20 -left-20 w-64 h-[22rem] bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-64 h-[22rem] bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative flex flex-col items-center lg:items-start">
                  <div className="w-64 h-[22rem] flex items-center justify-center">
                    <SpinningText
                      className="text-4xl font-bold text-gray-800"
                      duration={15}
                      radius={8}
                    >
                      Simplify • Automate • Transform • Grow • Scale •
                    </SpinningText>
                  </div>
                </div>
              </div>

              {/* Right Side - Text Content */}
              <div className="space-y-8 z-10">
                <BoxReveal duration={0.7} boxColor="#06b6d4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="prose prose-lg"
                  >
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600">
                      Empowering Organizations Worldwide
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg">
                      With Simplicollect, organizations will experience
                      unprecedented growth and efficiency. Our platform will
                      become the backbone of successful operations for thousands
                      of organizations globally, managing millions of members
                      and transactions.
                    </p>
                  </motion.div>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#3b82f6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="prose prose-lg"
                  >
                    <p className="text-gray-600 mb-6 text-lg">
                      From streamlining member management to automating fee
                      collections, we're helping organizations focus on what
                      matters most - their mission and impact.
                    </p>
                    <div className="flex items-center gap-4">
                      <SparkleButton
                        onClick={() => {
                          // handleGetStarted();
                          window.open(
                            'https://wa.me/919975570005?text=Hello,%20I%20want%20to%20get%20started%20with%20Simplicollect.',
                            '_blank',
                          );
                        }}
                        className="text-white"
                      >
                        Get Started Now
                      </SparkleButton>
                    </div>
                  </motion.div>
                </BoxReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative bg-gradient-to-b from-sky-50 to-white py-24 sm:py-32 overflow-hidden z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-grid-slate-200/20 backdrop-blur-sm" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div className="max-w-xl lg:max-w-lg space-y-8">
                <BoxReveal duration={0.7} boxColor="#4f46e5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={LogoMain} alt="Simplicollect Logo" />
                    </div>
                    <p className="text-xl text-gray-600 max-w-md">
                      Join thousands of organizations revolutionizing their
                      management with Simplicollect.
                    </p>
                  </div>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#06b6d4">
                  <SubscribeForm />
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#3b82f6">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Follow Simplium Technologies
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      {socialLinks.map((social, idx) => (
                        <motion.a
                          key={idx}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br ${social.color} group relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-white/10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                          <social.icon className="h-5 w-5 text-white relative z-10" />
                          <span className="text-sm font-medium text-white relative z-10">
                            {social.name}
                          </span>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </BoxReveal>
              </div>

              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                {/* <BoxReveal duration={0.7} boxColor="#4f46e5">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Product
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.product.map((link, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ x: 2 }}
                          className="relative group"
                        >
                          <a
                            href={link.href}
                            className="relative text-gray-600 hover:text-sky-600 transition-colors"
                          >
                            {link.name}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </BoxReveal> */}

                <BoxReveal duration={0.7} boxColor="#06b6d4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Other Products
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.other_products.map((link, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ x: 2 }}
                          className="relative group"
                        >
                          <a
                            href={link.href}
                            className="relative text-gray-600 hover:text-sky-600 transition-colors"
                          >
                            {link.name}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#3b82f6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Legal
                    </h3>
                    <ul className="space-y-3">
                      {footerLinks.legal.map((link, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ x: 2 }}
                          className="relative group"
                        >
                          <Link
                            to={link.href}
                            className="relative text-gray-600 hover:text-sky-600 transition-colors"
                          >
                            {link.name}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </BoxReveal>
              </div>
            </div>

            <div className="mt-16 border-t border-gray-900/10 pt-8">
              <BoxReveal duration={0.7} boxColor="#4f46e5">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <div className="flex flex-col md:flex-row items-center justify-center w-full md:w-auto gap-1 md:gap-2 text-sm leading-5 text-gray-500 text-center m-auto">
                    <span>
                      © {new Date().getFullYear()} Simplicollect. All rights
                      reserved.
                    </span>
                    <span className="hidden md:inline">|</span>
                    <span className="flex items-center gap-1">
                      A Product by
                      <a
                        href="https://simpliumtechnologies.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-1"
                      >
                        Simplium Technologies
                      </a>
                    </span>
                  </div>
                  <div className="flex gap-6">
                    {footerLinks.legal.map((link, idx) => (
                      <motion.a
                        key={idx}
                        href={link.href}
                        className="text-sm leading-5 text-gray-600 hover:text-sky-600"
                        whileHover={{ y: -1 }}
                      >
                        {link.name}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </BoxReveal>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

const SubscribeForm = () => {
  const [email, setEmail] = useState('');
  const handleSubscribe = () => {
    if (email) {
      try {
        axiosInstance
          .post('/api/homepage/newsletter', { email })
          .then((response) => {
            console.log('Subscription successful:', response.data);
          })
          .catch((error) => {
            console.error('Subscription error:', error);
          });
      } catch (error) {
        console.error('Error subscribing:', error);
      }
    }
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Subscribe to our newsletter
      </h3>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
        <SparkleButton onClick={handleSubscribe} className="text-white">
          Subscribe
        </SparkleButton>
      </div>
    </div>
  );
};
