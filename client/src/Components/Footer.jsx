import { Link } from "react-router-dom";
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

export default function Footer() {
  return (
    <>
      {/* Mobile Footer - Connect With Us */}
      <div className="md:hidden bg-gray-900 text-white py-8 px-6">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Connect With Us
          </h3>
          <p className="text-gray-300 mb-6">
            Stay updated with our latest services and offers. Follow us on social media to get exclusive deals and home service tips!
          </p>
          <div className="flex justify-center space-x-6" style={{ marginBottom: "2rem" }} >
            <Link 
              to="#" 
              className="text-white bg-gradient-to-br from-blue-600 to-blue-800 p-3 rounded-full hover:from-blue-700 hover:to-blue-900 transition-all"
              aria-label="Facebook"
            >
              <FaFacebookF className="h-6 w-6" />
            </Link>
            <Link 
              to="#" 
              className="text-white bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all"
              aria-label="Twitter"
            >
              <FaTwitter className="h-6 w-6" />
            </Link>
            <Link 
              to="#" 
              className="text-white bg-gradient-to-br from-pink-500 to-red-500 p-3 rounded-full hover:from-pink-600 hover:to-red-600 transition-all"
              aria-label="Instagram"
            >
              <FaInstagram className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-gray-400 text-xs mt-6 flex items-center justify-center">
            <FaRegCopyright className="mr-1" />
            {new Date().getFullYear()} DAKSH Services. All rights reserved.
          </p>
        </div>
      </div>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-gray-900 text-white pt-10 pb-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                DAKSH
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Premium home services at your doorstep. Quality professionals for all your needs.
              </p>
              <div className="flex space-x-4">
                <Link 
                  to="#" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="h-5 w-5" />
                </Link>
                <Link 
                  to="#" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                  aria-label="Twitter"
                >
                  <FaTwitter className="h-5 w-5" />
                </Link>
                <Link 
                  to="#" 
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800"
                  aria-label="Instagram"
                >
                  <FaInstagram className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <FaWrench className="text-blue-400" />
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/products" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Our Services
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <FaBuilding className="text-blue-400" />
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/partner-register" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <FaHeadset className="text-blue-400" />
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-xs sm:text-sm flex items-center">
                <FaRegCopyright className="mr-1" />
                {new Date().getFullYear()} DAKSH Services. All rights reserved.
              </p>
              <div className="flex space-x-4 sm:space-x-6">
                <Link to="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                  Privacy
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
                  Terms
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors">
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