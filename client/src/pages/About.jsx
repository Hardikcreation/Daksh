import React from "react";

const About = () => {
  const services = [
    { name: "AC Repair", description: "Expert AC servicing, gas filling, and installation by certified technicians.", icon: "❄" },
    { name: "Plumbing", description: "24/7 plumbing solutions for leaks, blockages, and installations.", icon: "🚰" },
    { name: "Electrical", description: "Safe wiring, fixture installation, and electrical repairs by licensed electricians.", icon: "💡" },
    { name: "TV Repair", description: "Professional diagnosis and repair for all TV brands and models.", icon: "📺" },
    { name: "Painting", description: "Interior and exterior painting with premium quality materials.", icon: "🎨" },
    { name: "Appliance Repair", description: "Fixing washing machines, refrigerators, and other home appliances.", icon: "🛠" }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4"></div>

      {/* Hero Section */}
      <div className="relative bg-blue-600 text-white py-12 md:py-20">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Daksh</h1>
          <p className="text-xl mb-6">Your trusted partner for all home service needs</p>
          <button className="bg-white text-blue-600 px-4 py-2 rounded">Login</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-black">
        {/* Introduction Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 w-full">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Professional service"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="md:w-1/2 w-full">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Choose Daksh?</h2>
              <p className="text-lg mb-4 text-gray-700">
                Daksh revolutionizes home services by offering professional, affordable, and reliable solutions right at your doorstep.
              </p>
              <p className="text-lg text-gray-700">
                Our mission is to make home maintenance simple, accessible, and stress-free for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="mb-16 p-8 rounded-xl shadow-md bg-white">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { icon: "🏆", title: "Verified Professionals", text: "Every service provider is vetted with background checks and has a minimum of 1 year experience." },
              { icon: "⏱", title: "Quick Response", text: "Average response time under 30 minutes. Most services completed same day." },
              { icon: "💰", title: "Transparent Pricing", text: "No hidden charges. Upfront pricing with 100% satisfaction guarantee." },
            ].map((item, idx) => (
              <div key={idx} className="bg-blue-50 p-6 rounded-lg">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-base text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Our Services
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-base text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-blue-600 text-white p-8 rounded-xl">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Book a Service",
              "Get Matched",
              "Professional Service",
              "Job Done"
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-white text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  {idx + 1}
                </div>
                <h3 className="font-semibold mb-2 text-base">{step}</h3>
                <p className="text-sm text-blue-100">
                  {
                    [
                      "Select your service and time through our app or website",
                      "We connect you with the best professional in your area",
                      "Expert arrives on time with tools and parts",
                      "Pay only after you're 100% satisfied"
                    ][idx]
                  }
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
