import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { shuffle } from "lodash";

const testimonials = [
  {
    content: "I appreciated the clear and honest feedback on my vehicle's condition.",
    author: "Kim Dae-hyun",
    role: "Office Worker",
    age: "28"
  },
  {
    content: "Efficient and professional. The staff was well-trained and provided good insights.",
    author: "Han Na-rae",
    role: "Office Worker",
    age: "40"
  },
  {
    content: "They explained the inspection details clearly. I feel more confident about my car now.",
    author: "Sarah Chen",
    role: "Team Lead",
    age: "31"
  },
  {
    content: "The inspection was helpful in identifying some minor issues. Overall a good experience.",
    author: "Mike Johnson",
    role: "Event Planner",
    age: "29"
  },
  {
    content: "Very professional service. I recommend this to anyone needing a car check-up.",
    author: "Emma Williams",
    role: "New Parent",
    age: "27"
  },
  {
    content: "The team provided reliable inspection results. I'm very satisfied with the service.",
    author: "Raj Patel",
    role: "Cultural Consultant",
    age: "35"
  }
];

const TestimonialCard = ({ testimonial }) => (
  <Card className="bg-zinc-900 border-zinc-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
    <CardContent className="p-8">
      <div className="mb-6">
        <span className="text-red-500 text-4xl font-serif">"</span>
      </div>
      <p className="text-zinc-300 text-lg leading-relaxed mb-8 group-hover:text-white transition-colors duration-300">
        {testimonial.content}
      </p>
      <div className="border-t border-zinc-800 pt-6">
        <p className="font-semibold text-zinc-200">{testimonial.author}</p>
        <p className="text-sm text-zinc-500">{testimonial.age} • {testimonial.role}</p>
      </div>
    </CardContent>
  </Card>
);

const MobileSlider = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    if (touchStart - touchEnd > swipeThreshold) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
    if (touchEnd - touchStart > swipeThreshold) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {testimonials.map((testimonial, index) => (
          <div key={index} className="min-w-full px-6">
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-red-600" : "w-4 bg-zinc-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

function Step({ number, title, description, image }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <img
        src={image}
        alt={title}
        className="w-full h-40 object-contain rounded-lg"
      />
      <div className="text-red-500 text-2xl font-bold">Step {number}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-zinc-300">{description}</p>
    </div>
  );
}


const TestimonialSection = () => {
  const [displayedTestimonials, setDisplayedTestimonials] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDisplayedTestimonials(shuffle([...testimonials]));
  }, []);

  if (!isClient) return null;

  return (
    <div className="bg-gradient-to-b from-black to-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            What Our Customers Are Saying
          </h2>
          <p className="text-xl text-zinc-400">
            Real experiences from people who trust our service
          </p>
        </div>

        <div className="md:hidden mb-20">
          <MobileSlider testimonials={displayedTestimonials} />
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {displayedTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} />
          ))}
        </div>

        <div className="max-w-lg mx-auto text-center mb-24">
          <div className="bg-red-950/30 backdrop-blur-sm rounded-2xl p-10 border border-red-800/30">
            <h3 className="text-3xl font-bold text-white mb-4">Share Your Story</h3>
            <p className="text-zinc-300 mb-8">
              Join our community and help others make informed decisions
            </p>
            <button className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-1">
              Share Your Experience
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
  <h2 className="text-3xl font-bold text-center text-white mb-12">
    How It Works
  </h2>
  <div className=" p-6">
    <div className="grid md:grid-cols-2 gap-6">
      <Step 
        number="1"
        title="Enter Vehicle Details"
        description="Provide your VIN or license plate for a thorough analysis of your vehicle's history."
        image="https://i.ibb.co/Bzjrb2w/c82c0c6a-0d9d-4fa6-870e-7059438b2ce6-768x179-removebg-preview-2.png"
      />
      <Step
        number="2"
        title="Get Your Report"
        description="Receive a comprehensive report detailing your vehicle's complete history."
        image="https://i.ibb.co/wWrfyjJ/image-removebg-preview-4.png"
      />
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default TestimonialSection;