import { Link } from "react-router-dom";
import { useContext } from "react";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram,
  FaWrench,
  FaQuestionCircle,
  FaBuilding,
  FaHeadset,
  FaRegCopyright
} from "react-icons/fa";
import { ThemeContext } from "./Navbar";

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const bgClass = theme === 'dark' ? 'bg-black' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-white' : 'text-black';
  const subTextClass = theme === 'dark' ? 'text-white' : 'text-black';
  const borderClass = theme === 'dark' ? 'border-gray-800' : 'border-gray-200';
  const linkClass = theme === 'dark' ? 'text-white hover:text-white' : 'text-black hover:text-black';
  const iconClass = theme === 'dark' ? 'text-white' : 'text-black';

  return (
    <>
      {/* Mobile Footer - Connect With Us */}
      <div className={`md:hidden ${bgClass} ${textClass} py-8 px-6`}>
        <div className="max-w-md mx-auto text-center">
          <h3 className={`text-xl font-bold mb-4 ${textClass}`}>Connect With Us</h3>
          <p className={`${subTextClass} mb-6`}>
            Stay updated with our latest services and offers. Follow us on social media to get exclusive deals and home service tips!
          </p>
          <div className="flex justify-center space-x-6" style={{ marginBottom: "2rem" }} >
            <Link 
              to="#" 
              className={`p-3 rounded-full transition-all ${theme === 'dark' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
              aria-label="Facebook"
            >
              <FaFacebookF className={`h-6 w-6 ${iconClass}`} />
            </Link>
            <Link 
              to="#" 
              className={`p-3 rounded-full transition-all ${theme === 'dark' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
              aria-label="Twitter"
            >
              <FaTwitter className={`h-6 w-6 ${iconClass}`} />
            </Link>
            <Link 
              to="#" 
              className={`p-3 rounded-full transition-all ${theme === 'dark' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
              aria-label="Instagram"
            >
              <FaInstagram className={`h-6 w-6 ${iconClass}`} />
            </Link>
          </div>
          <p className={`${subTextClass} text-xs mt-6 flex items-center justify-center`}>
            <FaRegCopyright className={`mr-1 ${iconClass}`} />
            {new Date().getFullYear()} DAKSH Services. All rights reserved.
          </p>
        </div>
      </div>

      {/* Desktop Footer */}
      <footer className={`hidden md:block ${bgClass} ${textClass} pt-10 pb-6 px-4 sm:px-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <h3 className={`text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent ${textClass}`}>DAKSH</h3>
              <p className={`${subTextClass} text-sm sm:text-base`}>
                Premium home services at your doorstep. Quality professionals for all your needs.
              </p>
              <div className="flex space-x-4">
                <Link 
                  to="#" 
                  className={`transition-colors p-2 rounded-full ${theme === 'dark' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                  aria-label="Facebook"
                >
                  <FaFacebookF className={`h-5 w-5 ${iconClass}`} />
                </Link>
                <Link 
                  to="#" 
                  className={`transition-colors p-2 rounded-full ${theme === 'dark' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                  aria-label="Twitter"
                >
                  <FaTwitter className={`h-5 w-5 ${iconClass}`} />
                </Link>
                <Link 
                  to="#" 
                  className={`transition-colors p-2 rounded-full ${theme === 'dark' ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
                  aria-label="Instagram"
                >
                  <FaInstagram className={`h-5 w-5 ${iconClass}`} />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${textClass}`}>
                <FaWrench className={iconClass} />
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/products" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link to="/about" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${textClass}`}>
                <FaBuilding className={iconClass} />
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/partner-register" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Partners
                  </Link>
                </li>
                <li>
                  <Link to="#" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${textClass}`}>
                <FaHeadset className={iconClass} />
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className={`${linkClass} transition-colors text-sm sm:text-base`}>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`border-t ${borderClass} pt-6 mt-8`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className={`${subTextClass} text-xs sm:text-sm flex items-center`}>
                <FaRegCopyright className={`mr-1 ${iconClass}`} />
                {new Date().getFullYear()} DAKSH Services. All rights reserved.
              </p>
              <div className="flex space-x-4 sm:space-x-6">
                <Link to="#" className={`${linkClass} text-xs sm:text-sm transition-colors`}>
                  Privacy
                </Link>
                <Link to="#" className={`${linkClass} text-xs sm:text-sm transition-colors`}>
                  Terms
                </Link>
                <Link to="#" className={`${linkClass} text-xs sm:text-sm transition-colors`}>
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}