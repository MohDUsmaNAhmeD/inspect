import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-black/10 rounded-xl p-6 flex flex-col items-center text-center">
    {/* Changed icon color to red */}
    <div className="text-red-400 mb-4">
      {icon}
    </div>
    <h3 className="text-red-500 text-xl font-bold mb-2">{title}</h3>
    <p className="text-white/70 text-sm">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>,
      title: "Sale History",
      description: "History of the sale of cars is useful to consumers, dealerships & producers alike, how the car was used & records any cases of accidents, repossessions, & theft"
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20m5-17H7l5-3 5 3z"/>
      </svg>,
      title: "Reasonable Price",
      description: "MOTOCHECKS proudly delivers the auto industry's most competitive prices, setting the standard for affordability, value, and customer satisfaction, ensuring customers get the best deals."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M7 7h10M7 12h10M7 17h10"/>
      </svg>,
      title: "Specifications",
      description: "MOTOCHECKS provides vital information, including engine type, year manufactured, model, and matching parts, ensuring customers have comprehensive details."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12H2M2 12l4-4m-4 4l4 4"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>,
      title: "Collision History",
      description: "MOTOCHECKS also furnishes the history of car accidents and major damages sustained over time, empowering buyers with crucial insights into a vehicle's past performance."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>,
      title: "Stolen Cars",
      description: "MOTOCHECKS meticulously records the history of each car, detailing its usage patterns and documenting any instances of vehicle theft, accidents, or repossession."
    },
    {
      icon: <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M12 22V12"/>
        <path d="M20 12v6M4 12v6"/>
      </svg>,
      title: "Trusted Provider",
      description: "MOTOCHECKS offers ratings sliders for car rollover, side barrier, front and rear seats, and front and side ratings, enabling users to assess various safety aspects for informed vehicle."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#1a1a1a] relative overflow-hidden">
      {/* Red gradient overlay instead of blue */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-red-500/10 transform -skew-y-6" />
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side with image and phone */}
          <div className="relative">
            <img 
              src="https://i.ibb.co/YdrkVRQ/dailyui-002-4x-removebg-preview.png" alt="dailyui-002-4x-removebg-preview" 
              className="rounded-lg w-[90vw] ml-[-60px] "
            />
            
          </div>

          {/* Right side with features */}
          <div className="space-y-5">
            <h2 className="text-3xl font-bold text-white mb-12">What makes us special</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;