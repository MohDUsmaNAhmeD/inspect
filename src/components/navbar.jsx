import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Car } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sectionParam = params.get('section');
    
    if (location.pathname === '/') {
      setActiveSection(sectionParam || 'home');
      const handleScroll = () => {
        const sections = ['home', 'about', 'plans', 'testimonials', 'Why Us', 'contact'];
        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (path) => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      const section = document.getElementById(path.toLowerCase());
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(path.toLowerCase());
      }
    } else {
      navigate(`/?section=${path.toLowerCase()}`);
    }
  };

  const isActive = (path) => {
    if (path === '/cart') {
      return location.pathname.startsWith('/cart');
    }
    return path.toLowerCase() === activeSection;
  };

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'About Us', path: 'about' },
    { name: 'Plans', path: 'plans' },
    { name: 'Testimonials', path: 'testimonials' },
    { name: 'Why Us', path: 'whyus' },
    { name: 'Contact Us', path: 'contact' }
  ];

  return (
    <header className="bg-black text-white px-4 py-4 fixed top-0 w-[100vw] z-50 shadow-lg font-[Inter]">
      <div className="flex items-center justify-between max-w-7xl mx-auto relative">
        {/* Logo */}
        <Link to="/" className="flex items-center z-20 group" onClick={() => setActiveSection('home')}>
          <Car 
            className="w-8 h-8 md:w-10 md:h-10 text-white transform group-hover:scale-110 transition-transform duration-300 mr-3"
            strokeWidth={1.5}
          />
          <div className="font-extrabold text-2xl md:text-4xl tracking-tight text-red-500 font-['Montserrat']">
            LuxuryCars
          </div>
        </Link>
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden z-20">
          <button 
            onClick={toggleMenu} 
            className="focus:outline-none text-red-500 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={28} className="animate-spin" />
            ) : (
              <Menu size={28} className="hover:scale-110 transition-transform" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className={`${
            isMenuOpen ? 'flex' : 'hidden'
          } md:flex md:items-center absolute md:relative top-full md:top-auto left-0 md:left-auto right-0 md:right-auto bg-black md:bg-transparent mt-4 md:mt-0 p-4 md:p-0 flex-col md:flex-row shadow-lg md:shadow-none transition-all duration-300`}>
          <div className="flex flex-col md:flex-row gap-5 md:gap-10 items-center w-full md:w-auto">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`
                  relative py-2 px-3 rounded-md w-full md:w-auto text-center font-medium transition-all duration-300 ${
                    isActive(link.path) 
                      ? 'text-red-500 font-semibold' 
                      : 'text-gray-300 hover:text-white'
                  } group
                `}>
                {link.name}
                <span className={`
                  absolute bottom-0 left-0 w-full h-0.5 
                  transform origin-left transition-transform duration-300 ${
                    isActive(link.path) 
                      ? 'bg-red-500 scale-x-100' 
                      : 'bg-white scale-x-0 group-hover:scale-x-100'
                  }
                `}/>
              </button>
            ))}
            {/* Cart Link */}
            <Link 
              to="/cart" 
              className={`
                relative text-gray-300 hover:text-white transition-colors focus:outline-none p-2 rounded-full ${
                  isActive('/cart') ? 'text-red-500' : ''
                }
              `} 
              aria-label="Shopping cart"
            >
              <ShoppingCart 
                size={24} 
                className="hover:scale-110 transition-transform"
              />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};


export default Header;