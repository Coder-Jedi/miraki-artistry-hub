
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GradientHeader: React.FC = () => {
  return (
    <div className="relative">
      {/* Content Container */}
      <div className="container-fluid relative z-10 pt-16 pb-24 md:pt-20 md:pb-32">
        <div className="max-w-3xl mx-auto md:mx-0 animate-fade-in opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover Exceptional Art From Local Artists
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            Explore a curated collection of unique artworks created by talented artists in your community. Support local creativity and find your next masterpiece.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/explore" 
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
