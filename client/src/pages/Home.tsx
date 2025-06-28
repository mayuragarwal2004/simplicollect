import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { Twitter, Github, Linkedin, Instagram, BarChart3, CreditCard, Users, Calendar, MessageSquare, ArrowRight, Shield } from 'lucide-react';
import { Tilt } from 'react-tilt';
import { SpinningText } from '../components/ui/spinning-text';

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

// Add Logo component
const Logo = ({ className = "" }: { className?: string }) => (
  <svg 
    className={cn("h-8 w-auto", className)}
    viewBox="0 0 172.8 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="linear-gradient" x1="16" x2="16" y2="32" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#3fa9f5"/>
        <stop offset="0.13" stopColor="#3da4f5"/>
        <stop offset="0.29" stopColor="#3896f6"/>
        <stop offset="0.45" stopColor="#2f7ff7"/>
        <stop offset="0.63" stopColor="#235ff9"/>
        <stop offset="0.80" stopColor="#1435fc"/>
        <stop offset="0.98" stopColor="#0103ff"/>
        <stop offset="0.99" stopColor="blue"/>
      </linearGradient>
    </defs>
    <rect fill="url(#linear-gradient)" width="32" height="32" rx="9.39"/>
    <path fill="white" d="M12.59,26,6.15,21.38a2.08,2.08,0,0,1-.46-2.93h0a2.16,2.16,0,0,1,3-.44L12,20.42a2.16,2.16,0,0,0,2.84-.29l10.19-11a2.15,2.15,0,0,1,3-.15h0a2.07,2.07,0,0,1,.15,3L15.44,25.75A2.16,2.16,0,0,1,12.59,26Z"/>
    <path fill="white" d="M12.32,20.23l-5.63-4A1.61,1.61,0,0,1,6.31,14h0a1.69,1.69,0,0,1,2.33-.38l5.63,4a1.61,1.61,0,0,1,.38,2.28h0A1.68,1.68,0,0,1,12.32,20.23Z"/>
    <text x="40" y="22" className="text-gray-900 dark:text-white" fill="currentColor" fontFamily="'Roboto Condensed', sans-serif" fontSize="24" fontWeight="bold">
      Simplicollect
    </text>
  </svg>
);

const navItems = [
  { name: 'Demo', link: '#demo' },
  { name: 'Features', link: '#features' },
  { name: 'Testimonials', link: '#testimonials' },
  { name: 'Stats', link: '#stats' },
  { name: 'About', link: '#about' }
];

const features = [
  {
    title: 'Smart Fee Collection',
    description: 'Automated payment processing with intelligent reminders and multi-channel collection strategies.',
    icon: '💳',
    link: '#learn-more'
  },
  {
    title: 'Real-Time Member Sync',
    description: 'Live member management with instant updates, role-based permissions, and engagement tracking.',
    icon: '🔄',
    link: '#learn-more'
  },
  {
    title: 'Event Automation Engine',
    description: 'Streamlined event planning with automated scheduling, RSVPs, and seamless coordination.',
    icon: '📅',
    link: '#learn-more'
  },
  {
    title: 'Security & Compliance',
    description: 'Bank-grade encryption with comprehensive audit trails and regulatory compliance built-in.',
    icon: '🔒',
    link: '#learn-more'
  },
  {
    title: 'Advanced Analytics',
    description: 'Deep insights into member engagement, financial trends, and organizational performance.',
    icon: '📊',
    link: '#learn-more'
  },
  {
    title: 'Lightning Performance',
    description: 'Optimized for speed with real-time synchronization and instant data processing.',
    icon: '⚡',
    link: '#learn-more'
  }
];

const stats = [
  { value: '$1,247', label: 'Total Collections' },
  { value: '12,543', label: 'Active Members' },
  { value: '8,976', label: 'Events Organized' }
];

