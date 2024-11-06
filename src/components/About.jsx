import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Circle, Quote } from 'lucide-react';
import { Card } from "./ui/card";

// Enhanced decorative pattern with more contrast
const DecorativePattern = () => (
  <div className="absolute inset-0 opacity-5">
    <div className="w-full h-full" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF0000' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }} />
  </div>
);

const DecorativeShape = ({ className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    className={`absolute bg-red-600 rounded-full ${className}`}
  >
    <Circle className="w-full h-full text-red-600/20" />
  </motion.div>
);

const AboutUs = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Enhanced wave with higher z-index and opacity */}
      <div className="absolute top-0 left-0 w-full ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#FF0000"
            fillOpacity="0.9"
            d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Decorative elements with enhanced positioning */}
      <DecorativePattern />
      <DecorativeShape className="w-96 h-96 -top-48 -right-48 blur-3xl opacity-20" />
      <DecorativeShape className="w-96 h-96 top-1/2 -left-48 blur-3xl opacity-20" />
      <DecorativeShape className="w-96 h-96 bottom-0 right-0 blur-3xl opacity-20" />

      <div className="relative pt-24 pb-24 z-20">
        {/* Main Heading with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 px-4"
        >
          <h1 className="text-5xl md:text-8xl font-serif font-black mb-6 tracking-tight text-white">
            Our Story
          </h1>
          <div className="w-32 h-1 bg-red-600 mx-auto" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section with enhanced contrast */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                Transforming Vehicle History
                <span className="block text-red-600 italic mt-2">Since 2020</span>
              </h2>
              <blockquote className="border-l-4 border-red-600 pl-6 my-8">
                <Quote className="text-red-600 w-8 h-8 mb-4" />
                <p className="text-gray-300 text-xl leading-relaxed italic">
                  "Our journey began with a simple idea: to bring transparency to every vehicle purchase.
                  Today, we're proud to serve millions of customers worldwide."
                </p>
                <footer className="mt-4 text-gray-400">- James Wilson, Founder</footer>
              </blockquote>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-red-600 opacity-20" />
                <img
                  src="https://img.freepik.com/free-photo/group-people-with-laptops_23-2147993347.jpg?t=st=1730497036~exp=1730500636~hmac=f0cd45f5bfa98ae32dcd19692347e26538630c39a25bc07e16db2eb81262e434&w=826"
                  alt="Team working"
                  className="w-full h-full object-fit"
                />
              </div>
            </motion.div>
          </div>

          {/* Mission Cards with enhanced design */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {[
              {
                title: "Our Mission",
                description: "To empower vehicle buyers with comprehensive, accurate, and timely information for confident decisions."
              },
              {
                title: "Our Vision",
                description: "To be the global standard in vehicle history reporting, trusted by buyers and sellers worldwide."
              },
              {
                title: "Our Values",
                description: "Transparency, accuracy, and customer satisfaction drive everything we do."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="p-8 rounded-xl shadow-2xl hover:shadow-[0px_0px_15px_5px_rgba(255,0,0,0.8)] transition-all duration-300 h-full group hover:-translate-y-2">
                  <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-300">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Bottom Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full z-[1]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill="#ff0000"
              fillOpacity="1"
              d="M0,192L80,213.3C160,235,320,277,480,282.7C640,288,800,256,960,240C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;