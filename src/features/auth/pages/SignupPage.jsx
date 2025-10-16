import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Loader2, CheckCircle2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../../components/ui/input";
import PasswordInput from "../../../components/ui/password-input";
import Checkbox from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import { useSignup } from "../../../services/authService";

const SignupPage = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "user",
    agreeToTerms: false,
  });

  // Separate state for addresses array
  const [addresses, setAddresses] = useState([{ address: "" }]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // if (!formData.password) {
    //   newErrors.password = 'Password is required';
    // } else if (formData.password.length < 4) {
    //   newErrors.password = 'Password must be at least 4 characters';
    // } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    //   newErrors.password = 'Password must contain uppercase, lowercase, and number';
    // }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate addresses array
    const hasEmptyAddress = addresses.some((addr) => !addr.address.trim());
    if (addresses.length === 0 || hasEmptyAddress) {
      newErrors.addresses = "At least one address is required";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
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

  // Address management functions
  const handleAddressChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].address = value;
    setAddresses(newAddresses);
    // Clear error when user types
    if (errors.addresses) {
      setErrors((prev) => ({ ...prev, addresses: "" }));
    }
  };

  const addAddress = () => {
    setAddresses([...addresses, { address: "" }]);
  };

  const removeAddress = (index) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    } else {
      toast.error("At least one address is required");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const signupData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      addresses: addresses, // Use the addresses array directly
      userType: formData.userType,
    };

    signup(signupData, {
      onSuccess: (data) => {
        toast.success(
          "Account created successfully! Please login to continue."
        );
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Signup failed. Please try again."
        );
      },
    });
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
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-olive">Rebot</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600">Join us in making a greener future</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              autoComplete="name"
              autoFocus
            />

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
            />

            {/* Dynamic Address Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address(es) <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-3">
                {addresses.map((addr, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Address ${index + 1}`}
                      value={addr.address}
                      onChange={(e) =>
                        handleAddressChange(index, e.target.value)
                      }
                      className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent placeholder:text-gray-400"
                      required
                    />
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAddress(index)}
                        className="h-11 w-11 flex items-center justify-center rounded-lg border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Remove address"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addAddress}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-green hover:text-white border border-brand-green hover:bg-brand-green rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Address
                </button>
              </div>
              {errors.addresses && (
                <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.addresses}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Account Type <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
              >
                <option value="user">User</option>
                <option value="recycler">Recycler</option>
                <option value="delivery">Delivery Partner</option>
              </select>
            </div>

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              showStrengthIndicator
              autoComplete="new-password"
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            <Checkbox
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              error={errors.agreeToTerms}
              label={
                <span>
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-brand-green hover:text-brand-green-dark"
                  >
                    Terms & Conditions
                  </Link>
                </span>
              }
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-brand-green hover:bg-brand-green-dark text-white font-medium rounded-lg transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login (Optional for future) */}
            <div className="text-center text-sm text-gray-600">
              Social signup coming soon...
            </div>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand-green hover:text-brand-green-dark transition-colors"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-olive to-brand-green p-12 items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-white max-w-lg"
        >
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Be part of the solution. Create an account today and start your
              journey towards sustainable e-waste management.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Quick and easy registration",
              "Secure account protection",
              "Access to all features",
              "Join thousands of users",
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
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
