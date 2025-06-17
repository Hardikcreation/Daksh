import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Sticky Bottom Navigation for Mobile (always visible on all pages)
function MobileStickyNav() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const active = (path) => location.pathname === path;
  if (!isMobile) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 flex justify-around items-center py-2 z-50">
      <Link to="/" className={`flex flex-col items-center py-1 ${active("/") ? "text-blue-600" : "text-gray-400"}`}>
        <div className={`rounded-full p-1 ${active("/") ? "bg-blue-100" : ""}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <span className="text-xs mt-1 font-medium">Home</span>
      </Link>
      <Link to="/products" className={`flex flex-col items-center py-1 ${active("/products") ? "text-blue-600" : "text-gray-400"}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span className="text-xs mt-1">Services</span>
      </Link>
      <Link to="/my-orders" className={`flex flex-col items-center py-1 ${active("/my-orders") ? "text-blue-600" : "text-gray-400"}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
        <span className="text-xs mt-1">My Orders</span>
      </Link>
      <Link to="/cart" className={`flex flex-col items-center py-1 ${active("/cart") ? "text-blue-600" : "text-gray-400"}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span className="text-xs mt-1">Cart</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center py-1 ${active("/profile") ? "text-blue-600" : "text-gray-400"}`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSalonWomen, setFilteredSalonWomen] = useState([]);
  const [filteredSpaWomen, setFilteredSpaWomen] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const categories = [
    { title: "AC & Appliance Repair", img: "/img/AC repairingg.jpg", icon: "❄️" },
    { title: "Housekeeping", img: "/img/cleaninghouse.jpg", icon: "🧹" },
    { title: "Electrician, Plumber & Carpenters", img: "/assets/electrician.jpg", icon: "🔧" },
    { title: "Water Purifier", img: "/assets/plumbering.jpg", icon: "💧" },
    { title: "Carpenter", img: "/assets/images (2).jpg", icon: "" },
    { title: "Painting", img: "/assets/room paint.jpeg", icon: "🎨" },
  ];

  const salonWomenServices = [
    { title: "Fan Repair", img: "/img/fan.jpeg" },
    { title: "Switch Board", img: "/img/switchborad.webp" },
    { title: "Inverter installing", img: "/img/inverter.jpeg" },
    // { title: "Facial & cleanup", img: "/img/facial.jpg" },
    // { title: "Manicure", img: "/img/manicure.jpg" },
    // { title: "Bleach & Detan", img: "/img/bleach.jpg" },
  ];

  const spaWomenServices = [
    { title: "Shower fixing", img: "/img/showerrr.jpeg" },
    { title: "Sink Cloging ", img: "/img/sinkkitchen.jpg" },
    { title: "Leakage fixing", img: "/img/leakagefix.jpg" },
  ];

  // Search logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories([]);
      setFilteredSalonWomen([]);
      setFilteredSpaWomen([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    // Main categories
    const catResults = categories.filter(cat =>
      cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Salon
    const salonResults = salonWomenServices.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Spa
    const spaResults = spaWomenServices.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(catResults);
    setFilteredSalonWomen(salonResults);
    setFilteredSpaWomen(spaResults);
  }, [searchTerm]);

  const featuredBanner = {
    title: "Deep clean with foam-jet AC service",
    subtitle: "AC service & repair",
    img: "/img/AC repairingg.jpg"
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white px-4 py-4 flex items-center justify-center shadow-sm">
          <h1 className="text-xl font-extrabold text-yellow-500 tracking-wide uppercase text-center w-full" style={{letterSpacing: 2}}>
            Daksh Call Karigar
          </h1>
        </div>
      )}

      {/* Desktop Hero Section */}
      {!isMobile && (
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
              Premium Home Services <br />On Demand
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Trusted professionals for all your home maintenance and repair needs
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              Explore Services
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Search Bar */}
      {isMobile && (
        <div className="px-4 py-3 bg-white">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-3">
            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for 'AC service'"
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Main Categories Grid */}
      <div className="px-4 py-6">
        {isMobile ? (
          searching ? (
            <div>
              {/* Show filtered results */}
              {filteredCategories.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Categories</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {filteredCategories.map((cat, idx) => (
                      <Link to={`/products?category=${cat.title}`} key={idx} className="group">
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="relative h-32 overflow-hidden">
                            <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
                              <span className="text-lg">{cat.icon}</span>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-medium text-gray-800 leading-tight">{cat.title}</h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {filteredSalonWomen.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Electrician</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {filteredSalonWomen.map((service, idx) => (
                      <Link to={`/products?service=${service.title}`} key={idx} className="group">
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                          <div className="relative h-24 overflow-hidden">
                            <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="p-2">
                            <h3 className="text-xs font-medium text-gray-800 text-center leading-tight">{service.title}</h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {filteredSpaWomen.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Spa for Women</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {filteredSpaWomen.map((service, idx) => (
                      <Link to={`/products?service=${service.title}`} key={idx} className="group">
                        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                          <div className="relative h-24 overflow-hidden">
                            <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="p-2">
                            <h3 className="text-xs font-medium text-gray-800 text-center leading-tight">{service.title}</h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {filteredCategories.length === 0 && filteredSalonWomen.length === 0 && filteredSpaWomen.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">No results found.</div>
              )}
            </div>
          ) : (
            // Show default grid if not searching
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, idx) => (
                <Link
                  to={`/products?category=${cat.title}`}
                  key={idx}
                  className="group"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={cat.img}
                        alt={cat.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
                        <span className="text-lg">{cat.icon}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-800 leading-tight">{cat.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          // Desktop Grid - Original layout
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Service Categories</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {categories.map((cat, idx) => (
                <Link
                  to={`/products?category=${cat.title}`}
                  key={idx}
                  className="group flex flex-col items-center"
                >
                  <div className="relative w-full aspect-square rounded-2xl bg-white p-4 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                      <h3 className="text-white font-semibold text-lg">{cat.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Featured Banner */}
      {isMobile && (
        <div className="px-4 py-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="relative h-48 overflow-hidden">
              <img
                src={featuredBanner.img}
                alt={featuredBanner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold mb-1">{featuredBanner.title}</h3>
                <p className="text-sm opacity-90">{featuredBanner.subtitle}</p>
                {/* <button href="/product" className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all">
                  Book now
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Service Sections */}
      {isMobile && (
        <>
          {/* Salon for Women */}
          <div className="px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Electrician</h2>
              <Link to="/products" className="text-blue-600 text-sm font-medium">See all</Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {salonWomenServices.map((service, idx) => (
                <Link
                  to={`/products?service=${service.title}`}
                  key={idx}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-24 overflow-hidden">
                      <img
                        src={service.img}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-gray-800 text-center leading-tight">{service.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Spa for Women */}
          <div className="px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Plumber</h2>
              <Link to="/products" className="text-blue-600 text-sm font-medium">See all</Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {spaWomenServices.map((service, idx) => (
                <Link
                  to={`/products?service=${service.title}`}
                  key={idx}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-24 overflow-hidden">
                      <img
                        src={service.img}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2">
                      <h3 className="text-xs font-medium text-gray-800 text-center leading-tight">{service.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Thoughtful Curations */}
          <div className="px-4 py-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Thoughtful curations</h2>
              <p className="text-sm text-gray-600">of our finest experiences</p>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="/img/allinoone.jpg"
                  alt="Thoughtful curations"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold mb-1">Premium experiences</h3>
                  <p className="text-sm opacity-90">Curated just for you</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Content - Keep original sections for desktop */}
      {!isMobile && (
        <>
          {/* Promo Banner */}
          <div className="bg-blue-50 py-12 mb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-1/2">
                    <img
                      src="/img/tv repairrr.jpg"
                      alt="Professional Service"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Our Services?</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Certified and background-checked professionals</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Same-day service availability</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">100% satisfaction guarantee</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">Transparent pricing with no hidden fees</span>
                      </li>
                    </ul>
                    <Link
                      to="/about"
                      className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300 self-start"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-600 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Book a Service?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust us with their home services
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg"
                >
                  Book Now
                </Link>
                <Link
                  to="/contact"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sticky Bottom Navigation for Mobile */}
      <MobileStickyNav />
    </div>
  );
}