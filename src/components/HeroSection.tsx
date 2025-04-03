
import React from 'react';
import GradientHeader from './GradientHeader';
import Hero from './Hero';
import { Artwork } from '@/types';

interface HeroSectionProps {
  featuredArtworks: Artwork[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredArtworks }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background - moved from GradientHeader */}
      <div className="absolute inset-0 bg-gradient-to-b from-mirakiBlue-700 via-mirakiBlue-800 to-background dark:from-mirakiBlue-900 dark:via-mirakiBlue-800/90 dark:to-background z-0"></div>
      
      {/* Decorative Elements - moved from GradientHeader */}
      <div className="absolute top-20 left-[15%] w-64 h-64 rounded-full bg-mirakiGold/20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-10 right-[15%] w-96 h-96 rounded-full bg-mirakiBlue-500/10 blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-mirakiGold/10 blur-3xl"></div>
      
      {/* Radial center glow effect - moved from GradientHeader */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-mirakiBlue-400/20 via-mirakiGold/10 to-mirakiBlue-400/20 blur-3xl opacity-60 animate-pulse-slow"></div>
      
      {/* Put Hero section above the GradientHeader content */}
      <div className="pt-24">
        <Hero featuredArtworks={featuredArtworks} />
      </div>
      
      {/* GradientHeader content below the Hero */}
      <GradientHeader />
    </div>
  );
};

export default HeroSection;
