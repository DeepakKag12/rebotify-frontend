import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaRecycle, FaLeaf, FaCheckCircle } from "react-icons/fa";
import useAuthStore from "../../../store/authStore";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      switch (user?.userType) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "recycler":
          navigate("/recycler/dashboard");
          break;
        case "delivery":
          navigate("/delivery-partner/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
    } else {
      navigate("/signup");
    }
  };

  const handleLearnMore = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center bg-gradient-to-br from-white via-brand-light/30 to-white overflow-hidden pt-24 pb-16 w-full">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-olive/5 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 relative z-10">
        <div className="grid lg:grid-cols-[0.9fr,1.3fr] gap-8 xl:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green/10 rounded-full text-brand-green text-sm font-semibold mb-6"
            >
              <FaLeaf />
              <span>Sustainable Recycling Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-black leading-tight mb-6"
            >
              Responsible{" "}
              <span className="bg-gradient-to-r from-brand-green to-brand-olive bg-clip-text text-transparent">
                E-Waste
              </span>
              <br />
              Disposal Made Simple
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-brand-gray-medium mb-8 leading-relaxed max-w-lg"
            >
              Connect with certified recyclers and make a positive impact on the environment. 
              Safely dispose of your electronic waste in just a few clicks.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-brand-green to-brand-green-light text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMore}
                className="px-8 py-4 border-2 border-brand-olive text-brand-olive rounded-xl hover:bg-brand-olive hover:text-white transition-all duration-300 font-bold text-lg"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-to-r from-brand-green to-brand-green-light bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-sm text-brand-gray-medium font-medium">Items Recycled</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-to-r from-brand-green to-brand-green-light bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-brand-gray-medium font-medium">Happy Users</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold bg-gradient-to-r from-brand-green to-brand-green-light bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-brand-gray-medium font-medium">Recyclers</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block w-full h-full"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[600px] h-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/Waste.jpg')",
                }}
              ></div>
              
              {/* Gradient Overlay - Improved for better content visibility with subtle green tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-emerald-900/40 to-gray-900/60"></div>
              
              {/* Content */}
              <div className="relative z-10 p-16 xl:p-20 flex flex-col justify-between min-h-[600px] h-full">

              <div className="space-y-12 text-white mt-24">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center space-x-5"
                >
                  <div className="bg-white/40 backdrop-blur-md rounded-full p-5 shadow-xl">
                    <FaRecycle className="text-4xl text-gray-900 drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Safe Disposal</h3>
                    <p className="text-white/95 text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Certified recyclers</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="flex items-center space-x-5"
                >
                  <div className="bg-white/40 backdrop-blur-md rounded-full p-5 shadow-xl">
                    <FaCheckCircle className="text-4xl text-gray-900 drop-shadow-lg" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Easy Tracking</h3>
                    <p className="text-white/95 text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Monitor your items</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="bg-white/25 rounded-2xl p-8 backdrop-blur-lg shadow-2xl border border-white/40"
                >
                  <p className="text-xl italic leading-relaxed text-white font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    "Join thousands of users making a difference. Your old electronics can have a new purpose."
                  </p>
                </motion.div>
              </div>
              </div>

              {/* Decorative circles - Reduced and subtle */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-green/20 rounded-full blur-2xl"></div>
              <div className="absolute top-1/3 -right-8 w-32 h-32 bg-brand-olive/15 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
