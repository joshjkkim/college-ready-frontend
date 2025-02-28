import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ isLoaded, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-b from-indigo-900 to-blue-800 text-white shadow-lg transition-transform duration-1000 ease-out">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <Link to="" className="flex items-center hover:text-indigo-500">
        <img src="/icon.png" alt="CollegeReady Logo" className="h-10 w-auto mr-2" />
        <span className="text-2xl font-bold">CollegeReady</span>
      </Link>

        {/* Hamburger Menu Button for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-indigo-500 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-500 transition-colors duration-200">
                About
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-indigo-500 transition-colors duration-200">
                Search
              </Link>
            </li>
            <li>
              <Link to="/essays" className="hover:text-indigo-500 transition-colors duration-200">
                Essays
              </Link>
            </li>
            <li>
              <Link to="/usercolleges" className="hover:text-indigo-500 transition-colors duration-200">
                Your Colleges
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-indigo-500 transition-colors duration-200">
                Profile
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin" className="hover:text-indigo-500 transition-colors duration-200">
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-900 to-blue-800">
          <nav>
            <ul className="px-2 pt-2 pb-4 space-y-1">
              <li>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-500"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-500"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/essays"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-500"
                >
                  Essays
                </Link>
              </li>
              <li>
                <Link
                  to="/usercolleges"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-500"
                >
                  Your Colleges
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-500"
                >
                  Profile
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-indigo-500"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
