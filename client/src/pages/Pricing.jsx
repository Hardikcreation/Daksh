import React from "react";

const plans = [
  {
    title: "Basic",
    price: "₹999",
    duration: "month",
    description: "Enjoy essential services for one month",
    features: [
      "Access to standard repair services",
      "Covers top 5 products repairing",
      "Email & phone support",
    ],
    buttonText: "Your current plan",
    disabled: true,
  },
  {
    title: "Plus",
    price: "₹1999",
    duration: "month",
    description: "Upgrade for more services and convenience",
    features: [
      "Everything in Basic",
      "Priority booking",
      "Discount on additional services",
      "Access to premium service partners",
    ],
    buttonText: "Get Plus",
    disabled: false,
  },
  {
    title: "Premium",
    price: "₹4999",
    duration: "month",
    description: "Unlock all services with full benefits",
    features: [
      "Everything in Plus",
      "Unlimited product repairs",
      "Home care and maintenance",
      "24/7 support",
    ],
    buttonText: "Get Premium",
    disabled: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Upgrade Your Plan –{" "}
          <span className="text-yellow-400">Daksh Membership</span>
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan that fits your needs and get access to premium
          repair services.
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden shadow-lg p-6 w-full lg:w-1/3 flex flex-col 
                ${
                  index === 1
                    ? "border-2 border-yellow-400 transform lg:-translate-y-4 shadow-xl"
                    : "border border-gray-200"
                }
                transition-all duration-300 hover:shadow-xl bg-white`}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs font-bold px-3 py-1 transform rotate-12 translate-x-2 -translate-y-1">
                  POPULAR
                </div>
              )}

              <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
              <div className="mb-4">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-lg text-gray-500">/{plan.duration}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="border-t border-gray-200 my-4"></div>

              <ul className="flex-1 space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 text-yellow-500 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-auto px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200
                  ${
                    plan.disabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-105"
                  }`}
                disabled={plan.disabled}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center text-gray-500 mt-12 text-sm">
          Need help choosing?{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:underline"
            herf=""
          >
            Contact our team
          </span>
        </div>
      </div>
    </div>
  );
}