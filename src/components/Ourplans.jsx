import React, { useState } from "react";
import {
  ShoppingCart,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Car,
  Truck,
  Bike,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";

// Cart Storage utilities
const CartStorage = {
  key: "vehicle_reports_cart",
  get: () => {
    try {
      return JSON.parse(localStorage.getItem("vehicle_reports_cart")) || [];
    } catch {
      return [];
    }
  },
  set: (cart) => {
    try {
      localStorage.setItem("vehicle_reports_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  },
  addItem: (item) => {
    try {
      const cart = CartStorage.get();
      // Create a simplified version of the item for cart storage
      const cartItem = {
        id:
          item.id ||
          `${item.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        title: item.title,
        price: item.price,
        description: item.description,
        image: item.image,
        cartId: Date.now().toString(),
        quantity: 1,
      };
      const newCart = [...cart, cartItem];
      CartStorage.set(newCart);
      return true;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      return false;
    }
  },
};

const FeatureList = ({ features }) => (
  <ul className="space-y-3">
    {features.map((feature, index) => (
      <li key={index} className="flex items-center text-zinc-300">
        <CheckCircle2 className="mr-2 h-4 w-4 text-red-500 flex-shrink-0" />
        <span className="leading-tight">{feature}</span>
      </li>
    ))}
  </ul>
);

const PlanCard = ({ plan, onAction, featured }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Create a standardized plan object for the cart
    const cartPlan = {
      ...plan,
      id: plan.id || `${plan.title.toLowerCase().replace(/\s+/g, "-")}`,
    };
    onAction(cartPlan);
  };

  // Check if this is the "car" plan by comparing plan.id
  const isCarPlan = plan.id === "car-report";

  return (
    <Card
      className={`relative overflow-hidden bg-zinc-900 border-zinc-800 hover:border-red-900 transition-all duration-300 ${
        featured ? "ring-2 ring-red-500" : ""
      }`}
    >
      {featured && (
        <Badge className="absolute top-4 right-4 bg-red-500">
          Popular Choice
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          {plan.icon}
          <span className="ml-2">{plan.title}</span>
        </CardTitle>
        {plan.description && (
          <p
            className={`text-zinc-400 ${isCarPlan ? "visibility-hidden" : ""}`}
            style={{ visibility: isCarPlan ? "hidden" : "visible" }}
          >
            {plan.description}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={plan.image}
            alt={plan.title}
            className="w-full h-[200px] object-cover"
          />
        </div>
        {plan.price && (
          <div className="text-center mb-6">
            <p
              className={`text-4xl font-bold text-red-500 ${
                isCarPlan ? "visibility-hidden" : ""
              }`}
              style={{ visibility: isCarPlan ? "hidden" : "visible" }}
            >
              ${plan.price}
            </p>
            <p className="text-zinc-500 text-sm mt-1">One-time payment</p>
          </div>
        )}
        <FeatureList features={plan.features} />
      </CardContent>

      <CardFooter className="mt-8">
        <Button
          onClick={handleClick}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 "
        >
          {plan.detailedPlans ? (
            <span className="flex items-center">
              View Detailed Plans
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          ) : (
            <span className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

function VehicleHistoryReports() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const plans = {
    car: {
      id: "car-report",
      title: "Car Report",
      icon: <Car className="h-6 w-6 text-red-500" />,
      image:
        "https://th.bing.com/th/id/OIP.RqxQCi6DBCg69JbCBP4KDgHaEc?rs=1&pid=ImgDetMain",
      price: " 39.99 Lowest price",
      description: "Comprehensive vehicle history reports",
      features: [
        "Complete VIN History",
        "In-Depth Specifications",
        "Accident Reports",
        "Service History",
      ],
      detailedPlans: [
        {
          id: "car-basic",
          title: "Basic Car Report",
          price: "29.99",
          image:
            "https://th.bing.com/th/id/OIP.KLk3XwUpQFwUkU3q5y5SJAHaEK?w=333&h=187&c=7&r=0&o=5&pid=1.7",
          features: ["VIN Check", "Accident History", "Title Information"],
          description: "Essential vehicle history information",
        },
        {
          id: "car-premium",
          title: "Premium Car Report",
          price: "49.99",
          featured: true,
          image:
            "https://th.bing.com/th/id/OIP.b-i6kRKDkktyzAbRBOz2DgHaDf?w=316&h=165&c=7&r=0&o=5&pid=1.7",
          features: [
            "Standard Report Features",
            "Market Value",
            "Detailed Service Records",
          ],
          description: "Complete vehicle history and analysis",
        },
        {
          id: "car-standard",
          title: "Standard Car Report",
          price: "39.99",
          image:
            "https://th.bing.com/th/id/OIP.FMhMXWR_H7-GeSQ0icuvEAHaE8?w=251&h=180&c=7&r=0&o=5&pid=1.7",
          features: [
            "Basic Report Features",
            "Ownership History",
            "Vehicle Specifications",
          ],
          description: "Comprehensive vehicle analysis",
        },
      ],
    },
    motorcycle: {
      id: "motorcycle-report",
      title: "Motorcycle Report",
      icon: <Bike className="h-6 w-6 text-red-500" />,
      image:
        "data:image/jpeg;base64,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",
      price: "49.99",
      description: "Detailed motorcycle history check",
      features: [
        "VIN History",
        "Performance Specs",
        "Accident History",
        "Service Records",
        "Market Value Assessment",
      ],
    },
    truck: {
      id: "truck-report",
      title: "Truck Report",
      icon: <Truck className="h-6 w-6 text-red-500" />,
      image:
        "https://th.bing.com/th/id/OIP.9itZL0ICjX6_gpAndKADdwHaE8?w=266&h=180&c=7&r=0&o=5&pid=1.7",
      price: "59.99",
      description: "Commercial vehicle report",
      features: [
        "Complete VIN History",
        "Technical Specifications",
        "Accident Records",
        "Load Capacity Details",
        "Commercial Usage History",
      ],
    },
  };

  const handleAddToCart = (plan) => {
    const success = CartStorage.addItem(plan);

    if (success) {
      toast({
        title: "Added to cart",
        description: `${plan.title} has been added to your cart.`,
        duration: 3000,
      });
      navigate("/cart");
    } else {
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handlePlanAction = (plan) => {
    if (plan.detailedPlans) {
      setSelectedPlan(plan);
    } else {
      handleAddToCart(plan);
    }
  };
  function WaveShape() {
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 320"
      className="w-full block"
      aria-hidden="true"
    >
      <path
        fill="#ff0000"
        fillOpacity="1"
        d="M0,0L48,43,192,85,288,96C384,107,480,85,576,112C672,139,768,213,864,229.3C960,245,1056,203,1152,170.7C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
      />
    </svg>;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="absolute w-full">
            <WaveShape />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-red-500">
            Vehicle History Reports
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Get comprehensive vehicle history reports with detailed information
            about any car, motorcycle, or truck.
          </p>
        </div>

        {selectedPlan ? (
          <div className="mt-12">
            <Button
              variant="ghost"
              onClick={() => setSelectedPlan(null)}
              className="mb-6 text-zinc-400 hover:text-zinc-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Plans
            </Button>
            <h2 className="text-3xl font-bold mb-6">
              {selectedPlan.title} Options
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedPlan.detailedPlans.map((detailedPlan) => (
                <PlanCard
                  key={detailedPlan.id}
                  plan={detailedPlan}
                  onAction={handleAddToCart}
                  featured={detailedPlan.featured}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {Object.values(plans).map((plan) => (
              <PlanCard
                key={plan.title}
                plan={plan}
                onAction={handlePlanAction}
                featured={plan.featured}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VehicleHistoryReports;
