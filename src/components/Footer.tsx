
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-mirakiBlue-50 dark:bg-mirakiBlue-900 border-t border-mirakiGray-200 dark:border-mirakiBlue-700">
      <div className="container-fluid py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="font-display text-2xl font-semibold text-mirakiBlue-900 dark:text-white">
              Miraki
            </Link>
            <p className="mt-4 text-mirakiBlue-700 dark:text-mirakiGray-300 max-w-md">
              Connecting local artists with art enthusiasts. Discover unique artworks and support the creative community in your area.
            </p>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-medium text-mirakiBlue-900 dark:text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-mirakiBlue-700 dark:text-mirakiGray-300 hover:text-mirakiBlue-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-mirakiBlue-700 dark:text-mirakiGray-300 hover:text-mirakiBlue-900 dark:hover:text-white transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-mirakiBlue-700 dark:text-mirakiGray-300 hover:text-mirakiBlue-900 dark:hover:text-white transition-colors">
                  Artists
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display text-lg font-medium text-mirakiBlue-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-mirakiBlue-700 dark:text-mirakiGray-300">
                info@miraki-art.com
              </li>
              <li className="text-mirakiBlue-700 dark:text-mirakiGray-300">
                +1 (555) 123-4567
              </li>
              <li className="text-mirakiBlue-700 dark:text-mirakiGray-300">
                Art District, Downtown
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-mirakiGray-200 dark:border-mirakiBlue-800 text-mirakiBlue-600 dark:text-mirakiGray-400 flex flex-col md:flex-row justify-between">
          <p>© 2025 Miraki. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-mirakiBlue-800 dark:hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/context" className="hover:text-mirakiBlue-800 dark:hover:text-white transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
