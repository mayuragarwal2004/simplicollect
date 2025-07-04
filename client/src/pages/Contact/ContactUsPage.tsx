import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Users,
  Headphones,
  Globe
} from 'lucide-react';
import ContactForm from '../../components/ContactForm/ContactForm';

const ContactUsPage: React.FC = () => {
  const handleFormSuccess = (data: any) => {
    toast.success(`Your query has been submitted with reference ID: ${data.referenceId}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleFormError = (error: string) => {
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "support@simplicollect.com",
      description: "Send us an email anytime",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Phone,
      title: "Phone Support",
      details: "+91-9975570005",
      description: "Call us during business hours",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: "+91-9975570005",
      description: "Quick support via WhatsApp",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Globe,
      title: "Website",
      details: "simpliumtechnologies.com",
      description: "Visit our main website",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const supportHours = [
    { day: "Monday - Friday", time: "9:00 AM - 6:00 PM IST" },
    { day: "Saturday", time: "10:00 AM - 4:00 PM IST" },
    { day: "Sunday", time: "Closed" }
  ];

  const faqItems = [
    {
      question: "How quickly will I receive a response?",
      answer: "We typically respond to all queries within 24-48 hours during business days. Urgent technical issues are prioritized and may receive faster responses."
    },
    {
      question: "Can I track my support request?",
      answer: "Yes! If you're logged in, you can track all your support requests from your dashboard. You'll also receive a reference ID via email for each query."
    },
    {
      question: "What information should I include in my message?",
      answer: "Please provide as much detail as possible about your issue, including error messages, screenshots if applicable, and steps to reproduce any problems."
    },
    {
      question: "Do you offer phone support?",
      answer: "Phone support is available during business hours for urgent technical issues and existing customers. For general inquiries, email or this contact form is preferred."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Our Team
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              We're here to help you succeed with SimpliCollect. Get in touch with our support team
              for any questions, technical issues, or feedback.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ContactForm
              onSuccess={handleFormSuccess}
              onError={handleFormError}
              showTitle={false}
              className="h-fit"
            />
          </motion.div>

          {/* Contact Information Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Methods */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Headphones className="w-5 h-5 mr-2 text-blue-600" />
                Get in Touch
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-lg ${info.color} mr-3 flex-shrink-0`}>
                      <info.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{info.title}</h4>
                      <p className="text-gray-700 font-medium">{info.details}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Support Hours
              </h3>
              <div className="space-y-3">
                {supportHours.map((schedule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-700 font-medium">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Our Commitment
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Average Response Time</span>
                  <span className="font-bold">24 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Customer Satisfaction</span>
                  <span className="font-bold">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Support Languages</span>
                  <span className="font-bold">English, Hindi</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our support process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Still need help?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Our support team is always ready to assist you. Don't hesitate to reach out
              for any questions or concerns about SimpliCollect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@simplicollect.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </a>
              <a
                href="https://wa.me/919975570005"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Support
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactUsPage;
