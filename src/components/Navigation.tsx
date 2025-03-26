
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        isScrolled 
          ? 'bg-white/70 dark:bg-mirakiBlue-900/70 backdrop-blur-md py-4 shadow-md' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-fluid flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="font-display text-2xl md:text-3xl font-semibold text-mirakiBlue-900 dark:text-white transition-colors duration-300"
        >
          Miraki
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-mirakiBlue-700 dark:text-mirakiGray-300 hover:text-mirakiBlue-900 dark:hover:text-white transition-colors duration-300">
            Home
          </Link>
          <Link to="/#explore" className="text-mirakiBlue-700 dark:text-mirakiGray-300 hover:text-mirakiBlue-900 dark:hover:text-white transition-colors duration-300">
            Explore
          </Link>
          <Link to="/artists" className="text-mirakiBlue-700 dark:text-mirakiGray-300 hover:text-mirakiBlue-900 dark:hover:text-white transition-colors duration-300">
            Artists
          </Link>
          <button className="text-mirakiBlue-700 dark:text-mirakiGray-300 hover:text-mirakiBlue-900 dark:hover:text-white transition-colors duration-300 flex items-center">
            <Search size={18} className="mr-1" />
            <span>Search</span>
          </button>
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden space-x-4">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-mirakiBlue-900 dark:text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-mirakiBlue-900 shadow-lg animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-mirakiBlue-900 dark:text-white py-2 text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/#explore" 
              className="text-mirakiBlue-900 dark:text-white py-2 text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/artists" 
              className="text-mirakiBlue-900 dark:text-white py-2 text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Artists
            </Link>
            <button 
              className="text-mirakiBlue-900 dark:text-white py-2 text-lg flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={18} className="mr-2" />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
