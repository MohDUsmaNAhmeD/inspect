import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Quote, Star, MessageCircle, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { shuffle } from "lodash";

const testimonials = [
  {
    content: "The inspection was incredibly thorough. They found issues I hadn't even noticed and provided clear solutions.",
    author: "Kim Dae-hyun",
    role: "Business Owner",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    date: "2 weeks ago",
    featured: true
  },
  {
    content: "Professional service from start to finish. The digital report was comprehensive and easy to understand.",
    author: "Sarah Chen",
    role: "Software Engineer",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    date: "1 month ago"
  },
  {
    content: "Best vehicle inspection service I've used .They are really expert and their attention to detail is remarkable.",
    author: "Mike Johnson",
    role: "Real Estate Agent",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    date: "3 weeks ago",
    featured: true
  },
  {
    content: "The team went above and beyond. They explained everything in detail and answered all my questions.",
    author: "Emma Williams",
    role: "Marketing Director",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    date: "1 week ago"
  },
  {
    content: "They helped me avoid a potentially costly purchase. Highly recommend their service!",
    author: "Raj Patel",
    role: "Tech Entrepreneur",
    rating: 3,
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    date: "2 months ago",
    featured: true
  }
];

const TestimonialCard = ({ testimonial }) => (
  <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-zinc-900/95 to-black overflow-hidden 
    group hover:shadow-[0_0_40px_rgba(239,68,68,0.15)] transition-all duration-500 ease-out
    hover:-translate-y-1 cursor-pointer">
    <CardContent className="p-8 md:p-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-red-600/0 opacity-0 
        group-hover:opacity-5 transition-opacity duration-500 ease-out" />
      
      <div className="flex flex-col md:flex-row items-start gap-8 relative">
        <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 transition-transform duration-500 
          group-hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full blur opacity-70 
            group-hover:opacity-90 transition-opacity duration-500" />
          <img
            src={testimonial.image}
            alt={testimonial.author}
            className="w-full h-full rounded-full object-cover border-4 border-red-500 relative z-10 
              group-hover:border-red-400 transition-colors duration-500"
          />
        </div>
        <div className="flex-1 relative">
          <Quote 
            size={40} 
            className="text-red-500/20 mb-4 transform transition-all duration-500 
              group-hover:scale-110 group-hover:text-red-500/30 group-hover:rotate-6" 
          />
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 transition-colors duration-500 
            group-hover:text-white">
            "{testimonial.content}"
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white text-lg md:text-xl transition-transform duration-500 
                  group-hover:translate-x-1">
                  {testimonial.author}
                </h4>
                <CheckCircle2 size={20} className="text-red-500 transition-all duration-500 
                  group-hover:scale-110 group-hover:text-red-400" />
              </div>
              <p className="text-gray-400 text-sm md:text-base mt-1 transition-colors duration-500 
                group-hover:text-gray-300">{testimonial.role}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-red-500 text-red-500 transition-all duration-500 
                      group-hover:scale-110 group-hover:rotate-[360deg] hover:text-red-400 
                      hover:fill-red-400"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 transition-colors duration-500 
                group-hover:text-gray-400">{testimonial.date}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TestimonialSection = () => {
  const [testimonialsList, setTestimonialsList] = useState(testimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTestimonialsList(shuffle([...testimonials]));
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  const startAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 8000);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonialsList.length) % testimonialsList.length);
    startAutoSlide();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsList.length);
    startAutoSlide();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleShareExperience = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (testimonialsList.length === 0) return null;

  return (
    <section className="relative bg-black py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/mechanics-repairing-car-workshop_329181-11791.jpg?t=st=1732637364~exp=1732640964~hmac=b89708339a4eabb4f367ad247d6a10ce8416712c51ae9c4f8600590ce484d346&w=826')] opacity-5 bg-fixed bg-no-repeat bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-black/50 to-black pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-6xl sm:text-7xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white via-red-500 to-white font-cursive bg-clip-text text-transparent">
              Client Stories
            </span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Join thousands of satisfied customers who trust our expertise in vehicle inspection. 
            Your safety and satisfaction are our top priorities.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonialsList.map((testimonial) => (
                <div 
                  key={testimonial.author}
                  className="w-full flex-shrink-0"
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="bg-red-500/20 hover:bg-red-500/40 text-white p-3 rounded-full transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="bg-red-500/20 hover:bg-red-500/40 text-white p-3 rounded-full transition-all duration-300 
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="text-center mt-20 relative">
          <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-transparent to-black pointer-events-none" />
          <button
            onClick={handleShareExperience}
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 
              text-white px-8 py-4 rounded-xl text-lg font-semibold overflow-hidden
              transition-all duration-300 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] 
              transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <span className="relative z-10">Share Your Experience</span>
            <MessageCircle 
              size={20} 
              className="relative z-10 transform group-hover:rotate-12 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
