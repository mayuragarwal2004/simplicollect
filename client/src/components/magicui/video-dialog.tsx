import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { motion } from 'framer-motion';
import { PlayIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface VideoDialogProps {
  videoUrl: string;
  thumbnailUrl: string;
  title?: string;
  description?: string;
}

export function VideoDialog({
  videoUrl,
  thumbnailUrl,
  title = 'Watch Demo',
  description = 'See how SimpliCollect transforms organization management',
}: VideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          className="group relative cursor-pointer overflow-hidden rounded-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/40" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-transform duration-300 group-hover:scale-110"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayIcon className="h-8 w-8" />
              </motion.div>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-white/80">{description}</p>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[850px]">
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src={isOpen ? videoUrl : ''}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 