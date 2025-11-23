import React from 'react';
import { FaUsers, FaLightbulb, FaRocket } from 'react-icons/fa';

const Aboutus = () => {
  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About SAUS Frontend</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn more about our mission, vision, and the team behind this innovative platform.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          We are dedicated to providing cutting-edge predictive analytics tools that empower businesses 
          to make data-driven decisions. Our platform combines advanced algorithms with intuitive design 
          to deliver actionable insights from complex datasets.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
        <p className="text-gray-600 mb-6">
          To become the leading provider of predictive analytics solutions, helping organizations across 
          industries harness the power of data to drive innovation, efficiency, and growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaUsers className="text-blue-600 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Team</h3>
          <p className="text-gray-600">
            Our team consists of data scientists, engineers, and designers committed to excellence.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaLightbulb className="text-yellow-500 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
          <p className="text-gray-600">
            We continuously innovate to provide the most advanced predictive analytics tools.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <FaRocket className="text-red-500 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Performance</h3>
          <p className="text-gray-600">
            Our solutions are optimized for speed and accuracy to deliver real-time insights.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-8 max-w-4xl mx-auto text-white text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">
          Join thousands of satisfied users who are already leveraging our predictive analytics platform.
        </p>
        <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
          Contact Us Today
        </button>
      </div>
    </div>
  );
};

export default Aboutus;