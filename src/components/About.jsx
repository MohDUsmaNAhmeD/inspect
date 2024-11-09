import React, { memo, lazy, Suspense } from 'react';
import { Car, Shield, CheckCircle, Wrench, FileText } from "lucide-react";

// Memoized smaller components to prevent unnecessary re-renders
const DecorativeShape = memo(({ className }) => (
  <div className={`absolute bg-red-600 rounded-full ${className}`} />
));

const FeatureCard = memo(({ icon, title, description }) => (
  <div className="bg-black/50 border border-red-600/20 hover:border-red-600 transition-all duration-300 rounded-lg p-6">
    <div className="mb-4 text-red-600">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
));

const Button = memo(({ children, className }) => (
  <button className={`px-4 py-2 rounded text-center w-full sm:w-auto ${className}`}>
    {children}
  </button>
));

// Optimize SVG rendering
const WaveShape = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full block" aria-hidden="true">
    <path
      fill="#ff0000"
      fillOpacity="1"
      d="M0,0L48,43,192,85,288,96C384,107,480,85,576,112C672,139,768,213,864,229.3C960,245,1056,203,1152,170.7C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
    />
  </svg>
));

const BottomWave = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
    <path
      fill="#ff0000"
      fillOpacity="1"
      d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    />
  </svg>
));

// Lazy load the image component
const LazyImage = lazy(() => Promise.resolve({
  default: ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} loading="lazy" />
  )
}));
 

const AboutUs = () => {
  const features = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "150+ Point Inspection",
      description: "Comprehensive vehicle inspection covering all crucial mechanical and safety aspects."
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Expert Mechanics",
      description: "Certified professionals with years of experience in detailed vehicle inspections."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Digital Reports",
      description: "Detailed digital reports with photos and videos of every inspection point."
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <DecorativeShape className="w-64 h-64 md:w-96 md:h-96 -top-32 -right-32 md:-top-48 md:-right-48 blur-3xl opacity-20" />
      <DecorativeShape className="w-64 h-64 md:w-96 md:h-96 -bottom-32 -left-32 md:-bottom-48 md:-left-48 blur-3xl opacity-20" />
      
      <div className="absolute w-full">
        <WaveShape />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center mb-12 md:mb-24">
          <h1 className="text-2xl md:text-3xl font-semibold text-center sm:text-5xl lg:text-7xl font-serif tracking-tight  bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-800 to-black leading-tight">
            Expert Car Inspection
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 md:mb-8">
            Your Trusted Partner in Vehicle Safety and Performance
          </p>
          <div className="flex items-center justify-center gap-4">
            <Car className="text-red-600 w-6 h-6 md:w-8 md:h-8" />
            <div className="w-20 md:w-32 h-1 bg-gradient-to-r from-red-500 to-red-700" />
            <Shield className="text-red-600 w-6 h-6 md:w-8 md:h-8" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-32">
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Revolutionizing
              <span className="block text-red-600 mt-2">Vehicle Inspection</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              We've transformed the car inspection process, making it thorough,
              transparent, and trustworthy for every customer. Our
              state-of-the-art technology and expert mechanics ensure your
              vehicle's safety and performance.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-w-4 aspect-h-3">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <Suspense fallback={<div className="w-full h-full bg-gray-800 animate-pulse" />}>
              <LazyImage
                src="https://img.freepik.com/premium-photo/smiling-business-people-walking-office_1048944-13732929.jpg?w=826"
                alt="Modern car inspection"
                className="w-full h-full object-cover"
              />
            </Suspense>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-32">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8">
            Ready to Experience the Difference?
          </h2>
          <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3 md:px-8 md:py-4" onClick={() => window.location.href = '#plans'}>
            Schedule an Inspection
          </Button>
        </div>
      </div>

      <div className="w-full">
        <BottomWave />
      </div>
    </div>
  );
};

export default memo(AboutUs);