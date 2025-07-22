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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 text-left md:text-center">
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Home services
          </span>{" "}
          at your doorstep
        </h1>
        <p className="text-gray-600 mt-3 text-center hidden md:block">
          Book professional services with just a few clicks
        </p>
      </div>

      {/* Main Section: Left Card + Right Images */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch mb-10">
        {/* Left: Card with Top Services */}
        <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-center transition-all duration-300 hover:shadow-xl">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
            What are you looking for?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
            {isLoading ? (
              <div className="col-span-2 sm:col-span-3 text-center">
                <div className="animate-pulse flex space-x-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 w-full bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="col-span-2 sm:col-span-3 text-red-500">{error}</div>
            ) : (
              products.slice(0, 6).map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 shadow-sm p-3 transition-all duration-300 group hover:border-blue-200 hover:shadow-md"
                  onClick={() => navigate(`/subservices/${product._id}`)}
                >
                  <div className="">
                    <img
                      src={
                        Array.isArray(product.images) && product.images[0]
                          ? `${BASE_URL}/uploads/${product.images[0]}`
                          : "/default-service-icon.svg"
                      }
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 text-center font-medium truncate w-full">
                    {product.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Image Grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 grid-rows-2 gap-3 h-[320px] sm:h-[360px] md:h-[400px]">
          {(() => {
            const images = (products.filter(p => Array.isArray(p.images) && p.images[0]).slice(0, 4));
            while (images.length < 4) images.push({ images: [null], name: "Service" });

            return (
              <>
                <div className="row-span-2 overflow-hidden bg-gray-100 flex items-center justify-center h-full rounded-l-2xl relative group">
                  <img
                    src={images[0].images && images[0].images[0] ? `${BASE_URL}/uploads/${images[0].images[0]}` : "/default-service.jpg"}
                    alt={images[0].name || "Service"}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {images[0].name || "Service"}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden bg-gray-100 flex items-center justify-center h-full rounded-tr-2xl relative group">
                  <img
                    src={images[1].images && images[1].images[0] ? `${BASE_URL}/uploads/${images[1].images[0]}` : "/default-service.jpg"}
                    alt={images[1].name || "Service"}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-bold text-sm md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {images[1].name || "Service"}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden bg-gray-100 flex items-center justify-center h-full rounded-br-2xl relative group">
                  <img
                    src={images[2].images && images[2].images[0] ? `${BASE_URL}/uploads/${images[2].images[0]}` : "/default-service.jpg"}
                    alt={images[2].name || "Service"}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-bold text-sm md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {images[2].name || "Service"}
                    </span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
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
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 font-medium hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse h-40"
            ></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No services available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find any services at the moment
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="relative w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Our <span className="text-blue-600">Services</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Professional services tailored to your needs
            </p>
          </div>

          {/* Product Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 hide-scrollbar scroll-smooth px-4"
            style={{ scrollBehavior: 'smooth' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onScroll={handleScroll}
          >
            {products.map((product, idx) => {
              const colorPalette = [
                'bg-gradient-to-br from-green-600 to-green-800 text-white',
                'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
                'bg-gradient-to-br from-yellow-500 to-yellow-700 text-gray-900',
                'bg-gradient-to-br from-pink-600 to-pink-800 text-white',
                'bg-gradient-to-br from-purple-600 to-purple-800 text-white',
                'bg-gradient-to-br from-red-600 to-red-800 text-white',
                'bg-gradient-to-br from-cyan-600 to-cyan-800 text-white',
                'bg-gradient-to-br from-orange-500 to-orange-700 text-white',
                'bg-gradient-to-br from-gray-800 to-gray-900 text-white',
                'bg-gradient-to-br from-lime-600 to-lime-800 text-white',
                'bg-gradient-to-br from-teal-600 to-teal-800 text-white',
                'bg-gradient-to-br from-fuchsia-600 to-fuchsia-800 text-white',
                'bg-gradient-to-br from-amber-600 to-amber-800 text-white',
                'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white',
                'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white',
              ];
              const btnColors = [
                'bg-green-900 hover:bg-green-800 text-white',
                'bg-blue-900 hover:bg-blue-800 text-white',
                'bg-yellow-700 hover:bg-yellow-600 text-gray-900',
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
                  className={`rounded-2xl shadow-lg flex flex-row items-center w-[350px] h-[160px] overflow-hidden flex-shrink-0 transition-all duration-300 hover:shadow-xl ${colorPalette[idx % colorPalette.length]}`}
                >
                  <div className="flex-1 flex flex-col justify-between h-full p-5">
                    <div>
                      <h2 className="text-lg font-bold mb-2 leading-tight line-clamp-2">
                        {product.name}
                      </h2>
                      <p className="text-sm opacity-80 mb-4 line-clamp-2">
                        {product.description || 'Professional service for your needs'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className={`rounded-lg px-4 py-2 font-semibold text-sm mt-auto w-fit transition-colors duration-300 ${btnColors[idx % btnColors.length]}`}
                    >
                      Book now
                    </button>
                  </div>
                  <div className="h-full w-1/2 flex items-center justify-center p-2">
                    <div className="relative w-full h-full overflow-hidden rounded-xl">
                      <img
                        src={
                          Array.isArray(product.images) && product.images[0]
                            ? `${BASE_URL}/uploads/${product.images[0]}`
                            : 'https://via.placeholder.com/120x120?text=Service'
                        }
                        alt={product.name}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Pagination */}
          {products.length > 1 && (
            <div className="flex justify-center mt-4">
              <div className="inline-flex space-x-2 p-1 bg-gray-100 rounded-full">
                {products.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${currentIndex === idx ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
                    onClick={() => {
                      if (scrollRef.current) {
                        scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                      }
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Subservices Sections */}
          <div className="mt-16 px-4 md:px-6">
            {/* Electrician Subservices */}
            <div className="w-full px-4 mb-12">
              <div className="flex items-center mb-6">
                <div className="h-8 w-2 bg-blue-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-800">Electrician Services</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products
                  .find((p) => p.name.toLowerCase() === "electrician")
                  ?.subServices?.map((sub, idx) => {
                    const product = products.find((p) => p.name.toLowerCase() === "electrician");
                    return (
                      <Link
                        key={sub._id || sub.name || idx}
                        to={`/subservices/${product._id}`}
                        className="relative h-40 rounded-lg overflow-hidden bg-cover bg-center shadow-md group transition-all duration-300 hover:shadow-lg"
                        style={{
                          backgroundImage: `url(${sub.image ? `${BASE_URL}/uploads/${sub.image}` : '/default-service-icon.svg'})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white font-semibold text-center px-2 text-lg">
                            {sub.name}
                          </span>
                        </div>
                        <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="text-white text-sm font-medium">{sub.name}</div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Appliance Repair Subservices */}
            <div className="w-full px-4">
              <div className="flex items-center mb-6">
                <div className="h-8 w-2 bg-green-500 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-800">Appliance Repair Services</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products
                  .find((p) => p.name.toLowerCase() === "appliance repair")
                  ?.subServices?.map((sub, idx) => {
                    const product = products.find((p) => p.name.toLowerCase() === "appliance repair");
                    return (
                      <Link
                        key={sub._id || sub.name || idx}
                        to={`/subservices/${product._id}`}
                        className="relative h-40 rounded-lg overflow-hidden bg-cover bg-center shadow-md group transition-all duration-300 hover:shadow-lg"
                        style={{
                          backgroundImage: `url(${sub.image ? `${BASE_URL}/uploads/${sub.image}` : '/default-service-icon.svg'})`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white font-semibold text-center px-2 text-lg">
                            {sub.name}
                          </span>
                        </div>
                        <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <div className="text-white text-sm font-medium">{sub.name}</div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 mb-16 mt-12 w-full rounded-2xl overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-1/2 relative">
                    <img
                      src="/img/allinoone.jpg"
                      alt="Professional Service"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-600/10"></div>
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Why Choose Our Services?
                    </h2>
                    <ul className="space-y-3">
                      {[
                        "Certified and background-checked professionals",
                        "Same-day service availability",
                        "100% satisfaction guarantee",
                        "Transparent pricing with no hidden fees",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg
                                className="h-4 w-4 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                          <span className="ml-3 text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/about"
                      className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition duration-300 self-start"
                    >
                      Learn More
                      <svg
                        className="ml-2 -mr-1 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
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