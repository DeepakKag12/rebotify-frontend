import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../../components/ui/input";
import PasswordInput from "../../../components/ui/password-input";
import Checkbox from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import { useLogin } from "../../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    login(
      { email: formData.email, password: formData.password },
      {
        onSuccess: (data) => {
          toast.success("Login successful! Redirecting...");

          // Redirect based on user type
          setTimeout(() => {
            switch (data.user.userType) {
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
          }, 1000);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Login failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-olive">Rebot</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
              autoFocus
            />

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                label="Remember me"
              />
              <Link
                to="/forgot-password"
                className="text-sm text-brand-green hover:text-brand-green-dark transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-brand-green hover:bg-brand-green-dark text-white font-medium rounded-lg transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login (Optional for future) */}
            <div className="text-center text-sm text-gray-600">
              Social login coming soon...
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-brand-green hover:text-brand-green-dark transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-green to-brand-olive p-12 items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-white max-w-lg"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Welcome to Rebot</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Join the movement towards a sustainable future. Manage your
              e-waste responsibly and contribute to a greener planet.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Track your e-waste disposal",
              "Connect with certified recyclers",
              "Earn rewards for responsible recycling",
              "Make a positive environmental impact",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-white/90">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
