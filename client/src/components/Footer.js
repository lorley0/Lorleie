import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
          
          {/* User Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">User Account</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-blue-400 transition duration-300">Log In</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-blue-400 transition duration-300">Create an Account</Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-blue-400 transition duration-300">View Profile</Link>
              </li>
            </ul>
          </div>

          {/* Business Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/business/register" className="text-gray-400 hover:text-blue-400 transition duration-300">Register Your Business</Link>
              </li>
              <li>
                <Link to="/business/login" className="text-gray-400 hover:text-blue-400 transition duration-300">Business Log In</Link>
              </li>
              <li>
                <Link to="/business/listing" className="text-gray-400 hover:text-blue-400 transition duration-300">Explore Listings</Link>
              </li>
              <li>
                <Link to="/business/profile" className="text-gray-400 hover:text-blue-400 transition duration-300">Manage Your Profile</Link>
              </li>
              <li>
                <Link to="/business/dashboard" className="text-gray-400 hover:text-blue-400 transition duration-300">Business Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Review Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Feedback & Reviews</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/business/review" className="text-gray-400 hover:text-blue-400 transition duration-300">Submit a Review</Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition duration-300">Return to Home</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Notice */}
        <p className="text-center text-sm mt-6">
          &copy; {new Date().getFullYear()} Lorley. All rights reserved. Connect with us to enhance your experience!
        </p>
      </div>
    </footer>
  );
};

export default Footer;
