
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GradientHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-mirakiBlue-700 via-mirakiBlue-800 to-background dark:from-mirakiBlue-900 dark:via-mirakiBlue-800/90 dark:to-background z-0"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-[15%] w-64 h-64 rounded-full bg-mirakiGold/20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-10 right-[15%] w-96 h-96 rounded-full bg-mirakiBlue-500/10 blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-mirakiGold/10 blur-3xl"></div>
      
      {/* Radial center glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-mirakiBlue-400/20 via-mirakiGold/10 to-mirakiBlue-400/20 blur-3xl opacity-60 animate-pulse-slow"></div>
      
      {/* Content Container */}
      <div className="container-fluid relative z-10 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-3xl mx-auto md:mx-0 animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover Exceptional Art From Local Artists
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Explore a curated collection of unique artworks created by talented artists in your community. Support local creativity and find your next masterpiece.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#explore" 
              className="inline-flex items-center px-6 py-3 bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900 font-medium rounded-md transition-colors duration-300"
            >
              Explore Artworks
              <ArrowRight size={18} className="ml-2" />
            </a>
            <Link 
              to="/artists" 
              className="px-6 py-3 border border-white/40 hover:bg-white/10 text-white font-medium rounded-md transition-colors duration-300"
            >
              Meet the Artists
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientHeader;
