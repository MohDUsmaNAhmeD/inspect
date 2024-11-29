import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { API_BASE_URL } from "../config/api";
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
      const cartItem = {
        id: item.id || `${item.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
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
      <li
        key={index}
        className="flex items-center text-zinc-300"
      >
        <CheckCircle2 className="mr-2 h-4 w-4 text-red-500 flex-shrink-0" />
        <span className="leading-tight">{feature}</span>
      </li>
    ))}
  </ul>
);

const PlanCard = ({ plan, onAction, featured }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const cartPlan = {
      ...plan,
      id: plan.id || `${plan.title.toLowerCase().replace(/\s+/g, "-")}`,
    };

    if (plan.detailedPlans) {
      onAction(plan);
      setLoading(false);
    } else {
      const success = await onAction(cartPlan);
      if (success) {
        navigate("/cart", { state: { newItem: cartPlan } });
      } else {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`relative flex flex-col p-6 shadow-lg rounded-lg ${plan.featured ? 'border-2 border-red-500' : ''}`}>
      {plan.topSelling && (
        <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg transform rotate-12">
          Top Selling
        </div>
      )}
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
            <p className="text-zinc-400">
              {plan.description}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <div
            className="mb-4 overflow-hidden rounded-lg"
          >
            <img
              src={plan.image}
              alt={plan.title}
              className="w-full h-[200px] object-cover"
            />
          </div>
          {plan.price && !plan.detailedPlans && (
            <div
              className="text-center mb-6"
            >
              <p className="text-4xl font-bold text-red-500">
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
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </div>
            ) : (
              <span
                className="flex items-center"
              >
                {plan.detailedPlans ? (
                  <>
                    Show Detailed Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default function VehicleHistoryReports() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/prices`);
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        const data = await response.json();
        if (data.success) {
          setPrices(data.prices);
        } else {
          throw new Error('Invalid price data');
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
        toast.error('Failed to load current prices. Using default prices.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const getUpdatedPlan = (plan) => {
    if (!prices) return plan;

    // Update prices based on plan type
    if (plan.id === 'car-basic') {
      return { ...plan, price: prices.basicReport.toString() };
    } else if (plan.id === 'car-standard') {
      return { ...plan, price: prices.fullReport.toString() };
    } else if (plan.id === 'car-premium') {
      return { ...plan, price: prices.premiumReport.toString() };
    }
    return plan;
  };

  const plans = {
    car: {
      id: "car-report",
      title: "Car Report",
      icon: <Car className="h-6 w-6 text-red-500" />,
      image:
        "https://th.bing.com/th/id/OIP.RqxQCi6DBCg69JbCBP4KDgHaEc?rs=1&pid=ImgDetMain",
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
          price: prices?.basicReport?.toString() || "39.99",
          image:
            "https://img.freepik.com/free-photo/car-mechanic-with-tablet-near-car-work-clothes_1157-46144.jpg?uid=R171611137&ga=GA1.1.1933286878.1726064694&semt=ais_hybrid",
          features: ["VIN Check", "Accident History", "Title Information"],
          description: "Essential vehicle history information",
        },
        {
          id: "car-premium",
          title: "Premium Car Report",
          price: prices?.premiumReport?.toString() || "69.99",
          featured: true,
          topSelling: true,
          image:
            "https://img.freepik.com/free-photo/modern-automobile-mechanic-composition_23-2147881897.jpg?t=st=1731418999~exp=1731422599~hmac=c867f87f6fdd93bd665bd0ef562241b5130483148e630f6926d50e438dcf0574&w=826",
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
          price: prices?.fullReport?.toString() || "49.99",
          image:
            "https://img.freepik.com/premium-photo/mechanic-examining-hood-car_13339-83377.jpg?w=826",
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
        "https://img.freepik.com/premium-photo/repairman-examining-motorcycle_274689-50296.jpg?w=826",
      description: "Detailed motorcycle history check",
      price: prices?.motorcycleReport?.toString() || "34.99",
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
        "https://img.freepik.com/free-photo/man-mask-receipt-goods-coronavirus-stop-coronavirus_1157-46537.jpg?uid=R171611137&ga=GA1.1.1933286878.1726064694&semt=ais_hybrid",
      description: "Commercial vehicle report",
      price: prices?.truckReport?.toString() || "44.99",
      features: [
        "Complete VIN History",
        "Technical Specifications",
        "Accident Records",
        "Load Capacity Details",
        "Commercial Usage History",
      ],
    },
  };

  const handleAddToCart = async (plan) => {
    const updatedPlan = getUpdatedPlan(plan);
    const success = await CartStorage.addItem(updatedPlan);

    if (success) {
      toast.success(`${updatedPlan.title} has been added to your cart.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate('/cart');
      }, 1000);
      return true;
    } else {
      toast.error("Could not add item to cart. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return false;
    }
  };

  const handlePlanAction = (plan) => {
    if (plan.detailedPlans) {
      const updatedPlan = {
        ...plan,
        detailedPlans: plan.detailedPlans.map(getUpdatedPlan)
      };
      setSelectedPlan(updatedPlan);
    } else {
      handleAddToCart(plan);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-red-500">
            Vehicle History Reports
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Get comprehensive vehicle history reports with detailed information
            about any car, motorcycle, or truck.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : selectedPlan ? (
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
                  plan={getUpdatedPlan(detailedPlan)}
                  onAction={handleAddToCart}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {Object.values(plans).map((plan) => (
              <PlanCard
                key={plan.title}
                plan={getUpdatedPlan(plan)}
                onAction={plan.detailedPlans ? handlePlanAction : handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}