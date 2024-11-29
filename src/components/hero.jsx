import React, { useState, useEffect, memo, lazy, Suspense } from 'react';
import { ArrowRightCircle, ChevronDown, Search, Info, CheckCircle2, XCircle, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { vinValidation } from './ui/VinValidator';

// Memoized components for better performance
const ScrollIndicator = memo(({ onClick }) => (
  <div 
    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer opacity-0 animate-fade-in"
    onClick={onClick}
  >
    <div className="w-6 h-10 border-2 border-white/50 rounded-full relative flex justify-center mb-2 animate-bounce">
      <div className="w-1 h-2 bg-white rounded-full absolute top-2 animate-scroll" />
    </div>
    <ChevronDown className="w-5 h-5 text-white/70" />
  </div>
));

const ValidationIcon = memo(({ isValid, hasValue }) => {
  if (!hasValue) return null;
  return isValid ? 
    <CheckCircle2 className="w-5 h-5 text-green-500" /> : 
    <XCircle className="w-5 h-5 text-red-500" />;
});

const ErrorMessage = memo(({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-500 text-sm mt-1 animate-slide-up">
      {message}
    </p>
  );
});

// Lazy loaded image component
const LazyImage = lazy(() => Promise.resolve({
  default: ({ src, alt, className }) => (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      loading="lazy"
    />
  )
}));

const VinInfoPopup = memo(({ type, onClose }) => {
  const content = type === 'location' ? {
    title: 'VIN Location Guide',
    subtitle: 'Common places to find your Vehicle Identification Number',
    details: [
      { title: 'Dashboard', description: 'Look through the windshield at the driver\'s side dashboard.', icon: '🚗' },
      { title: 'Driver\'s Door', description: 'Check the driver\'s side door jamb or door post.', icon: '🚪' },
      { title: 'Engine Block', description: 'Examine the front of the engine block.', icon: '⚙️' },
      { title: 'Frame Rail', description: 'Look at the frame rail near the windshield washer fluid container.', icon: '🔧' }
    ]
  } : {
    title: 'VIN Structure Guide',
    subtitle: 'Understanding your 17-character Vehicle Identification Number',
    details: [
      { title: 'Positions 1-3 (WMI)', description: 'World Manufacturer Identifier - Indicates the vehicle manufacturer', icon: '🏢' },
      { title: 'Positions 4-8', description: 'Vehicle Description Section (VDS) - Describes vehicle attributes', icon: '📝' },
      { title: 'Position 9', description: 'Check Digit - Used to detect invalid VINs', icon: '✓' },
      { title: 'Positions 10-17', description: 'Vehicle Identifier Section (VIS) - Contains unique vehicle info', icon: '🔍' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
         onClick={onClose}>
      <div 
        className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl animate-slide-up border border-gray-700/50"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with gradient overlay */}
        <div className="relative p-8 pb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-700/10" />
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-3xl font-bold text-white mb-2 relative">{content.title}</h2>
          <p className="text-gray-400 relative">{content.subtitle}</p>
        </div>

        {/* Content with glass effect */}
        <div className="p-8 pt-4 bg-white/5">
          <div className="grid gap-6">
            {content.details.map((item, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-gray-700/30 hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/3 group-hover:to-red-500/5 rounded-xl transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer with helpful tip */}
        <div className="p-6 bg-gray-900/50 border-t border-gray-800">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Click anywhere outside to close this window</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
});

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const [vin, setVin] = useState('');
  const [vinError, setVinError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScroll, setShowScroll] = useState(true);
  const [isVinValid, setIsVinValid] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showVinInfo, setShowVinInfo] = useState(null);

  useEffect(() => {
    // Optimized scroll handler with debounce
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      
      timeoutId = window.requestAnimationFrame(() => {
        setShowScroll(window.scrollY <= 100);
        setHasScrolled(window.scrollY > 0);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
    };
  }, []);

  // Optimized Chatra initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.ChatraID) {
      window.ChatraID = 'jy2JDPvzX4ApjnAY2';
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = 'https://call.chatra.io/chatra.js';
      document.head.appendChild(script);
    }
  }, []);

  const handleVinChange = (e) => {
    const formattedVin = vinValidation.formatVin(e.target.value);
    setVin(formattedVin);
    setVinError('');
    
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
    plansSection?.scrollIntoView({ behavior: 'smooth' });
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
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const plansSection = document.getElementById('plans');
      plansSection?.scrollIntoView({ behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Optimized background with CSS-based parallax */}
      <div 
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ${
          hasScrolled ? 'scale-105' : 'scale-100'
        }`}
        style={{
          backgroundImage: `url('https://i.ibb.co/xgYcZpt/freepik-export-20241102153720-XRIF.png')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-black/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {showVinInfo && (
          <VinInfoPopup
            type={showVinInfo}
            onClose={() => setShowVinInfo(null)}
          />
        )}
        <div className="flex flex-col lg:flex-row min-h-screen items-center gap-8 lg:gap-12 animate-fade-in">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 pt-20 lg:pt-0">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg mt-20">
                <span className="text-white text-sm font-semibold tracking-wider">
                  PROFESSIONAL CAR INSPECTION
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">Comprehensive</span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                  Vehicle Care
                </span>
              </h1>

              <p className="text-lg text-gray-300 max-w-xl">
                Delivering expert maintenance and repair services to ensure your vehicle operates at its best.
              </p>

              <Card className="bg-gray-900/50 backdrop-blur-lg border-gray-800">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                          className={`w-full bg-gray-800/30 border text-white px-4 py-3 rounded-lg focus:outline-none transition-colors pr-10 ${
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
                          <ValidationIcon isValid={isVinValid} hasValue={vin.length > 0} />
                        </div>
                      </div>
                      <ErrorMessage message={vinError} />
                    </div>

                    <div>
                      <label htmlFor="email" className="text-gray-300 text-sm font-medium block mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-800/30 border border-gray-700/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !isVinValid}
                      className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
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
                        <React.Fragment>
                          Get Vehicle Report
                          <ArrowRightCircle className="w-5 h-5" />
                        </React.Fragment>
                      )}
                    </button>

                    {error && (
                      <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/60 animate-slide-up">
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-start gap-4 text-sm text-gray-400 border-t border-gray-800 pt-4">
                      <button
                        onClick={() => setShowVinInfo('location')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <Info className="w-4 h-4" />
                        Find VIN Location
                      </button>
                      <span className="text-gray-500">|</span>
                      <button
                        onClick={() => setShowVinInfo('structure')}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                      >
                        <Info className="w-4 h-4" />
                        VIN Structure Guide
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content - Car Image */}
          <div className="w-full lg:w-1/2 hidden lg:block">
            <Suspense fallback={<div className="w-full h-full bg-gray-800/20 animate-pulse rounded-lg" />}>
              <LazyImage
                src="https://mycarrepairdubai.com/wp-content/uploads/2022/08/Car-Repair-Service-2.png"
                alt="Car Inspection Professional Service"
                className="w-full h-auto mt-[16vh] ml-20"
              />
            </Suspense>
          </div>
        </div>
      </div>

      {showScroll && <ScrollIndicator onClick={scrollToContent} />}

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(8px); opacity: 1; }
          100% { transform: translateY(16px); opacity: 0; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default memo(HeroSection);