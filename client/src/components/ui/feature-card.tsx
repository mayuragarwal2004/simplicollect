import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  demo: React.ReactNode;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  demo,
  className 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 hover:border-gray-300 hover:shadow-lg transition-all",
        className
      )}
    >
      <div className="mb-8 flex h-[200px] items-center justify-center overflow-hidden rounded-lg bg-gray-50">
        {demo}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}; 