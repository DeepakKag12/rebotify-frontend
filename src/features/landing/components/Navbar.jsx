import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import useAuthStore from "../../../store/authStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const menuItems = ["Home", "How It Works", "About Us", "Services", "Contact"];

  const scrollToSection = (item) => {
    const sectionId = item.toLowerCase().replace(/\s+/g, "-");
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleCreateListing = () => {
    if (isAuthenticated) {
      // Redirect to user's dashboard based on their role
      switch (user?.userType) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "recycler":
          navigate("/recycler/dashboard");
          break;
        case "delivery-partner":
          navigate("/delivery-partner/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
    } else {
      navigate("/signup");
    }
    setIsOpen(false);
  };

  const handleSignIn = () => {
    if (isAuthenticated) {
      // Redirect to user's dashboard based on their role
      switch (user?.userType) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "recycler":
          navigate("/recycler/dashboard");
          break;
        case "delivery-partner":
          navigate("/delivery-partner/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
    } else {
      navigate("/login");
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-light shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center cursor-pointer"
            >
              <span className="text-2xl font-bold text-brand-green">
                E-Waste<span className="text-brand-olive">Hub</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(item)}
                className="text-brand-black hover:text-brand-green transition-colors duration-300 font-medium"
              >
                {item}
              </motion.button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleCreateListing}
              className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              onClick={handleSignIn}
              className="px-6 py-2 border-2 border-brand-olive text-brand-olive rounded-lg hover:bg-brand-olive hover:text-white transition-all duration-300 font-semibold"
            >
              {isAuthenticated ? "My Account" : "Sign In"}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-black hover:text-brand-green transition-colors"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-brand-light-dark"
        >
          <div className="px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="block w-full text-left py-2 text-brand-black hover:text-brand-green transition-colors font-medium"
              >
                {item}
              </button>
            ))}
            <div className="pt-4 space-y-2">
              <button
                onClick={handleCreateListing}
                className="w-full px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-all duration-300 font-semibold"
              >
                {isAuthenticated ? "Dashboard" : "Get Started"}
              </button>
              <button
                onClick={handleSignIn}
                className="w-full px-6 py-2 border-2 border-brand-olive text-brand-olive rounded-lg hover:bg-brand-olive hover:text-white transition-all duration-300 font-semibold"
              >
                {isAuthenticated ? "My Account" : "Sign In"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
