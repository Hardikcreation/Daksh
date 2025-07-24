import React from "react";

export default function AntiDiscriminationPolicy() {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-200 transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-indigo-800 tracking-tight">
          Anti-Discrimination Policy
        </h1>

        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            <span className="font-semibold">Daksh Call Karigar</span> seeks to empower thousands of service professionals across India to deliver safe, reliable, and high-quality services at home. 
            We do <span className="font-semibold text-indigo-700">not tolerate</span>, and explicitly prohibit, any form of discrimination against customers or service providers.
          </p>

          <p>
            This includes — but is not limited to — discrimination based on:
            <span className="block mt-2 ml-4 text-gray-800">
              religion, caste, race, national origin, disability, sexual orientation, sex, marital status, gender identity, age, or any other legally protected status.
            </span>
          </p>

          <p>
            Any refusal to provide or accept services based on these characteristics will be treated as a violation of our policies.
          </p>

          <p className="font-medium text-red-600">
            Any customer or service partner found in violation will lose access to the Daksh Call Karigar platform permanently.
          </p>
        </div>
      </div>
    </div>
  );
}
