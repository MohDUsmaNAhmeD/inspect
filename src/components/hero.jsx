import React, { useState, useEffect } from 'react';
import { ArrowRightCircle, ChevronDown, Search, Info, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { vinValidation } from './ui/VinValidator';

export default function HeroSection() {
  const [email, setEmail] = useState('');
  const [vin, setVin] = useState('');
  const [vinError, setVinError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScroll, setShowScroll] = useState(true);
  const [isVinValid, setIsVinValid] = useState(false);

  // Scroll animation setup
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Initialize Chatra
    window.ChatraID = 'jy2JDPvzX4ApjnAY2';
    window.Chatra = window.Chatra || function() {
      (window.Chatra.q = window.Chatra.q || []).push(arguments);
    };

    // Create and load the Chatra script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://call.chatra.io/chatra.js';
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the script tag
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Cleanup Chatra
      delete window.ChatraID;
      delete window.Chatra;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY <= 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rest of the component code remains the same...
  const handleVinChange = (e) => {
    const formattedVin = vinValidation.formatVin(e.target.value);
    setVin(formattedVin);
    
    // Clear previous errors
    setVinError('');
    
    // Validate VIN as user types
    if (formattedVin.length > 0) {
      const error = vinValidation.getVinError(formattedVin);
      setVinError(error);
      setIsVinValid(!error && formattedVin.length === 17);
    } else {
      setIsVinValid(false);
    }
  };

  const scrollToContent = () => {
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter an email address');
      return;
    }
    if (!vin) {
      setError('Please enter a VIN number');
      return;
    }
    if (!vinValidation.isValidVinFormat(vin)) {
      setError('Please enter a valid VIN number');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const plansSection = document.getElementById('plans');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsLoading(false);
  };

  // Animation variants remain the same...
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  // JSX remains exactly the same...
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Background with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://i.ibb.co/xgYcZpt/freepik-export-20241102153720-XRIF.png')`
          }}
        >
          <motion.div 
            style={{ opacity }}
            className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row min-h-screen items-center gap-8 lg:gap-12"
        >
          {/* Left Content */}
          <div className="w-full lg:w-1/2 pt-20 lg:pt-0">
            <motion.div variants={itemVariants} className="space-y-6">
              <motion.div variants={itemVariants} className="inline-block px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg mt-20">
                <span className="text-white text-sm font-semibold tracking-wider">
                  PROFESSIONAL CAR INSPECTION
                </span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Comprehensive</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                  Vehicle Care
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-gray-300 max-w-xl">
                Delivering expert maintenance and repair services to ensure your vehicle operates at its best.
              </motion.p>

              <Card className="bg-gray-900/50 backdrop-blur-lg border-gray-800">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* VIN Input */}
                    <div>
                      <label htmlFor="vin" className="text-gray-300 text-sm font-medium block mb-2 mt-2">
                        VIN Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="vin"
                          value={vin}
                          onChange={handleVinChange}
                          className={`w-full bg-gray-800/30 border text-white px-4 py-3 rounded-lg focus:outline-none transition-all pr-10 ${
                            vinError 
                              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                              : isVinValid 
                                ? 'border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20' 
                                : 'border-gray-700/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          }`}
                          placeholder="Enter VIN (17 characters)"
                          maxLength={17}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {vin && (
                            isVinValid ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )
                          )}
                        </div>
                      </div>
                      {vinError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1"
                        >
                          {vinError}
                        </motion.p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div>
                      <label htmlFor="email" className="text-gray-300 text-sm font-medium block mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || !isVinValid}
                      className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg transition-all font-medium flex items-center justify-center gap-2 ${
                        isLoading || !isVinValid 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:from-red-700 hover:to-red-800'
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          Get Vehicle Report
                          <ArrowRightCircle className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/60"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Help Links */}
                    <div className="flex flex-col sm:flex-row justify-start gap-4 text-sm text-gray-400 border-t border-gray-800 pt-4">
                      <button type="button" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                        <Search className="w-4 h-4" />
                        <span>Find VIN Location</span>
                      </button>
                      <button type="button" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                        <Info className="w-4 h-4" />
                        <span>VIN Structure Guide</span>
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Content - Car Image */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2 hidden lg:block">
            <motion.img
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              src="https://mycarrepairdubai.com/wp-content/uploads/2022/08/Car-Repair-Service-2.png"
              alt="Car Inspection Professional Service"
              className="w-full h-auto mt-[16vh] ml-20"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {showScroll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer"
            onClick={scrollToContent}
          >
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-6 h-10 border-2 border-white/50 rounded-full relative flex justify-center mb-2"
            >
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, 16, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1 h-2 bg-white rounded-full absolute top-2"
              />
            </motion.div>
            <ChevronDown className="w-5 h-5 text-white/70" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}