import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { CheckCircle } from "lucide-react";
import useAuthStore from "../../../store/authStore";

const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleCreateListing = () => {
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
    <section className="py-16 md:py-20 bg-gradient-to-r from-brand-green to-brand-olive relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to Make a Difference?
          </h2>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Join thousands of users contributing to a cleaner, greener planet.
            Start your e-waste recycling journey today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateListing}
              className="px-8 py-4 bg-white text-brand-green rounded-lg hover:bg-brand-light transition-all duration-300 font-bold text-base shadow-2xl flex items-center gap-3 group"
            >
              {isAuthenticated
                ? "Go to Dashboard"
                : "Create Your First Listing"}
              <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLearnMore}
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-brand-green transition-all duration-300 font-bold text-base"
            >
              Learn More
            </motion.button>
          </div>

          <div className="pt-8 text-white/80">
            <p className="text-sm flex items-center gap-3 flex-wrap justify-center">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Free listing</span>
              <span>•</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Certified recyclers</span>
              <span>•</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Quick pickup</span>
              <span>•</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Real-time tracking</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
