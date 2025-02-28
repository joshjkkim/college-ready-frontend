import { Link } from "react-router-dom";

const Header = ({ isLoaded, isAdmin }) => (
  <header className="bg-gradient-to-b from-indigo-900 to-blue-800 text-white shadow-lg transition-transform duration-1000 ease-out">
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold hover:text-indigo-500">
        CollegeReady
      </Link>

      <nav>
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
          {/* Only display the Admin link if the user is an admin */}
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
  </header>
);

export default Header;
