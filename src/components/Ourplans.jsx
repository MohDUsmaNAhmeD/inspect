import React, { useState } from 'react';

const EnhancedVehiclePlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cart, setCart] = useState([]);

  const plans = [
    {
      id: "car",
      title: "STANDARD",
      price: "44.99",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XNluJtjXbq8sxH0hCWs3FrJvC1I9gj.png",
      features: [
        "VIN HISTORY",
        "In-Depth Ride Specs",
        "Precise Crash Logs",
        "Valid for a month"
      ]
    },
    {
      id: "offroad",
      title: "PREMIUM",
      price: "65.32",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XNluJtjXbq8sxH0hCWs3FrJvC1I9gj.png",
      features: [
        "VIN HISTORY",
        "In-Depth Ride Specs",
        "Precise Crash Logs",
        "Online Listing History",
        "Ownership History",
        "Vehicle Fitness",
        "Never Expires"
      ]
    },
    {
      id: "motorbike",
      title: "MOTORBIKE",
      price: "39.99",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XNluJtjXbq8sxH0hCWs3FrJvC1I9gj.png",
      features: [
        "VIN HISTORY",
        "In-Depth Ride Specs",
        "Precise Crash Logs",
        "Online Listing History",
        "Ownership History",
        "Vehicle Fitness",
        "Money Owning",
        "RUC History",
        "Never Expires"
      ]
    },
    {
      id: "caravan",
      title: "CARAVAN TRAILER",
      price: "49.99",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XNluJtjXbq8sxH0hCWs3FrJvC1I9gj.png",
      features: [
        "VIN HISTORY",
        "In-Depth Ride Specs",
        "Precise Crash Logs",
        "Online Listing History",
        "Ownership History",
        "Valid for 3 months"
      ]
    }
  ];

  const relatedPlans = {
    car: [
      {
        title: "Basic Car History",
        price: "29.99",
        features: ["Basic VIN check", "Ownership history", "Accident reports"]
      },
      {
        title: "Standard Car History",
        price: "44.99",
        features: ["Full VIN history", "Detailed reports", "Service records", "Market value"]
      },
      {
        title: "Premium Car History",
        price: "69.99",
        features: ["Complete vehicle analysis", "Expert inspection", "Extended history", "Title verification"]
      }
    ],
    offroad: [
      {
        title: "Basic Off-road Check",
        price: "39.99",
        features: ["Basic terrain history", "Equipment check", "Basic maintenance records"]
      },
      {
        title: "Premium Off-road History",
        price: "65.32",
        features: ["Full vehicle history", "Modification records", "Performance analysis", "Trail ratings"]
      },
      {
        title: "Ultimate Off-road Package",
        price: "89.99",
        features: ["Complete analysis", "Expert evaluation", "Custom modifications", "Trail certification"]
      }
    ],
    motorbike: [
      {
        title: "Basic Bike Check",
        price: "24.99",
        features: ["Basic VIN check", "Ownership history", "Basic maintenance"]
      },
      {
        title: "Standard Bike History",
        price: "39.99",
        features: ["Full history report", "Performance records", "Accident history", "Market value"]
      },
      {
        title: "Premium Bike Package",
        price: "59.99",
        features: ["Complete analysis", "Race history", "Modifications", "Expert evaluation"]
      }
    ],
    caravan: [
      {
        title: "Basic Caravan Check",
        price: "34.99",
        features: ["Basic history", "Living space check", "Basic systems review"]
      },
      {
        title: "Standard Caravan History",
        price: "49.99",
        features: ["Full history report", "Systems analysis", "Maintenance records", "Market value"]
      },
      {
        title: "Premium Caravan Package",
        price: "79.99",
        features: ["Complete inspection", "Expert evaluation", "Extended warranty", "Travel certification"]
      }
    ]
  };

  const handleAddToCart = (plan) => {
    setCart([...cart, plan]);
  };

  const PlanCard = ({ plan }) => (
    <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={plan.image}
          alt={plan.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-white text-xl font-bold mb-2">{plan.title}</h2>
          <div className="text-2xl font-bold text-white">${plan.price}</div>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <ul className="space-y-2 mb-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center text-zinc-400 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></div>
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          
          <button
            onClick={() => setSelectedPlan(plan.id)}
            className="px-4 py-4 w-full rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
          >
            Search {plan.title}
          </button>
        </div>
      </div>
    </div>
  );

  const RelatedPlanCard = ({ plan }) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2">{plan.title}</h2>
          <div className="text-3xl font-bold text-white mb-4">${plan.price}</div>
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center text-zinc-400">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-3"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => handleAddToCart(plan)}
          className="w-full py-3 px-4 rounded-lg font-medium text-sm bg-red-700 text-white hover:bg-red-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
        </button>
      </div>
    </div>
  );
  
  const Header = ({ title, backButton }) => (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8 mb-12 bg-zinc-900 shadow-md">
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        {backButton && (
          <button
            onClick={() => setSelectedPlan(null)}
            className="inline-block px-6 py-3 text-white bg-red-700 rounded-full hover:bg-red-600 transition duration-150"
          >
            ← Back to all plans
          </button>
        )}
      </div>
    </div>
  );
  
  const renderMainPage = () => (
    <div className="min-h-screen bg-black">
      <Header title="Vehicle History Plans" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderRelatedPlans = () => (
    <div className="min-h-screen bg-black">
      <Header title={`${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plans`} backButton={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedPlans[selectedPlan].map((plan, index) => (
            <RelatedPlanCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </div>
  );
  

  return (
    <div className="bg-black text-white">
      {selectedPlan ? renderRelatedPlans() : renderMainPage()}
    </div>
  );
};

export default EnhancedVehiclePlans;