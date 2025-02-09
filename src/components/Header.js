import { Link } from "react-router-dom";

const Header = ({ isLoaded }) => (
  <header
    className={`bg-gray-900 text-white shadow-md transition-transform duration-1000 ease-out ${
      isLoaded ? "transform translate-y-0 opacity-100" : "transform translate-y-[-50px] opacity-0"
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold hover:text-indigo-500">
        CollegeReady
      </Link>

      {/* Navigation */}
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/search"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              Search
            </Link>
          </li>
          <li>
            <Link
              to="/user"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              User
            </Link>
          </li>
          <li>
            <Link
              to="/essays"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              Essays
            </Link>
          </li>

          <li>
            <Link
              to="/profile"
              className="hover:text-indigo-500 transition-colors duration-200"
            >
              Me
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
