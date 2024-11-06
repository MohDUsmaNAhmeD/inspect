import React from 'react';
import Header from './components/navbar';
import Footer from './components/footer';
import Home from './components/hero';
import About from './components/About';
import Plans from './components/Ourplans';
import Contact from './components/Contactus';
import ClientTestimonials from './components/Testimonials';
import FeaturesSection from './components/Whyus';
import AnimatedShowcase from './components/workwith';



const MainLayout = () => (
  <>
    <Header />
    <div id="home">
      <Home />
    </div>
    <div id="about">
      <About />
    </div>
    <div id="plans">
      <Plans />
    </div>
    <div id="testimonials">
      <ClientTestimonials />
    </div>
    <div id="whyus">
      <FeaturesSection />
    </div>
    <div id="contact">
      <Contact />
    </div>
    <div id="workwith">
      <AnimatedShowcase />
    </div>
   
    <Footer />
  </>
);

export default MainLayout;
