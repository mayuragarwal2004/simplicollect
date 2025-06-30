import { BentoGrid, BentoCard } from './bento-grid';
import { motion } from 'framer-motion';
import {
  LightningBoltIcon,
  LockClosedIcon,
  BarChartIcon,
  CalendarIcon,
  DashboardIcon,
  PersonIcon,
} from '@radix-ui/react-icons';

const features = [
  {
    name: 'Smart Fee Collection',
    description: 'Automated payment processing with intelligent reminders and multi-channel collection strategies.',
    Icon: DashboardIcon,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 opacity-50" />
    ),
    href: '#learn-more',
    cta: 'Learn More',
    className: 'md:col-span-2'
  },
  {
    name: 'Real-Time Member Sync',
    description: 'Live member management with instant updates, role-based permissions, and engagement tracking.',
    Icon: PersonIcon,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-50 opacity-50" />
    ),
    href: '#learn-more',
    cta: 'Learn More',
    className: 'md:col-span-1'
  },
  {
    name: 'Event Automation Engine',
    description: 'Streamlined event planning with automated scheduling, RSVPs, and seamless coordination.',
    Icon: CalendarIcon,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-violet-50 opacity-50" />
    ),
    href: '#learn-more',
    cta: 'Learn More',
    className: 'md:col-span-1'
  },
  {
    name: 'Security & Compliance',
    description: 'Bank-grade encryption with comprehensive audit trails and regulatory compliance built-in.',
    Icon: LockClosedIcon,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-rose-50 opacity-50" />
    ),
    href: '#learn-more',
    cta: 'Learn More',
    className: 'md:col-span-1'
  },
  {
    name: 'Advanced Analytics',
    description: 'Deep insights into member engagement, financial trends, and organizational performance.',
    Icon: BarChartIcon,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-yellow-50 opacity-50" />
    ),
    href: '#learn-more',
    cta: 'Learn More',
    className: 'md:col-span-1'
  },
  {
    name: 'Lightning Performance',
    description: 'Optimized for speed with real-time synchronization and instant data processing.',
    Icon: LightningBoltIcon,
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-blue-50 opacity-50" />
    ),
    href: '#learn-more',
    cta: 'Learn More',
    className: 'md:col-span-1'
  }
];

export function FeatureGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <BentoGrid className="auto-rows-[20rem] md:auto-rows-[25rem]">
        {features.map((feature, i) => (
          <BentoCard
            key={i}
            {...feature}
          />
        ))}
      </BentoGrid>
    </motion.div>
  );
} 