import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = 370;
  const [visibleStart, setVisibleStart] = useState(0);
  const servicesPerPage = 4;
  const gridScrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products`)
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load services. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (isHovered) return;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollBy({ left: 370, behavior: 'smooth' });
      if (
        scrollRef.current.scrollLeft + scrollRef.current.offsetWidth >=
        scrollRef.current.scrollWidth - 10
      ) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, products]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const idx = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(idx);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-2 py-4 sm:py-8 bg-transparent">
      {/* Hero Section with Background Image */}
      <div
        className="w-full rounded-lg md:rounded-xl shadow-md md:shadow-lg mb-8 md:mb-12 mt-2 md:mt-4 overflow-hidden bg-cover bg-center relative flex items-center"
        style={{
          backgroundImage: `url('/img/allinoone.jpg')`,
          backgroundSize: 'contain',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          minHeight: '220px',
          height: '35vw',
          maxHeight: '400px',
          backgroundColor: '#fdf6ee',
        }}
        aria-label="Electrician Illustration"
      >
        <div className="absolute left-0 top-0 h-full flex flex-col justify-center pl-6 sm:pl-12" style={{ maxWidth: '60%', zIndex: 2 }}>
          <div className="flex flex-col items-center justify-center mb-4" style={{ minHeight: '80px' }}>
            <span className="text-4xl sm:text-5xl font-bold text-gray-900 text-center drop-shadow-lg">Premium Home Services</span>
          </div>
          <div className="w-full border-l-4 border-blue-500 pl-6 bg-white/80 rounded-r-xl py-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Our Top Services</h2>
            <div className="flex gap-3 w-full max-w-md overflow-x-auto hide-scrollbar scroll-smooth" ref={gridScrollRef} style={{ scrollBehavior: 'smooth' }}>
              {isLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className='text-red-500'>{error}</div>
              ) : (
                <>
                  {products.slice(visibleStart, visibleStart + servicesPerPage).map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col items-center justify-center cursor-pointer bg-white rounded-lg shadow hover:shadow-md p-1 transition-all border border-gray-100 w-[72px] h-[72px] min-w-[100px] min-h-[100px] hover:bg-gray-100"
                      onClick={() => navigate(`/subservices/${product._id}`)}
                    >
                      <img
                        src={
                          Array.isArray(product.images) && product.images[0]
                            ? `${BASE_URL}/uploads/${product.images[0]}`
                            : "https://via.placeholder.com/80x80?text=Service"
                        }
                        alt={product.name}
                        className="w-23 h-13 object-cover rounded mb-1 border"
                      />
                      <span className="text-[10px] text-gray-700 text-center leading-tight font-medium truncate w-full">
                        {product.name}
                      </span>
                    </div>
                  ))}
                  {products.length > visibleStart + servicesPerPage && (
                    <button
                      className="flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow p-1 transition-all border border-blue-500 w-[72px] h-[72px] min-w-[72px] min-h-[72px] font-bold text-xl"
                      onClick={() => {
                        setVisibleStart((prev) => Math.min(prev + servicesPerPage, products.length - servicesPerPage));
                        setTimeout(() => {
                          if (gridScrollRef.current) {
                            gridScrollRef.current.scrollBy({ left: 80, behavior: 'smooth' });
                          }
                        }, 50);
                      }}
                      aria-label="Show more services"
                    >
                      +
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-4 sm:mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
          Our Services
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Professional home services tailored to your needs
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse h-40"
            ></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No services available
          </h3>
          <p className="mt-1 text-sm text-gray-500">Please check back later</p>
        </div>
      ) : (
        <div className="relative w-full">
          {/* Product Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 pt-2 hide-scrollbar scroll-smooth ml-7 mr-7"
            style={{ scrollBehavior: 'smooth' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onScroll={handleScroll}
          >
            {products.map((product, idx) => {
              const colorPalette = [
                'bg-green-700 text-white',
                'bg-blue-700 text-white',
                'bg-yellow-500 text-black',
                'bg-pink-600 text-white',
                'bg-purple-700 text-white',
                'bg-red-600 text-white',
                'bg-cyan-700 text-white',
                'bg-orange-500 text-white',
                'bg-gray-900 text-white',
                'bg-lime-600 text-white',
                'bg-teal-700 text-white',
                'bg-fuchsia-700 text-white',
                'bg-amber-700 text-white',
                'bg-emerald-700 text-white',
                'bg-indigo-700 text-white',
              ];
              const btnColors = [
                'bg-green-900 hover:bg-green-800 text-white',
                'bg-blue-900 hover:bg-blue-800 text-white',
                'bg-yellow-700 hover:bg-yellow-600 text-black',
                'bg-pink-800 hover:bg-pink-700 text-white',
                'bg-purple-900 hover:bg-purple-800 text-white',
                'bg-red-800 hover:bg-red-700 text-white',
                'bg-cyan-900 hover:bg-cyan-800 text-white',
                'bg-orange-700 hover:bg-orange-600 text-white',
                'bg-gray-800 hover:bg-gray-700 text-white',
                'bg-lime-800 hover:bg-lime-700 text-white',
                'bg-teal-900 hover:bg-teal-800 text-white',
                'bg-fuchsia-900 hover:bg-fuchsia-800 text-white',
                'bg-amber-800 hover:bg-amber-700 text-white',
                'bg-emerald-900 hover:bg-emerald-800 text-white',
                'bg-indigo-900 hover:bg-indigo-800 text-white',
              ];
              return (
                <div
                  key={product._id}
                  className={`rounded-2xl shadow-lg flex flex-row items-center w-[350px] h-[160px] overflow-hidden flex-shrink-0 ${colorPalette[idx % colorPalette.length]}`}
                >
                  <div className="flex-1 flex flex-col justify-between h-full p-5">
                    <div>
                      <h2 className="text-l font-bold mb-2 leading-tight">
                        {product.name}
                      </h2>
                      <p className="text-sm opacity-60 mb-4">
                        {product.description || 'Professional service for your needs'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className={`rounded-lg px-4 py-2 font-semibold text-sm mt-auto w-fit ${btnColors[idx % btnColors.length]}`}
                    >
                      Book now
                    </button>
                  </div>
                  <div className="h-full w-1/2 flex items-center justify-center p-2">
                    <img
                      src={
                        Array.isArray(product.images) && product.images[0]
                          ? `${BASE_URL}/uploads/${product.images[0]}`
                          : 'https://via.placeholder.com/120x120?text=Service'
                      }
                      alt={product.name}
                      className="object-cover rounded-xl h-[120px] w-[120px]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Pagination */}
          <div className="flex justify-center mt-2">
            {products.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-200 ${currentIndex === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                  }
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Subservices Sections */}
          <div className="mt-16 px-4 md:px-6">
            {/* Electrician Subservices */}
            <div className="w-full px-4 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-blue-500">Electrician Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products
                  .find((p) => p.name.toLowerCase() === "electrician")
                  ?.subServices?.map((sub, idx) => {
                    const product = products.find((p) => p.name.toLowerCase() === "electrician");
                    return (
                      <Link
                        key={sub._id || sub.name || idx}
                        to={`/subservices/${product._id}`}
                        className="relative h-40 rounded-lg overflow-hidden bg-cover bg-center shadow-lg group"
                        style={{
                          backgroundImage: `url(${sub.image ? `${BASE_URL}/uploads/${sub.image}` : '/default-service-icon.svg'})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-semibold text-center px-2">{sub.name}</span>
                        </div>
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-sm text-center py-1">{sub.name}</div>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Appliance Repair Subservices */}
            <div className="w-full px-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-green-500">Appliance Repair Services</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products
                  .find((p) => p.name.toLowerCase() === "appliance repair")
                  ?.subServices?.map((sub, idx) => {
                    const product = products.find((p) => p.name.toLowerCase() === "appliance repair");
                    return (
                      <Link
                        key={sub._id || sub.name || idx}
                        to={`/subservices/${product._id}`}
                        className="relative h-40 rounded-lg overflow-hidden bg-cover bg-center shadow-lg group"
                        style={{
                          backgroundImage: `url(${sub.image ? `${BASE_URL}/uploads/${sub.image}` : '/default-service-icon.svg'})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-semibold text-center px-2">{sub.name}</span>
                        </div>
                        <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-sm text-center py-1">{sub.name}</div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-blue-50 py-12 mb-16 mt-12 w-full">
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
        </div>
      )}
    </div>
  );
}