const results = [
  { title: 'Streamlined Operations', value: '80%', label: 'Time Saved', description: 'Reduce administrative overhead by 80% with automated workflows' },
  { title: 'Increased Collections', value: '95%', label: 'Collection Rate', description: 'Smart reminders and payment options boost collection rates' },
  { title: 'Instant Organization', value: '24/7', label: 'Sync Speed', description: 'Real-time updates keep everyone synchronized and informed' },
  { title: 'Member Satisfaction', value: '4.9★', label: 'User Rating', description: 'Intuitive interface creates positive experiences for all users' }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Community Manager',
    company: 'TechHub Collective',
    quote: 'Simplicollect transformed how we manage our 500+ member community. Fee collection went from chaos to completely automated.',
    avatar: '👩‍💼',
    date: '2024-01-15',
    category: 'Community Management'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Event Director',
    company: 'StartupWeekend',
    quote: "The event management features are incredible. We've organized 50+ events without a single scheduling conflict.",
    avatar: '👨‍💼',
    date: '2024-01-20',
    category: 'Event Planning'
  },
  {
    name: 'Emily Watson',
    role: 'Finance Lead',
    company: 'Alumni Association',
    quote: 'Finally, a platform that makes financial transparency effortless. Our members love the real-time updates.',
    avatar: '👩‍💼',
    date: '2024-01-25',
    category: 'Financial Management'
  },
  {
    name: 'David Park',
    role: 'Operations Head',
    company: 'Tech Innovators',
    quote: 'The automation capabilities have reduced our administrative workload by 75%. A game-changer for our organization.',
    avatar: '👨‍💼',
    date: '2024-02-01',
    category: 'Operations'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small organizations getting started',
    price: '29',
    features: [
      'Up to 100 members',
      'Basic fee collection',
      'Event scheduling',
      'Email support',
      'Mobile app access'
    ]
  },
  {
    name: 'Professional',
    description: 'Advanced features for growing organizations',
    price: '79',
    popular: true,
    features: [
      'Up to 500 members',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      'API access',
      'Advanced integrations'
    ]
  },
  {
    name: 'Enterprise',
    description: 'Full-featured solution for large organizations',
    price: '199',
    features: [
      'Unlimited members',
      'White-label solution',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom integrations',
      'Advanced security'
    ]
  }
];

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Resources', href: '#' },
    { name: 'Case Studies', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  legal: [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ]
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/simplicollect', color: 'from-sky-400 to-blue-500' },
  { name: 'GitHub', icon: Github, href: 'https://github.com/simplicollect', color: 'from-gray-600 to-gray-800' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/simplicollect', color: 'from-blue-600 to-blue-800' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/simplicollect', color: 'from-pink-500 to-purple-600' }
];

