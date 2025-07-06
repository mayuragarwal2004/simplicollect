import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Tag,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import contactService, { ContactQueryData } from '../../services/contact/contactService';
import CATEGORIES from './categories';
interface ContactFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  category: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSuccess,
  onError,
  className = '',
  showTitle = true,
  compact = false
}) => {
  const { isAuthenticated } = useAuth();
  const { memberData } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const [formData, setFormData] = useState<FormData>({
    name: isAuthenticated ? `${memberData?.firstName || ''} ${memberData?.lastName || ''}`.trim() : '',
    email: isAuthenticated ? memberData?.email || '' : '',
    phoneNumber: isAuthenticated ? memberData?.phoneNumber || '' : '',
    subject: '',
    message: '',
    category: 'general'
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const queryData: ContactQueryData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber?.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        category: formData.category,
        source: 'web'
      };

      const result = await contactService.submitContactQuery(queryData);

      setIsSubmitted(true);
      setReferenceId(result.referenceId);
      
      // Reset form
      setFormData({
        name: isAuthenticated ? `${memberData?.firstName || ''} ${memberData?.lastName || ''}`.trim() : '',
        email: isAuthenticated ? memberData?.email || '' : '',
        phoneNumber: isAuthenticated ? memberData?.phoneNumber || '' : '',
        subject: '',
        message: '',
        category: 'general'
      });

      onSuccess?.(result);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to submit your query. Please try again.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`bg-white rounded-xl shadow-xl p-8 ${className}`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You!
          </h3>
          
          <p className="text-gray-600 mb-4">
            Your query has been submitted successfully. We'll get back to you soon.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Reference ID:</strong> {referenceId}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Please save this reference ID for future correspondence.
            </p>
          </div>
          
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="mr-3"
          >
            Submit Another Query
          </Button>
          
          {isAuthenticated && (
            <Button
              onClick={() => window.location.href = '/dashboard/my-queries'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View My Queries
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-xl ${compact ? 'p-6' : 'p-8'} ${className}`}
    >
      {showTitle && (
        <div className="mb-6 text-center">
          <h2 className={`font-bold text-gray-900 ${compact ? 'text-xl' : 'text-2xl'} mb-2`}>
            Contact Us
          </h2>
          <p className="text-gray-600">
            Have a question or need help? We're here to assist you.
          </p>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {/* Name Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={compact ? 'col-span-1' : 'md:col-span-1'}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Full Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              className={`transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={compact ? 'col-span-1' : 'md:col-span-1'}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={`transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </motion.div>
        </div>

        <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {/* Phone Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={compact ? 'col-span-1' : 'md:col-span-1'}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              Phone Number
            </label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Enter your phone number"
              className="transition-all duration-200 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </motion.div>

          {/* Category Field */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={compact ? 'col-span-1' : 'md:col-span-1'}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline w-4 h-4 mr-2" />
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        {/* Subject Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="inline w-4 h-4 mr-2" />
            Subject *
          </label>
          <Input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Brief description of your query"
            className={`transition-all duration-200 ${errors.subject ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </motion.div>

        {/* Message Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <Textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Please provide details about your query..."
            rows={compact ? 4 : 6}
            className={`transition-all duration-200 resize-none ${errors.message ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.message.length}/1000 characters
          </p>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`${compact ? 'w-full' : 'w-auto min-w-[200px]'} bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </motion.div>
      </form>

      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600">
            Have an account?{' '}
            <a
              href="/auth/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </a>{' '}
            to track your queries and get faster support.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContactForm;
