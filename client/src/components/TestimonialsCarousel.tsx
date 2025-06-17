import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from 'react-icons/bi';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  // Auto play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length, isAutoPlaying]);
  
  const handlePrev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
    );
  };
  
  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      }
    }),
  };

  return (
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-slate-900 mb-4">What Our Users Say</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Join thousands of organizations that trust SimpliCollect for their management needs.
        </p>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Glass card container */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-10 left-10 text-5xl text-blue-200/50">
            <BiSolidQuoteAltLeft />
          </div>
          <div className="absolute bottom-10 right-10 text-5xl text-blue-200/50">
            <BiSolidQuoteAltRight />
          </div>
          
          {/* Carousel */}
          <div className="relative min-h-[320px] flex items-center justify-center">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                    <img 
                      src={testimonials[currentIndex].avatar} 
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover rounded-full ring-4 ring-blue-100"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xl md:text-2xl text-slate-700 mb-6 relative z-10">
                      {testimonials[currentIndex].quote}
                    </p>
                    <h4 className="text-xl font-bold text-slate-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-slate-600">
                      {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-xl transition-all z-20"
          aria-label="Previous testimonial"
        >
          <BsArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-blue-600 hover:shadow-xl transition-all z-20"
          aria-label="Next testimonial"
        >
          <BsArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