const bentoFeatures = [
  {
    name: "Smart Analytics",
    description: "Real-time insights into member engagement and financial performance with advanced data visualization.",
    icon: BarChart3,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100">
        <div className="grid h-full grid-cols-3 gap-4 p-8">
          {[0.4, 0.6, 0.8].map((height, i) => (
            <div key={i} className="flex items-end">
              <div 
                className="w-full rounded-lg bg-blue-500/20 transition-all group-hover:bg-blue-500/40"
                style={{ height: `${height * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    href: "#analytics",
    cta: "Explore Analytics"
  },
  {
    name: "Payment Processing",
    description: "Secure and efficient payment collection with multiple gateway support and automated reconciliation.",
    icon: CreditCard,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100">
        <div className="flex h-full items-center justify-center">
          <div className="grid grid-cols-2 gap-4 p-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-16 rounded-md bg-green-500/20 transition-all group-hover:bg-green-500/40" />
            ))}
          </div>
        </div>
      </div>
    ),
    href: "#payments",
    cta: "Learn More"
  },
  {
    name: "Member Management",
    description: "Comprehensive tools for managing member profiles, roles, and engagement tracking.",
    icon: Users,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="flex h-full flex-wrap items-center justify-center gap-4 p-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-12 rounded-full bg-purple-500/20 transition-all group-hover:bg-purple-500/40" />
          ))}
        </div>
      </div>
    ),
    href: "#members",
    cta: "View Features"
  },
  {
    name: "Event Management",
    description: "Streamlined event planning and coordination with automated scheduling and RSVPs.",
    icon: Calendar,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100">
        <div className="grid h-full grid-cols-7 gap-1 p-8">
          {[...Array(14)].map((_, i) => (
            <div 
              key={i} 
              className={`rounded-lg ${i % 3 === 0 ? 'bg-orange-500/20' : 'bg-orange-500/10'} transition-all group-hover:bg-orange-500/40`}
            />
          ))}
        </div>
      </div>
    ),
    href: "#events",
    cta: "Schedule Now"
  },
  {
    name: "Communication Hub",
    description: "Integrated messaging and notification system for seamless team coordination.",
    icon: MessageSquare,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-sky-100">
        <div className="flex h-full flex-col justify-center gap-4 p-8">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className={`h-8 rounded-xl ${i % 2 === 0 ? 'bg-cyan-500/20 ms-auto w-3/4' : 'bg-cyan-500/10 w-3/4'} transition-all group-hover:bg-cyan-500/40`}
            />
          ))}
        </div>
      </div>
    ),
    href: "#communication",
    cta: "Start Chatting"
  }
];

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-sky-100/50 p-2 md:rounded-3xl md:p-3 bg-white/80 backdrop-blur-sm">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 shadow-lg shadow-sky-100/20">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-sky-200 bg-sky-50/50 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-['Roboto_Condensed'] text-xl/[1.375rem] font-semibold text-balance text-gray-900 md:text-2xl/[1.875rem]">
                {title}
              </h3>
              <h2 className="font-['Roboto_Condensed'] text-sm/[1.125rem] text-gray-600 md:text-base/[1.375rem]">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

// Update loading states to reflect the auth process
const authLoadingStates = [
  { text: "Initializing secure connection..." },
  { text: "Preparing authentication portal..." },
  { text: "Setting up secure session..." },
  { text: "Redirecting to login..." }
];

const dashboardLoadingStates = [
  { text: "Verifying credentials..." },
  { text: "Loading your workspace..." },
  { text: "Fetching organization data..." },
  { text: "Preparing dashboard..." },
  { text: "Almost ready..." }
];

export default function Home() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(authLoadingStates);
  const heroRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <SmoothCursor 
        springConfig={{
          damping: 45,
          stiffness: 400,
          mass: 1,
          restDelta: 0.001
        }}
      />
      <MultiStepLoader loadingStates={loadingStates} loading={isLoading} duration={2000} loop={false} />
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
              <Logo className="h-8 w-auto" />
            </div>
            <NavItems items={navItems} />
            <div className="hidden md:flex items-center gap-4 ml-4">
              <Button
                variant="ghost"
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                onClick={() => navigate('/auth/signin')}
              >
                Sign In
              </Button>
              <SparkleButton
                onClick={handleGetStarted}
                className="text-white"
              >
                Get Started Free
              </SparkleButton>
            </div>
          </NavBody>

          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
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
                <Button
                  variant="ghost"
                  className="w-full justify-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/auth/signin');
                  }}
                >
                  Sign In
                </Button>
                <SparkleButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleGetStarted();
                  }}
                  className="w-full justify-center text-white"
                >
                  Get Started Free
                </SparkleButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>

        {/* Hero Section */}
        <WavyBackground className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col items-center justify-center min-h-screen">
            <div className="w-full text-center space-y-6 relative z-20">
              <div className="space-y-3 flex flex-col items-center">
                <BoxReveal duration={0.7} boxColor="#4f46e5">
                  <h1 className="text-5xl md:text-7xl font-bold font-['Roboto_Condensed'] tracking-tight leading-[1.1] text-center">
                    Redefine Your
                    <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
                      {' '}Organization's Flow
                    </span>
                  </h1>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#06b6d4" width="100%">
                  <p className="text-lg md:text-xl text-gray-600 font-['Roboto_Condensed'] font-light max-w-2xl mx-auto text-center">
                    Next-gen organization management platform built for seamless member coordination, fee collection, and event organization.
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
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100/20 hover:shadow-xl transition-all duration-300 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-6">
                    <BoxReveal duration={0.5} boxColor="#4f46e5">
                      <motion.div 
                        className="flex flex-col justify-center items-center space-y-2 p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 font-['Roboto_Condensed']">
                          $1,247
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide font-['Roboto_Condensed']">
                          Total Collections
                        </div>
                      </motion.div>
                    </BoxReveal>

                    <BoxReveal duration={0.5} boxColor="#06b6d4">
                      <motion.div 
                        className="flex flex-col justify-center items-center space-y-2 p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 font-['Roboto_Condensed']">
                          12,543
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide font-['Roboto_Condensed']">
                          Active Members
                        </div>
                      </motion.div>
                    </BoxReveal>

                    <BoxReveal duration={0.5} boxColor="#3b82f6">
                      <motion.div 
                        className="flex flex-col justify-center items-center space-y-2 p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 font-['Roboto_Condensed']">
                          8,976
                        </div>
                        <div className="text-sm text-gray-600 uppercase tracking-wide font-['Roboto_Condensed']">
                          Events Organized
                        </div>
                      </motion.div>
                    </BoxReveal>
                  </div>
                </div>
              </motion.div>


              <BoxReveal duration={0.7} boxColor="#3b82f6" width="100%">
                <div className="flex items-center justify-center w-full mx-auto max-w-md mt-8">
                  <SparkleButton
                    onClick={handleGetStarted}
                    className="w-full sm:w-auto font-['Roboto_Condensed'] tracking-wide text-white"
                  >
                    Get Started Free
                  </SparkleButton>
                </div>
              </BoxReveal>
            </div>
          </div>
        </WavyBackground>

        {/* Video Demo Section */}
        <section id="demo" className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
                Watch Demo
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-['Roboto_Condensed'] text-gray-900 tracking-tight">
                See Simplicollect in
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
                  {' '}Action
                </span>
              </h2>
              <p className="text-xl text-gray-600 font-['Roboto_Condensed'] max-w-2xl mx-auto">
                Watch how organizations use Simplicollect to streamline their operations and boost efficiency
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
              <motion.div
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                <GlassCard className="relative p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-4xl transform transition-transform duration-300 group-hover:scale-110">⚡</div>
                    <h3 className="text-xl font-bold text-gray-900 font-['Roboto_Condensed']">Quick Setup</h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transform origin-left transition-all duration-300 group-hover:w-24" />
                    <p className="text-gray-600 font-['Roboto_Condensed']">
                      Get started in minutes with our intuitive onboarding process
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                <GlassCard className="relative p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-4xl transform transition-transform duration-300 group-hover:scale-110">🎯</div>
                    <h3 className="text-xl font-bold text-gray-900 font-['Roboto_Condensed']">Easy to Use</h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform origin-left transition-all duration-300 group-hover:w-24" />
                    <p className="text-gray-600 font-['Roboto_Condensed']">
                      Designed for simplicity while maintaining powerful functionality
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                whileHover={{ y: -8 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl" />
                <GlassCard className="relative p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="text-4xl transform transition-transform duration-300 group-hover:scale-110">🚀</div>
                    <h3 className="text-xl font-bold text-gray-900 font-['Roboto_Condensed']">Scale Fast</h3>
                    <div className="h-0.5 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transform origin-left transition-all duration-300 group-hover:w-24" />
                    <p className="text-gray-600 font-['Roboto_Condensed']">
                      Grows with your organization, from dozens to thousands of members
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen flex items-center justify-center relative overflow-hidden z-10">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/30" />
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
                  {' '}Succeed
                </span>
              </h2>
              <p className="text-xl text-gray-600 font-['Roboto_Condensed'] max-w-2xl mx-auto">
                Comprehensive tools designed to streamline your organization's operations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
              {/* Analytics Feature */}
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
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">Smart Analytics</h3>
                    <p className="text-gray-600">Real-time insights into member engagement and financial performance with advanced visualization tools.</p>
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
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <CreditCard className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Payment Processing</h3>
                    <p className="text-gray-600">Secure and efficient payment collection with multiple gateway support and automated reconciliation.</p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 w-0 group-hover:w-full transition-all duration-300" />
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
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Member Management</h3>
                    <p className="text-gray-600">Comprehensive tools for managing member profiles, roles, and engagement tracking.</p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-600 w-0 group-hover:w-full transition-all duration-300" />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Event Management Feature */}
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
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Calendar className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Event Management</h3>
                    <p className="text-gray-600">Streamlined event planning and coordination with automated scheduling and RSVPs.</p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 w-0 group-hover:w-full transition-all duration-300" />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Communication Feature */}
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
                      className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <MessageSquare className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">Communication Hub</h3>
                    <p className="text-gray-600">Integrated messaging and notification system for seamless team coordination.</p>
                    <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-rose-600 w-0 group-hover:w-full transition-all duration-300" />
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
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Enterprise Security</h3>
                    <p className="text-gray-600">Bank-grade security with advanced encryption and compliance built into every feature.</p>
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
        <section id="testimonials" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-sky-50/50 to-white z-10">
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
                See what our users have to say about their experience with Simplicollect
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
                      {new Date(testimonial.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                        <a href="#" className="hover:underline hover:text-sky-500">
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
        <section id="stats" className="relative min-h-screen flex flex-col justify-center overflow-hidden z-10">
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

          <div className="flex-1 flex flex-col justify-center space-y-6">
            <VelocityScroll
              defaultVelocity={2}
              className="py-8 bg-gradient-to-r from-indigo-600/90 to-cyan-600/90 backdrop-blur-sm text-white/90"
            >
              Streamline Operations • Boost Efficiency • Enhance Member Experience • Drive Growth • Maximize Revenue
            </VelocityScroll>

            <VelocityScroll
              defaultVelocity={-2}
              className="py-8 bg-gradient-to-r from-violet-600/90 to-indigo-600/90 backdrop-blur-sm text-white/90"
            >
              Smart Automation • Real-time Insights • Seamless Integration • Secure Platform • 24/7 Support
            </VelocityScroll>

            <VelocityScroll
              defaultVelocity={2}
              className="py-8 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-sm text-white/90"
            >
              Trusted by Industry Leaders • Global Reach • Enterprise Ready • Scalable Solution • Future Proof
            </VelocityScroll>
          </div>
        </section>


        {/* Spinning Text Section */}
        <section id="about" className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 via-white to-sky-50/30" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Spinning Text */}
              <div className="relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
                
                <div className="relative flex flex-col items-center lg:items-start">
                 
                    <div className="w-64 h-64 flex items-center justify-center">
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
              <div className="space-y-8">
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
                      With Simplicollect, organizations are experiencing unprecedented growth and efficiency. Our platform has become the backbone of successful operations for over 500 organizations globally, managing millions of members and transactions.
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
                      From streamlining member management to automating fee collections, we're helping organizations focus on what matters most - their mission and impact.
                    </p>
                    <div className="flex items-center gap-4">
                      <SparkleButton
                        onClick={handleGetStarted}
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
        <footer className="relative bg-gradient-to-b from-sky-50 to-white py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-grid-slate-200/20 backdrop-blur-sm" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              <div className="max-w-xl lg:max-w-lg space-y-8">
                <BoxReveal duration={0.7} boxColor="#4f46e5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Logo className="h-12 w-auto" />
                    </div>
                    <p className="text-xl text-gray-600 max-w-md">
                      Join thousands of organizations revolutionizing their management with Simplicollect.
                    </p>
                  </div>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#06b6d4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Subscribe to our newsletter</h3>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="flex-1 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                      <SparkleButton className="text-white">
                        Subscribe
                      </SparkleButton>
                    </div>
                  </div>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#3b82f6">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">Follow us</h3>
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
                <BoxReveal duration={0.7} boxColor="#4f46e5">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Product</h3>
                    <ul className="space-y-3">
                      {footerLinks.product.map((link, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ x: 2 }}
                          className="relative group"
                        >
                          <a href={link.href} className="relative text-gray-600 hover:text-sky-600 transition-colors">
                            {link.name}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#06b6d4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Company</h3>
                    <ul className="space-y-3">
                      {footerLinks.company.map((link, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ x: 2 }}
                          className="relative group"
                        >
                          <a href={link.href} className="relative text-gray-600 hover:text-sky-600 transition-colors">
                            {link.name}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </BoxReveal>

                <BoxReveal duration={0.7} boxColor="#3b82f6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Legal</h3>
                    <ul className="space-y-3">
                      {footerLinks.legal.map((link, idx) => (
                        <motion.li
                          key={idx}
                          whileHover={{ x: 2 }}
                          className="relative group"
                        >
                          <a href={link.href} className="relative text-gray-600 hover:text-sky-600 transition-colors">
                            {link.name}
                          </a>
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
                  <p className="text-sm leading-5 text-gray-500">
                    © {new Date().getFullYear()} Simplicollect. All rights reserved.
                  </p>
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
